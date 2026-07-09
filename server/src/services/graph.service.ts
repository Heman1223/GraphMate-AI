import mongoose from 'mongoose';
import Friendship from '../models/Friendship';
import User, { IUser } from '../models/User';

interface Node {
  id: string;
  label: string;
  type: 'self' | 'friend' | 'mutual' | 'suggested';
  avatar: string;
  name: string;
  username: string;
  college: string;
  branch: string;
  city: string;
  isCurrent: boolean;
}

interface Edge {
  source: string;
  target: string;
  weight: number;
}

interface NetworkStats {
  totalNodes: number;
  totalEdges: number;
  density: number;
  averageDegree: number;
  clusteringCoefficient: number;
  maxDegree: number;
  minDegree: number;
  components: number;
  myDegree: number;
  myClusteringCoefficient: number;
}

class GraphService {
  /**
   * Build adjacency list from accepted friendships for a set of user IDs.
   */
  private async buildAdjacencyList(
    userIds?: string[]
  ): Promise<Map<string, Set<string>>> {
    const adjacencyList = new Map<string, Set<string>>();

    const query: any = { status: 'accepted' };
    if (userIds) {
      query.$or = [
        { requester: { $in: userIds.map((id) => new mongoose.Types.ObjectId(id)) } },
        { recipient: { $in: userIds.map((id) => new mongoose.Types.ObjectId(id)) } },
      ];
    }

    const friendships = await Friendship.find(query).lean();

    for (const f of friendships) {
      const reqId = f.requester.toString();
      const recId = f.recipient.toString();

      if (!adjacencyList.has(reqId)) adjacencyList.set(reqId, new Set());
      if (!adjacencyList.has(recId)) adjacencyList.set(recId, new Set());

      adjacencyList.get(reqId)!.add(recId);
      adjacencyList.get(recId)!.add(reqId);
    }

    return adjacencyList;
  }

  /**
   * Get direct friends of a user.
   */
  async getDirectFriends(userId: string): Promise<string[]> {
    const friendships = await Friendship.find({
      $or: [
        { requester: userId, status: 'accepted' },
        { recipient: userId, status: 'accepted' },
      ],
    }).lean();

    const friends: string[] = [];
    for (const f of friendships) {
      const reqId = f.requester.toString();
      const recId = f.recipient.toString();
      friends.push(reqId === userId ? recId : reqId);
    }

    return friends;
  }

  /**
   * BFS to find friends-of-friends (depth 2) — ported from C++ algorithm.
   * Returns user IDs that are 2 hops away (not direct friends and not self).
   */
  async getFriendsOfFriends(userId: string): Promise<string[]> {
    const adjacencyList = await this.buildAdjacencyList();

    // BFS
    const visited = new Set<string>();
    const queue: { id: string; depth: number }[] = [];
    const friendsOfFriends: string[] = [];
    const directFriends = new Set<string>();

    visited.add(userId);
    queue.push({ id: userId, depth: 0 });

    while (queue.length > 0) {
      const { id, depth } = queue.shift()!;

      if (depth >= 2) continue;

      const neighbors = adjacencyList.get(id) || new Set();

      for (const neighbor of neighbors) {
        if (depth === 0) {
          directFriends.add(neighbor);
        }

        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push({ id: neighbor, depth: depth + 1 });

          // At depth 2, these are friends-of-friends
          if (depth + 1 === 2 && !directFriends.has(neighbor)) {
            friendsOfFriends.push(neighbor);
          }
        }
      }
    }

