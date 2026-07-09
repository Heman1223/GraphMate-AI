"""
Router for the /api/similarity and /api/batch-similarity endpoints.
"""

from fastapi import APIRouter, HTTPException

from app.schemas.models import (
    BatchSimilarityRequest,
    BatchSimilarityResponse,
    SimilarityRequest,
    SimilarityResponse,
)
from app.services.similarity import batch_cosine_similarity, cosine_similarity

router = APIRouter(prefix="/api", tags=["Similarity"])


@router.post("/similarity", response_model=SimilarityResponse)
async def compute_similarity(body: SimilarityRequest) -> SimilarityResponse:
    """Compute cosine similarity between two embedding vectors."""
    try:
        score = cosine_similarity(body.embedding1, body.embedding2)
        return SimilarityResponse(similarity=score)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Similarity computation failed: {exc}") from exc


@router.post("/batch-similarity", response_model=BatchSimilarityResponse)
async def compute_batch_similarity(body: BatchSimilarityRequest) -> BatchSimilarityResponse:
    """Compute cosine similarity of one source embedding against multiple targets."""
    try:
        scores = batch_cosine_similarity(body.source_embedding, body.target_embeddings)
        return BatchSimilarityResponse(similarities=scores)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Batch similarity computation failed: {exc}") from exc
