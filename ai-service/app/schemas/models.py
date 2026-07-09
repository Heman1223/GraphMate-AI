"""
Pydantic v2 request / response models for the GraphMate AI Service.
"""

from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Embedding
# ---------------------------------------------------------------------------

class EmbedRequest(BaseModel):
    """Request body for generating an embedding from profile text."""
    text: str = Field(..., min_length=1, description="The profile text to embed.")


class EmbedResponse(BaseModel):
    """Response containing the generated embedding vector."""
    embedding: list[float] = Field(..., description="The embedding vector.")
    dimensions: int = Field(..., description="Number of dimensions in the embedding.")


# ---------------------------------------------------------------------------
# Similarity
# ---------------------------------------------------------------------------

class SimilarityRequest(BaseModel):
    """Request body for computing cosine similarity between two embeddings."""
    embedding1: list[float] = Field(..., description="First embedding vector.")
    embedding2: list[float] = Field(..., description="Second embedding vector.")


class SimilarityResponse(BaseModel):
    """Response containing the cosine similarity score."""
    similarity: float = Field(..., ge=0.0, le=1.0, description="Cosine similarity score (0.0 to 1.0).")


# ---------------------------------------------------------------------------
# Batch Similarity
# ---------------------------------------------------------------------------

class BatchSimilarityRequest(BaseModel):
    """Request body for comparing one source embedding against multiple targets."""
    source_embedding: list[float] = Field(..., description="The source embedding vector.")
    target_embeddings: list[list[float]] = Field(..., min_length=1, description="List of target embedding vectors.")


class BatchSimilarityResponse(BaseModel):
    """Response containing similarity scores for each target."""
    similarities: list[float] = Field(..., description="Cosine similarity scores in the same order as the targets.")


# ---------------------------------------------------------------------------
# Semantic Search
# ---------------------------------------------------------------------------

class SemanticSearchRequest(BaseModel):
    """Request body for semantic search across a list of documents."""
    query: str = Field(..., min_length=1, description="The search query text.")
    documents: list[str] = Field(..., min_length=1, description="List of document texts to search over.")
    top_k: int = Field(default=10, ge=1, description="Number of top results to return.")


class SemanticSearchResult(BaseModel):
    """A single semantic search result."""
    index: int = Field(..., description="Original index of the document in the input list.")
    score: float = Field(..., description="Cosine similarity score between the query and this document.")
    document: str = Field(..., description="The matched document text.")


class SemanticSearchResponse(BaseModel):
    """Response containing ranked semantic search results."""
    results: list[SemanticSearchResult] = Field(..., description="Top-k results sorted by score descending.")