    return friendsOfFriends;
  }

  /**
   * Count and return mutual friends between two users.
   */
  async getMutualFriends(userId1: string, userId2: string): Promise<IUser[]> {
    const [friends1, friends2] = await Promise.all([
      this.getDirectFriends(userId1),
      this.getDirectFriends(userId2),
    ]);

    const set1 = new Set(friends1);
    const mutualIds = friends2.filter((id) => set1.has(id));

    if (mutualIds.length === 0) return [];

    const mutualUsers = await User.find({
      _id: { $in: mutualIds.map((id) => new mongoose.Types.ObjectId(id)) },
    }).lean();

    return mutualUsers as unknown as IUser[];
  }

  /**
   * Jaccard Similarity = |A ∩ B| / |A ∪ B| for two sets.
   */
  jaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
    if (setA.size === 0 && setB.size === 0) return 0;

    let intersection = 0;
    for (const item of setA) {
      if (setB.has(item)) intersection++;
    }

    const union = setA.size + setB.size - intersection;
    return union === 0 ? 0 : intersection / union;
  }

  /**
   * Adamic-Adar Index: Σ 1/log(degree(z)) for each mutual friend z.
   * Gives higher weight to mutual friends who have fewer connections.
   */
  async adamicAdarIndex(userId1: string, userId2: string): Promise<number> {
    const adjacencyList = await this.buildAdjacencyList();

    const friends1 = adjacencyList.get(userId1) || new Set();
    const friends2 = adjacencyList.get(userId2) || new Set();

    let score = 0;
    for (const friend of friends1) {
      if (friends2.has(friend)) {
        const degree = (adjacencyList.get(friend) || new Set()).size;
        if (degree > 1) {
          score += 1 / Math.log(degree);
        } else if (degree === 1) {
          // If degree is 1, log(1) = 0, so we use a large contribution
          score += 1;
        }
      }
    }

    return score;
  }

  /**
   * Common items score for arrays like skills/interests.
   */
  commonItemsScore(
    arr1: string[],
    arr2: string[]
  ): { score: number; common: string[] } {
    const set1 = new Set(arr1.map((s) => s.toLowerCase()));
    const set2 = new Set(arr2.map((s) => s.toLowerCase()));

    const common: string[] = [];
    for (const item of set1) {
      if (set2.has(item)) common.push(item);
    }

    const maxLen = Math.max(set1.size, set2.size);
    const score = maxLen === 0 ? 0 : common.length / maxLen;

    return { score, common };
  }

  /**
   * Get network data for visualization (nodes + edges).
   */
  async getNetworkData(
    userId: string
  ): Promise<{ nodes: Node[]; edges: Edge[] }> {
    // Get the user's friends
    const directFriends = await this.getDirectFriends(userId);
    const allUserIds = [userId, ...directFriends];

    // Also get friends-of-friends connections for richer visualization
    const adjacencyList = await this.buildAdjacencyList(allUserIds);

    // Collect all unique user IDs in the network
    const networkUserIds = new Set<string>(allUserIds);
    for (const [, neighbors] of adjacencyList) {
      for (const n of neighbors) {
        if (allUserIds.includes(n)) {
          networkUserIds.add(n);
        }
      }
    }

    // Fetch user data
    const users = await User.find({
      _id: { $in: Array.from(networkUserIds).map((id) => new mongoose.Types.ObjectId(id)) },
    }).lean();

    const userMap = new Map<string, any>();
    users.forEach((u) => userMap.set(u._id.toString(), u));

    // Build nodes
    const AVATAR_STYLES = ['adventurer', 'avataaars', 'big-ears', 'bottts', 'croodles', 'fun-emoji', 'lorelei', 'micah', 'miniavs', 'notionists', 'open-peeps', 'personas', 'pixel-art', 'thumbs'];
    
    const nodes: Node[] = [];
    for (const uid of networkUserIds) {
      const user = userMap.get(uid);
      if (user) {
        let type: 'self' | 'friend' | 'mutual' | 'suggested' = 'mutual';
        if (uid === userId) type = 'self';
        else if (directFriends.includes(uid)) type = 'friend';

        let hash = 0;
        const seed = user.username || 'default';
        for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
        const style = AVATAR_STYLES[Math.abs(hash) % AVATAR_STYLES.length];
        const avatar = user.profilePicture || `https://api.dicebear.com/9.x/${style}/svg?seed=${encodeURIComponent(seed)}`;

        nodes.push({
          id: uid,
          label: user.name,
          type: type,
          avatar: avatar,
          name: user.name,
          username: user.username,
          college: user.college || '',
          branch: user.branch || '',
          city: user.city || '',
          isCurrent: uid === userId,
        });
      }
    }

    // Build edges (only between users in the network)
    const edges: Edge[] = [];
    const edgeSet = new Set<string>();

    for (const [nodeId, neighbors] of adjacencyList) {
      if (!networkUserIds.has(nodeId)) continue;
      for (const neighbor of neighbors) {
        if (!networkUserIds.has(neighbor)) continue;
        const edgeKey = [nodeId, neighbor].sort().join('-');
        if (!edgeSet.has(edgeKey)) {
          edgeSet.add(edgeKey);
          edges.push({
            source: nodeId,
            target: neighbor,
            weight: 1,
          });
        }
      }
    }

    return { nodes, edges };
  }

  /**
   * Network statistics: density, clustering, degree distribution.
   */
  async getNetworkStats(userId: string): Promise<NetworkStats> {
    const adjacencyList = await this.buildAdjacencyList();

    const directFriends = adjacencyList.get(userId) || new Set();
    const totalNodes = adjacencyList.size;

    // Count total edges
    let totalEdges = 0;
    for (const [, neighbors] of adjacencyList) {
      totalEdges += neighbors.size;
    }
    totalEdges = totalEdges / 2; // Each edge counted twice

    // Density = 2E / (V * (V - 1))
    const density =
      totalNodes > 1
        ? (2 * totalEdges) / (totalNodes * (totalNodes - 1))
        : 0;

    // Degree statistics
    let maxDegree = 0;
    let minDegree = Infinity;
    let sumDegree = 0;

    for (const [, neighbors] of adjacencyList) {
      const degree = neighbors.size;
      maxDegree = Math.max(maxDegree, degree);
      minDegree = Math.min(minDegree, degree);
      sumDegree += degree;
    }

    if (totalNodes === 0) minDegree = 0;
    const averageDegree = totalNodes > 0 ? sumDegree / totalNodes : 0;

    // Global clustering coefficient
    let totalTriangles = 0;
    let totalTriples = 0;

    for (const [nodeId, neighbors] of adjacencyList) {
      const neighborArr = Array.from(neighbors);
      const degree = neighborArr.length;

      if (degree < 2) continue;

      totalTriples += (degree * (degree - 1)) / 2;

      for (let i = 0; i < neighborArr.length; i++) {
        for (let j = i + 1; j < neighborArr.length; j++) {
          const ni = adjacencyList.get(neighborArr[i]);
          if (ni && ni.has(neighborArr[j])) {
            totalTriangles++;
          }
        }
      }
    }

    const clusteringCoefficient =
      totalTriples > 0 ? totalTriangles / totalTriples : 0;

    // My clustering coefficient
    let myClusteringCoefficient = 0;
    const myNeighbors = Array.from(directFriends);
    if (myNeighbors.length >= 2) {
      let myTriangles = 0;
      const myTriples = (myNeighbors.length * (myNeighbors.length - 1)) / 2;

      for (let i = 0; i < myNeighbors.length; i++) {
        for (let j = i + 1; j < myNeighbors.length; j++) {
          const ni = adjacencyList.get(myNeighbors[i]);
          if (ni && ni.has(myNeighbors[j])) {
            myTriangles++;
          }
        }
      }

      myClusteringCoefficient = myTriples > 0 ? myTriangles / myTriples : 0;
    }

    // Connected components via BFS
    const visitedAll = new Set<string>();
    let components = 0;

    for (const [nodeId] of adjacencyList) {
      if (!visitedAll.has(nodeId)) {
        components++;
        const bfsQueue = [nodeId];
        visitedAll.add(nodeId);

        while (bfsQueue.length > 0) {
          const current = bfsQueue.shift()!;
          const neighbors = adjacencyList.get(current) || new Set();
          for (const neighbor of neighbors) {
            if (!visitedAll.has(neighbor)) {
              visitedAll.add(neighbor);
              bfsQueue.push(neighbor);
            }
          }
        }
      }
    }

    return {
      totalNodes,
      totalEdges,
      density: Math.round(density * 10000) / 10000,
      averageDegree: Math.round(averageDegree * 100) / 100,
      clusteringCoefficient: Math.round(clusteringCoefficient * 10000) / 10000,
      maxDegree,
      minDegree: totalNodes > 0 ? minDegree : 0,
      components,
      myDegree: directFriends.size,
      myClusteringCoefficient: Math.round(myClusteringCoefficient * 10000) / 10000,
    };
  }
}

const graphService = new GraphService();
export default graphService;
