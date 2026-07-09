"""
GraphMate AI Service - Main Application

FastAPI microservice for generating embeddings, computing similarity,
and performing semantic search using sentence-transformers.
"""

import logging
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sentence_transformers import SentenceTransformer

from app.routers import embed, similarity, search

logger = logging.getLogger(__name__)

MODEL_NAME = "all-MiniLM-L6-v2"


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Load the sentence-transformer model once at startup and release on shutdown."""
    logger.info("Loading sentence-transformer model: %s", MODEL_NAME)
    app.state.model = SentenceTransformer(MODEL_NAME)
    logger.info("Model loaded successfully (dimensions=%d)", app.state.model.get_sentence_embedding_dimension())
    yield
    logger.info("Shutting down – releasing model resources")
    del app.state.model


app = FastAPI(
    title="GraphMate AI Service",
    description="AI-powered embedding and similarity microservice for friend recommendations.",
    version="1.0.0",
    lifespan=lifespan,
)

# ---------------------------------------------------------------------------
# CORS – allow all origins during development
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
app.include_router(embed.router)
app.include_router(similarity.router)
app.include_router(search.router)


# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------
@app.get("/health", tags=["Health"])
async def health_check() -> dict[str, str]:
    """Return a simple health-check response."""
    return {"status": "healthy", "model": MODEL_NAME}
