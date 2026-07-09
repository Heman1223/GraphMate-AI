// script.js
// Browser-side implementation of your C++ logic (normalize, BFS depth-2 mutuals, interest matching)
// Persists in localStorage so demo state survives refresh.

///////// Utilities //////////
function normalizeName(s) {
  return s.trim().toLowerCase();
}

function saveState() {
  localStorage.setItem('fr_demo_graph', JSON.stringify(graph));
  localStorage.setItem('fr_demo_interests', JSON.stringify(interestsToObj()));
}
function loadState() {
  const g = localStorage.getItem('fr_demo_graph');
  const it = localStorage.getItem('fr_demo_interests');
  if (g) graph = JSON.parse(g);
  if (it) {
    const obj = JSON.parse(it);
    // convert back to sets
    for (const k in obj) {
      interests[k] = new Set(obj[k]); //set
    }
  }
}
function interestsToObj() {
  const out = {};
  for (const k in interests) out[k] = Array.from(interests[k]);
  return out;
}

// graph: name -> array of friends
let graph = {};             // adjacency lists
let interests = {};         // name -> Set of interests

function ensureUser(name) {
  if (!graph[name]) graph[name] = [];
  if (!interests[name]) interests[name] = new Set(); //set
}
//Graph
function addFriend(a,b) {
  a = normalizeName(a); b = normalizeName(b);
  if (!a || !b) return;
  ensureUser(a); ensureUser(b);
  if (!graph[a].includes(b)) graph[a].push(b);
  if (!graph[b].includes(a)) graph[b].push(a);
  saveState();
  redrawGraph();
}

function addInterest(user, intr) {
  user = normalizeName(user);
  intr = intr.trim().toLowerCase();
  if (!user || !intr) return;
  ensureUser(user);
  interests[user].add(intr);
  saveState();
  redrawInterestChips(user);
  redrawGraph();
}

// BFS depth 2 from user to collect friends-of-friends (mutual friends count)
// Then count shared interests for non-friends. Score = 2*mutualFriends + 1*sharedInterests
function suggestFor(user) {
  user = normalizeName(user);
  if (!graph[user] && !interests[user]) return [];

  const mutualCount = {}; 
  const visited = new Set();
  const q = [];
  visited.add(user);
  q.push({node:user, depth:0});

  while (q.length) {
    const {node, depth} = q.shift();
    if (depth >= 2) continue;
    const neighbors = graph[node] || [];
    for (let i=0;i<neighbors.length;i++) {
      const neighbor = neighbors[i];
      if (neighbor === user) continue;
      if (depth === 1) {
        // neighbor is friend-of-friend (node is friend)
        // skip if already direct friend
        const isDirect = (graph[user] || []).includes(neighbor);
        if (!isDirect) mutualCount[neighbor] = (mutualCount[neighbor]||0) + 1;
      }
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        q.push({node:neighbor, depth: depth+1});
      }
    }
  }

  // mutual interests
  const userInterests = new Set(interests[user] ? interests[user] : []);
  for (const other in interests) {
    if (other === user) continue;
    // skip direct friends
    if ((graph[user] || []).includes(other)) continue;
    // count shared
    let shared = 0;
    const commons = [];
    for (const it of interests[other]) {
      if (userInterests.has(it)) { shared++; commons.push(it); }
    }
    if (shared>0) {
      mutualCount[other] = (mutualCount[other] || 0) + shared;
    }
  }

  // Build array with breakdown
  const arr = [];
  for (const cand in mutualCount) {
    // compute mutualFriends explicitly (intersection between graph[user] and graph[cand])
    let mutualFriends = 0;
    const setUF = new Set(graph[user] || []);
    for (const f of graph[cand] || []) if (setUF.has(f)) mutualFriends++;
    let sharedInterests = 0; const commonList = [];
    for (const it of interests[user] || []) {
      if ((interests[cand] || new Set()).has(it)) { sharedInterests++; commonList.push(it); }
    }
    const score = mutualFriends*2 + sharedInterests;
    if (score <= 0) continue;
    arr.push({name:cand, score, mutual: mutualFriends, shared: sharedInterests, commons: commonList});
  }

  // sort
  arr.sort((a,b) => b.score - a.score || b.mutual - a.mutual || b.shared - a.shared || a.name.localeCompare(b.name));
  return arr;
}

///////// UI & Graph //////////
const container = document.getElementById ? null : null; // avoid lint error

