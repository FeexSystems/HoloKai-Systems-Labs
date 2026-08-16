"""
HoloKai AI Orchestrator - Pinecone Vector Store

Handles semantic retrieval using Pinecone index.
"""

import logging
import os
from typing import Any, Dict, List, Optional
from pinecone import Pinecone

from .embeddings import Embedder

logger = logging.getLogger("holokai.vector_store")

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY", "")
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME", "holokai-knowledge")
PINECONE_HOST = os.getenv("PINECONE_HOST", "")

class VectorStore:
    def __init__(self, embedder: Optional[Embedder] = None):
        self.embedder = embedder or Embedder()
        self.index_name = PINECONE_INDEX_NAME
        self.pc = None
        self.index = None

        if PINECONE_API_KEY:
            try:
                self.pc = Pinecone(api_key=PINECONE_API_KEY)
                
                if PINECONE_HOST:
                    self.index = self.pc.Index(host=PINECONE_HOST)
                else:
                    self.index = self.pc.Index(self.index_name)
                    
                logger.info(f"Pinecone Vector Store initialized for index: {self.index_name}")
            except Exception as exc:
                logger.error(f"Failed to initialize Pinecone: {exc}")
        else:
            logger.warning("PINECONE_API_KEY not set. VectorStore will run in offline/mock mode.")

    def add_documents(self, documents: List[Dict[str, Any]]) -> int:
        """
        documents = [
          { "text": "...", "metadata": { "domain": "historian", "source": "..." } },
          ...
        ]
        """
        if not self.index:
            logger.warning("Cannot add documents: Pinecone index not initialized.")
            return 0
        if not documents:
            return 0

        import uuid
        vectors = []
        for doc in documents:
            text = doc["text"]
            metadata = doc.get("metadata", {})
            metadata["text"] = text  # Store text in metadata for retrieval
            
            emb = self.embedder.embed(text)
            doc_id = str(uuid.uuid4())
            vectors.append({"id": doc_id, "values": emb, "metadata": metadata})

        # Batch upsert
        batch_size = 100
        for i in range(0, len(vectors), batch_size):
            self.index.upsert(vectors=vectors[i:i + batch_size])
            
        logger.info(f"Added {len(documents)} documents to Pinecone.")
        return len(documents)

    def retrieve(
        self,
        query: str,
        domain: Optional[str] = None,
        top_k: int = 4,
        min_score: float = 0.32
    ) -> List[Dict[str, Any]]:
        """
        Retrieve context from Pinecone based on semantic similarity.
        """
        if not self.index:
            logger.warning("Pinecone index not initialized. Returning empty context.")
            return []
            
        query_embedding = self.embedder.embed(query)
        
        filter_args = {}
        if domain:
            filter_args["domain"] = domain
            
        try:
            results = self.index.query(
                vector=query_embedding,
                top_k=top_k,
                include_metadata=True,
                filter=filter_args if filter_args else None
            )
            
            matches = []
            for match in results.get("matches", []):
                score = match.get("score", 0)
                if score >= min_score:
                    matches.append({
                        "text": match.get("metadata", {}).get("text", ""),
                        "metadata": match.get("metadata", {}),
                        "score": score
                    })
                    
            return matches
        except Exception as exc:
            logger.error(f"Pinecone retrieval failed: {exc}")
            return []
