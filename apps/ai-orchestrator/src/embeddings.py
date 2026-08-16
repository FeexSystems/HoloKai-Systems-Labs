"""
HoloKai AI Orchestrator - Embeddings Service

Provides embeddings via Ollama (nomic-embed-text) with offline hashing fallback.
"""

import hashlib
import logging
import math
import os
import re
from typing import List, Optional, Sequence

logger = logging.getLogger("holokai.embeddings")

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434").rstrip("/")
EMBED_MODEL = os.getenv("HOLAKAI_EMBED_MODEL", "nomic-embed-text")
HASH_DIMS = int(os.getenv("HOLAKAI_HASH_EMBED_DIMS", "384"))

class EmbeddingError(RuntimeError):
    pass

def hashing_embed(text: str, dims: int = HASH_DIMS) -> List[float]:
    """Deterministic sparse-ish bag-of-tokens embedding (no external deps)."""
    tokens = re.findall(r"[a-z0-9]+", (text or "").lower())
    if not tokens:
        tokens = ["empty"]
    vec = [0.0] * dims
    for tok in tokens:
        h = hashlib.sha256(tok.encode("utf-8")).digest()
        idx = int.from_bytes(h[:4], "little") % dims
        sign = 1.0 if h[4] % 2 == 0 else -1.0
        vec[idx] += sign
        idx2 = int.from_bytes(h[5:9], "little") % dims
        sign2 = 1.0 if h[9] % 2 == 0 else -1.0
        vec[idx2] += 0.5 * sign2
    norm = math.sqrt(sum(v * v for v in vec)) or 1.0
    return [v / norm for v in vec]

class Embedder:
    def __init__(self):
        self.model = EMBED_MODEL
        self.ollama_url = OLLAMA_URL
        self.backend = "ollama"
        self.dimensions: Optional[int] = None
        
        try:
            probe = self._ollama_embed("HoloKai ancestral memory probe")
            self.dimensions = len(probe)
            logger.info(f"Ollama embeddings ready · model={self.model} · dims={self.dimensions}")
        except Exception as exc:
            logger.warning(f"Ollama embed chain failed, falling back to hashing: {exc}")
            self.backend = "hashing"
            self.dimensions = HASH_DIMS
            self.model = f"hashing-{HASH_DIMS}"

    def _ollama_embed(self, text: str) -> List[float]:
        try:
            import ollama
            client = ollama.Client(host=self.ollama_url)
            response = client.embeddings(model=self.model, prompt=text)
            vector = response.get("embedding")
            if not vector:
                raise EmbeddingError("Ollama returned empty embedding")
            return vector
        except Exception as exc:
            raise EmbeddingError(f"Ollama embed failed: {exc}") from exc

    def embed(self, text: str) -> List[float]:
        if self.backend == "hashing":
            return hashing_embed(text, self.dimensions or HASH_DIMS)
        return self._ollama_embed(text)

    def encode(self, texts: Sequence[str] | str) -> List[List[float]] | List[float]:
        single = isinstance(texts, str)
        batch = [texts] if single else list(texts)

        vectors = [self.embed(t) for t in batch]
        return vectors[0] if single else vectors
