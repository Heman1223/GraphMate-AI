# GraphMate — System Architecture

GraphMate's architecture is built around clean boundaries separating the presentation client, app coordination service, and statistical recommendation engine.

---

## Service Decomposition

### 1. Presentation Layer (React Client)
- Responsive Single-Page Application (SPA) compiled with Vite.
- Styled using Tailwind CSS v4, yielding an efficient bundle size without config overhead.
- Interactive connection topologies rendered via Cytoscape.js using HTML canvas overlay.
- Layouts are protected by a context-based JWT authentication guard.

### 2. Coordination Layer (Express Backend)
- Handles auth registers, logins, friendship requests, approvals, notifications, and profile CRUD.
- Runs BFS depth-2 queries to find friends-of-friends connections.
- Implements Jaccard indices and Adamic-Adar indices dynamically on MongoDB connection networks.
- Interacts with the Python service over HTTP requests, caching user profile embeddings in the MongoDB document cache to prevent redundant NLP processing.

### 3. AI Inference Layer (FastAPI Microservice)
- Python service loaded with the Hugging Face `sentence-transformers/all-MiniLM-L6-v2` model in memory.
- Standardizes user document layouts and outputs normalized vector embeddings.
- Ranks matches using high-performance, vectorized matrix multiplication.

---

## Database Schema Structure

### Users Collection
Stores profile parameters (e.g., branch, college, skills, city) and stores the AI embedding vector as an array of 384 numbers for quick cosine calculations.

### Friendships Collection
Stores active relationships. Direct index indexing on `requester`, `recipient`, and connection `status`.

### Notifications Collection
Allows real-time indexing of pending friend requests and approved connections.
