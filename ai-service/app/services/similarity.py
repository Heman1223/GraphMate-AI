"""
Similarity service – cosine similarity computation using NumPy.
"""

import numpy as np
from numpy.typing import NDArray


def cosine_similarity(embedding1: list[float], embedding2: list[float]) -> float:
    """Compute cosine similarity between two embedding vectors.

    The result is clamped to the [0, 1] range so that it can be interpreted
    as a percentage-like similarity score.

    Args:
        embedding1: First embedding vector.
        embedding2: Second embedding vector.

    Returns:
        Cosine similarity score clamped to [0.0, 1.0].
    """
    vec1: NDArray[np.float64] = np.asarray(embedding1, dtype=np.float64)
    vec2: NDArray[np.float64] = np.asarray(embedding2, dtype=np.float64)

    norm1 = np.linalg.norm(vec1)
    norm2 = np.linalg.norm(vec2)

    if norm1 == 0.0 or norm2 == 0.0:
        return 0.0

    similarity = float(np.dot(vec1, vec2) / (norm1 * norm2))
    return float(np.clip(similarity, 0.0, 1.0))


def batch_cosine_similarity(
    source: list[float],
    targets: list[list[float]],
) -> list[float]:
    """Compute cosine similarity of a source embedding against multiple targets.

    Uses vectorised NumPy operations for efficiency.

    Args:
        source: The source embedding vector.
        targets: A list of target embedding vectors.

    Returns:
        A list of cosine similarity scores (each clamped to [0.0, 1.0]),
        in the same order as the input targets.
    """
    source_vec: NDArray[np.float64] = np.asarray(source, dtype=np.float64)
    target_matrix: NDArray[np.float64] = np.asarray(targets, dtype=np.float64)

    source_norm = np.linalg.norm(source_vec)
    if source_norm == 0.0:
        return [0.0] * len(targets)

    # Normalise source once
    source_unit = source_vec / source_norm

    # Compute norms for each target row
    target_norms: NDArray[np.float64] = np.linalg.norm(target_matrix, axis=1)

    # Avoid division by zero – replace zero norms with 1 (dot product will be 0 anyway)
    safe_norms = np.where(target_norms == 0.0, 1.0, target_norms)

    # Dot product of normalised source with each normalised target
    dots: NDArray[np.float64] = target_matrix @ source_unit
    similarities: NDArray[np.float64] = dots / safe_norms

    # Clamp to [0, 1]
    similarities = np.clip(similarities, 0.0, 1.0)

    return similarities.tolist()
