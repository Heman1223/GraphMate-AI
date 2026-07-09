# GraphMate AI Service

AI-powered embedding and similarity microservice for the GraphMate friend recommendation platform.

Built with **FastAPI** and **sentence-transformers** (`all-MiniLM-L6-v2`).

## Prerequisites

- Python 3.9+
- pip

## Setup

```bash
# Install dependencies
pip install -r requirements.txt

# Start the server (with hot-reload for development)
uvicorn app.main:app --reload --port 8000
```

> **Note:** The first run will automatically download the `all-MiniLM-L6-v2` model (~90 MB).

## API Endpoints

| Method | Path                    | Description                                  |
| ------ | ----------------------- | -------------------------------------------- |
| GET    | `/health`               | Health check                                 |
| POST   | `/api/embed`            | Generate embedding from profile text         |
| POST   | `/api/similarity`       | Cosine similarity between two embeddings     |
| POST   | `/api/batch-similarity` | Compare one embedding against multiple       |
| POST   | `/api/semantic-search`  | Semantic search across a list of documents   |

## API Documentation

Once the server is running, interactive docs are available at:

- **Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)

## Project Structure

```
ai-service/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app, lifespan, CORS, routers
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── embed.py         # POST /api/embed
│   │   ├── similarity.py    # POST /api/similarity & /api/batch-similarity
│   │   └── search.py        # POST /api/semantic-search
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── models.py        # Pydantic v2 request/response models
│   └── services/
│       ├── __init__.py
│       ├── embedding.py     # sentence-transformers encoding
│       └── similarity.py    # NumPy cosine similarity
├── requirements.txt
└── README.md
```