// vis-network setup
let network = null;
function redrawGraph() {
  const container = document.getElementById('network');
  const nodes = [], edges = [];
  const names = Object.keys(graph);
  names.forEach(name => {
    nodes.push({id: name, label: name, value: Math.max(1, (graph[name] || []).length)});
    (graph[name] || []).forEach(f => {
      // add edge once (vis will dedupe directional duplicates visually)
      edges.push({from: name, to: f});
    });
  });
  const data = { nodes: new vis.DataSet(nodes), edges: new vis.DataSet(edges) };
  const options = {
    nodes: {
      shape: 'box',
      margin: 10,
      font: { size: 14, color: '#111' },
      color: {
        background: '#ffffff',
        border: '#2563eb',
        highlight: {
          background: '#e0f0ff',
          border: '#2563eb'
        },
        hover: {
          background: '#f0f8ff',
          border: '#1e40af'
        }
      },
      borderWidth: 1,
      borderWidthSelected: 2,
      shadow: {
        enabled: true,
        size: 10,
        x: 2,
        y: 2,
        color: 'rgba(37, 99, 235, 0.25)'
      }
    },
    edges: {
      smooth: true
    },
    interaction: {
      hover: true
    },
    physics: {
      stabilization: true,
      barnesHut: { gravitationalConstant: -2000 }
    },
    layout: { improvedLayout: true }
  };
  
  if (!network) network = new vis.Network(container, data, options);
  else network.setData(data);

  if (network) {
    network.on("hoverNode", () => {
      container.style.cursor = "pointer";
    });
    network.on("blurNode", () => {
      container.style.cursor = "default";
    });
  }
}

function redrawInterestChips(user) {
  const list = document.getElementById('interestChips');
  list.innerHTML = '';
  const u = normalizeName(user);
  if (!interests[u]) return;
  for (const it of interests[u]) {
    const span = document.createElement('span'); span.className='chip'; span.textContent = it;
    list.appendChild(span);
  }
}


function renderSuggestions(arr) {
  const out = document.getElementById('results');
  out.innerHTML = '';
  if (!arr || arr.length === 0) {
    out.innerHTML = '<div class="muted">No suggestions found</div>';
    return;
  }
  arr.forEach(it => {
    const el = document.createElement('div');
    el.className = 'suggestion';

    // Create shared interests chips
    let chipsHTML = '';
    if (it.commons && it.commons.length > 0) {
      chipsHTML = `<div class="chips">` +
        it.commons.map(c => `<span class="chip">${c}</span>`).join('') +
        `</div>`;
    }

    el.innerHTML = `
      <div style="display:flex;gap:12px;align-items:center;flex:1">
        <div class="avatar">${it.name.charAt(0).toUpperCase()}</div>
        <div>
          <div style="font-weight:700">${it.name}</div>
          <div class="meta">Mutual: ${it.mutual} · Shared: ${it.shared}</div>
          ${chipsHTML}
        </div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px">
        <div class="badge">Score: ${it.score}</div>
        <button class="addFriendBtn" data-user="${it.name}">Add</button>
      </div>
    `;

    out.appendChild(el);
  });

  // Attach click handlers for Add buttons
  document.querySelectorAll('.addFriendBtn').forEach(btn => {
    btn.addEventListener('click', e => {
      const userToAdd = e.target.dataset.user;
      const currentUser = document.getElementById('suggestUser').value;
      if (!currentUser) {
        alert('Please enter the main user to connect from.');
        return;
      }
      addFriend(currentUser, userToAdd);
      alert(`Friend ${userToAdd} added for ${currentUser}`);
      renderSuggestions(suggestFor(currentUser));
    });
  });
}


///////// UI wiring //////////
document.getElementById('btnAddFriend').onclick = () => {
  const a = document.getElementById('friendA').value;
  const b = document.getElementById('friendB').value;
  if (!a || !b) { alert('Enter both names'); return; }
  addFriend(a,b);
  document.getElementById('friendA').value=''; document.getElementById('friendB').value='';
};

document.getElementById('btnAddInterest').onclick = () => {
  const user = document.getElementById('interestUser').value;
  const interest = document.getElementById('interestText').value;
  if (!user || !interest) { alert('Enter user and interest'); return; }
  addInterest(user, interest);
  document.getElementById('interestText').value='';
  redrawInterestChips(user);
};

document.getElementById('btnSuggest').onclick = () => {
  const user = document.getElementById('suggestUser').value;
  if (!user) { alert('Enter user'); return; }
  const arr = suggestFor(user);
  renderSuggestions(arr);
};

document.getElementById('btnLoadSample').onclick = () => {
  loadSample();
  redrawGraph();
};

document.getElementById('btnClear').onclick = () => {
  if (!confirm('Reset demo data?')) return;
  graph = {}; interests = {};
  saveState();
  redrawGraph();
  document.getElementById('interestChips').innerHTML='';
  document.getElementById('results').innerHTML='';
};

function loadSample() {
  graph = {}; interests = {};
  addFriend('A','B'); addFriend('A','C'); addFriend('B','D'); addFriend('C','E'); addFriend('D','F');
  addInterest('A','coding'); addInterest('A','music'); addInterest('A','chess');
  addInterest('B','coding'); addInterest('B','football'); addInterest('C','music'); addInterest('D','chess'); addInterest('E','music'); addInterest('F','travel');
  saveState();
  redrawInterestChips('');
}

///// initial load /////
loadState();
redrawGraph();
