# GraphMate — API Documentation

This document lists details for all endpoints exposed by the Node.js Backend Server and the FastAPI AI Microservice.

---

## 1. Authentication Services

### Register User
- **Endpoint**: `/api/auth/register`
- **Method**: `POST`
- **Payload**:
  ```json
  {
    "name": "Rohan Sharma",
    "username": "rohan_sharma",
    "email": "rohan@iitd.ac.in",
    "password": "password123",
    "college": "IIT Delhi",
    "branch": "Computer Science",
    "graduationYear": 2026,
    "city": "Delhi",
    "bio": "Competitive programmer and full stack developer",
    "skills": ["JavaScript", "React", "Node.js", "C++"],
    "interests": ["Coding", "Chess", "Gaming"]
  }
  ```
- **Response** (Status `201`):
  ```json
  {
    "token": "JWT_BEARER_TOKEN_HERE",
    "user": {
      "_id": "603f7e50efb2a8123c56a1b2",
      "name": "Rohan Sharma",
      "username": "rohan_sharma",
      "email": "rohan@iitd.ac.in"
    }
  }
  ```

### Login User
- **Endpoint**: `/api/auth/login`
- **Method**: `POST`
- **Payload**:
  ```json
  {
    "email": "rohan@iitd.ac.in",
    "password": "password123"
  }
  ```
- **Response** (Status `200`): Same as Register payload.

---

## 2. Graph & Connections API

### Send Friend Request
- **Endpoint**: `/api/friends/request/:userId`
- **Method**: `POST`
- **Auth**: Required (JWT Bearer Token)
- **Response** (Status `201`):
  ```json
  {
    "message": "Friend request sent successfully",
    "friendship": {
      "requester": "603f7e50efb2a8123c56a1b2",
      "recipient": "603f7e60efb2a8123c56a1b8",
      "status": "pending"
    }
  }
  ```

### Accept Friend Request
- **Endpoint**: `/api/friends/accept/:friendshipId`
- **Method**: `PUT`
- **Auth**: Required
- **Response** (Status `200`): Updates status to `accepted`.

### Get Graph Network Topology
- **Endpoint**: `/api/graph/network`
- **Method**: `GET`
- **Auth**: Required
- **Response** (Status `200`): Returns Cytoscape compatible nodes and edge weights.
  ```json
  {
    "nodes": [
      { "id": "user1_id", "label": "Rohan", "avatar": "dicebear_url", "type": "self" },
      { "id": "user2_id", "label": "Priya", "avatar": "dicebear_url", "type": "friend" }
    ],
    "edges": [
      { "source": "user1_id", "target": "user2_id", "type": "friend" }
    ]
  }
  ```

---

## 3. Recommendation Services

### Get Personalized AI Recommendations
- **Endpoint**: `/api/recommendations`
- **Method**: `GET`
- **Auth**: Required
- **Response** (Status `200`):
  ```json
  {
    "recommendations": [
      {
        "user": {
          "_id": "user2_id",
          "name": "Priya",
          "skills": ["JavaScript", "Node.js"]
        },
        "score": 88.5,
        "graphScore": 0.85,
        "aiScore": 0.92,
        "explanation": {
          "mutualFriends": 3,
          "commonSkills": ["JavaScript", "Node.js"],
          "commonInterests": ["Coding"],
          "sameCollege": true,
          "sameCity": false,
          "jaccardIndex": 0.4,
          "adamicAdarIndex": 1.25,
          "aiSimilarity": 0.92,
          "finalScore": 88.5
        }
      }
    ]
  }
  ```

---

## 4. AI Microservice API (FastAPI)

### Generate Embedding Vector
- **Endpoint**: `POST` to `http://localhost:8000/api/embed`
- **Payload**:
  ```json
  {
    "text": "Full stack developer based in Bangalore skilled in Node.js, Express, and Docker."
  }
  ```
- **Response** (Status `200`): Returns a 384-dimensional floating point array embedding.
  ```json
  {
    "embedding": [0.0123, -0.0456, ..., 0.0892],
    "dimensions": 384
  }
  ```
