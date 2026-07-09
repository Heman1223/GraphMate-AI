"""
Router for the /api/embed endpoint.
"""

from fastapi import APIRouter, HTTPException, Request

from app.schemas.models import EmbedRequest, EmbedResponse
from app.services.embedding import generate_embedding

router = APIRouter(prefix="/api", tags=["Embedding"])


@router.post("/embed", response_model=EmbedResponse)
async def create_embedding(request: Request, body: EmbedRequest) -> EmbedResponse:
    """Generate an embedding vector from the provided profile text.

    Uses the sentence-transformer model loaded at application startup.
    """
    try:
        model = request.app.state.model
        embedding = generate_embedding(model, body.text)
        return EmbedResponse(embedding=embedding, dimensions=len(embedding))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Embedding generation failed: {exc}") from exc
