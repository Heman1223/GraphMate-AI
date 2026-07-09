"""
Router for the /api/semantic-search endpoint.
"""

from fastapi import APIRouter, HTTPException, Request

from app.schemas.models import (
    SemanticSearchRequest,
    SemanticSearchResponse,
    SemanticSearchResult,
)
from app.services.embedding import generate_batch_embeddings, generate_embedding
from app.services.similarity import batch_cosine_similarity

router = APIRouter(prefix="/api", tags=["Semantic Search"])


@router.post("/semantic-search", response_model=SemanticSearchResponse)
async def semantic_search(request: Request, body: SemanticSearchRequest) -> SemanticSearchResponse:
    """Perform semantic search: rank documents by similarity to the query.

    1. Encode the query text into an embedding.
    2. Encode all candidate documents into embeddings.
    3. Compute cosine similarity of the query against every document.
    4. Return the top-k results sorted by score descending.
    """
    try:
        model = request.app.state.model

        # Generate embeddings
        query_embedding = generate_embedding(model, body.query)
        document_embeddings = generate_batch_embeddings(model, body.documents)

        # Compute similarities
        scores = batch_cosine_similarity(query_embedding, document_embeddings)

        # Build scored results with original indices
        scored_results = [
            SemanticSearchResult(index=idx, score=round(score, 6), document=doc)
            for idx, (score, doc) in enumerate(zip(scores, body.documents))
        ]

        # Sort by score descending and take top_k
        scored_results.sort(key=lambda r: r.score, reverse=True)
        top_results = scored_results[: body.top_k]

        return SemanticSearchResponse(results=top_results)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Semantic search failed: {exc}") from exc
