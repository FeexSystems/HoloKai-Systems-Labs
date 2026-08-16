import os
import glob
import logging
from typing import List, Dict, Any
from src.vector_store import VectorStore

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("holokai.dataset_ingestion")

DATASET_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), "data", "dataset_v17_1")

def read_file(filepath: str) -> str:
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception as e:
        logger.error(f"Error reading {filepath}: {e}")
        return ""

def ingest_dataset():
    if not os.path.exists(DATASET_DIR):
        logger.error(f"Dataset directory not found: {DATASET_DIR}")
        return

    logger.info(f"Scanning for files in {DATASET_DIR}")
    
    # Supported extensions
    extensions = ["*.csv", "*.md", "*.txt", "*.jsonl", "*.cypher", "*.sql", "*.json"]
    files = []
    for ext in extensions:
        files.extend(glob.glob(os.path.join(DATASET_DIR, ext)))
        
    if not files:
        logger.warning("No files found to ingest.")
        return
        
    logger.info(f"Found {len(files)} files to process.")
    
    documents = []
    
    def chunk_text(text: str, chunk_size: int = 1000, overlap: int = 200) -> List[str]:
        chunks = []
        start = 0
        while start < len(text):
            chunks.append(text[start:start+chunk_size])
            start += chunk_size - overlap
        return chunks
    
    for filepath in files:
        filename = os.path.basename(filepath)
        logger.info(f"Processing {filename}...")
        
        content = read_file(filepath)
        if not content:
            continue
            
        # Create chunks
        chunks = chunk_text(content)
        
        for i, chunk in enumerate(chunks):
            documents.append({
                "text": chunk,
                "metadata": {
                    "source": filename,
                    "chunk_id": i,
                    "dataset_version": "V17.1"
                }
            })
            
    logger.info(f"Generated {len(documents)} total chunks across all files.")
    
    # Initialize VectorStore and upload
    vector_store = VectorStore()
    
    # Check if vector store is running in mock mode
    if vector_store.pc is None:
        logger.warning("Pinecone is in mock mode (PINECONE_API_KEY missing). Chunks will not be uploaded to the real index.")
    
    # Add documents
    uploaded = vector_store.add_documents(documents)
    logger.info(f"Successfully ingested {uploaded} chunks into Pinecone.")

if __name__ == "__main__":
    ingest_dataset()
