"""
Embedding service – wraps sentence-transformers encoding.
"""

from sentence_transformers import SentenceTransformer


def generate_embedding(model: SentenceTransformer, text: str) -> list[float]:
    """Generate a single embedding vector from the given text.

    Args:
        model: A loaded SentenceTransformer model instance.
        text: The input text to embed.

    Returns:
        The embedding as a list of Python floats.
    """
    embedding = model.encode(text, convert_to_numpy=True)
    return embedding.tolist()


def generate_batch_embeddings(model: SentenceTransformer, texts: list[str]) -> list[list[float]]:
    """Generate embeddings for multiple texts in a single batch call.

    Args:
        model: A loaded SentenceTransformer model instance.
        texts: A list of input texts to embed.

    Returns:
        A list of embedding vectors, each as a list of Python floats.
    """
    embeddings = model.encode(texts, convert_to_numpy=True, batch_size=64)
    return [emb.tolist() for emb in embeddings]
