#include <bits/stdc++.h>
using namespace std;

// === Color & Style Codes ===
#define RESET "\033[0m"
#define BOLD "\033[1m"
#define CYAN "\033[36m"
#define GREEN "\033[32m"
#define YELLOW "\033[33m"
#define RED "\033[31m"
#define MAGENTA "\033[35m"
#define BLUE "\033[34m"
#define WHITE "\033[37m"

string normalizeName(string name) {
    
    while (!name.empty() && isspace(name.front())) name.erase(name.begin());
    while (!name.empty() && isspace(name.back())) name.pop_back();

    // Convert to lowercase
    for (char &c : name)
        c = tolower(c);

    return name;
}

void printHeader(const string &title) {
    cout << BOLD << CYAN << "\n=======================================\n";
    cout << title << "\n";
    cout << "=======================================\n" << RESET;
}

// Add a friend connection
void addFriend(map<string, vector<string>> &graph, const string &u1, const string &u2) {
    graph[u1].push_back(u2);
    graph[u2].push_back(u1);
}

// Add an interest
void addInterest(map<string, set<string>> &interests, const string &user, const string &interest) {
    interests[user].insert(interest);
}

// Suggest friends
vector<pair<string, int>> suggestFriends(
    const string &user,
    map<string, vector<string>> &graph,
    map<string, set<string>> &interests
) {
    unordered_map<string, int> mutualCount;
    unordered_set<string> visited;
    queue<pair<string, int>> q;

    visited.insert(user);
    q.push(make_pair(user, 0));

    while (!q.empty()) {
        auto frontPair = q.front();
        q.pop();
        string current = frontPair.first;
        int depth = frontPair.second;
        if (depth >= 2) continue;

        for (auto &neighbor : graph[current]) {
            if (neighbor == user) continue;
            if (depth == 1 && !count(graph[user].begin(), graph[user].end(), neighbor))
                mutualCount[neighbor]++;
            if (visited.find(neighbor) == visited.end()) {
                visited.insert(neighbor);
                q.push(make_pair(neighbor, depth + 1));
            }
        }
    }

    for (auto &entry : interests) {
        string otherUser = entry.first;
        auto &otherInterests = entry.second;
        if (otherUser == user) continue;
        if (count(graph[user].begin(), graph[user].end(), otherUser)) continue;

        int common = 0;
        for (auto &intr : interests[user]) {
            if (otherInterests.find(intr) != otherInterests.end()) common++;
        }
        mutualCount[otherUser] += common;
    }

    priority_queue<pair<int, string>> pq;
    for (auto &entry : mutualCount) pq.push(make_pair(entry.second, entry.first));

    vector<pair<string, int>> suggestions;
    while (!pq.empty()) {
        suggestions.push_back(make_pair(pq.top().second, pq.top().first));
        pq.pop();
    }
    return suggestions;
}

int main() {
    map<string, vector<string>> graph;
    map<string, set<string>> interests;

    while (true) {
        printHeader("Social Network Friend Suggestion System");
        cout << BOLD << YELLOW
             << "1. Add Friend Connection\n"
             << "2. Add Interest\n"
             << "3. Suggest Friends\n"
             << "4. Exit\n"
             << RESET;
        cout << BOLD << WHITE << "Enter choice: " << RESET;

        int choice;
        cin >> choice;
        cin.ignore();

        if (choice == 1) {
            printHeader("Add Friend Connection");
            string u1, u2;
            cout << "Enter first user: ";
            getline(cin, u1);
            u1 = normalizeName(u1);
            cout << "Enter second user: ";
            getline(cin, u2);
            u2 = normalizeName(u2);
            addFriend(graph, u1, u2);
            cout << GREEN << "Friend connection added successfully!\n" << RESET;
        }
        else if (choice == 2) {
            printHeader("Add Interest");
            string user, interest;
            cout << "Enter user: ";
            getline(cin, user);
            user = normalizeName(user);
            cout << "Enter interests (type 'exit' to stop):\n";
            while (true) {
                cout << " > ";
                getline(cin, interest);
                if (interest == "exit") break;
                if (!interest.empty()) {
                    addInterest(interests, user, interest);
                    cout << GREEN << "   ✔ Interest added.\n" << RESET;
                }
            }
        }
        else if (choice == 3) {
            printHeader("Suggest Friends");
            string user;
            cout << "Enter user for suggestions: ";
            getline(cin, user);
            user = normalizeName(user);
            auto suggestions = suggestFriends(user, graph, interests);
            cout << MAGENTA << "\nFriend Suggestions for " << user << ":\n" << RESET;
            if (suggestions.empty()) {
                cout << RED << "No suggestions found.\n" << RESET;
            } else {
                for (auto &s : suggestions) {
                    cout << " - " << CYAN << s.first << RESET << " (Score: " << s.second << ")\n";
                }
            }
        }
        else if (choice == 4) {
            cout << GREEN << "\nExiting. Have a great day!\n" << RESET;
            break;
        }
        else {
            cout << RED << "Invalid choice. Please try again.\n" << RESET;
        }
    }
    return 0;
}

