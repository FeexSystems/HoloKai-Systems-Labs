import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from crew_manager import run_agentic_workflow
from dotenv import load_dotenv
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
load_dotenv()

app = FastAPI(title="HoloKai AI Orchestrator")

try:
    from src.telemetry import setup_telemetry
    setup_telemetry(app)
except ImportError:
    pass

class ChatRequest(BaseModel):
    message: str
    context: dict = {}

class ChatResponse(BaseModel):
    response: str
    agent_id: str

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    logger.info(f"Received message: {request.message}")
    
    # Run the crew AI logic
    response_text, agent_name = await run_agentic_workflow(request.message, request.context)
    
    return {
        "reply": response_text,
        "agent": agent_name,
        "status": "success"
    }

class MediaUploadRequest(BaseModel):
    user_id: str
    file_name: str
    file_bytes_base64: str  # Stub for demonstration; in reality use UploadFile
    mime_type: str
    process_with_sieve: bool = False

@app.post("/api/media/upload")
async def media_upload_endpoint(request: MediaUploadRequest):
    """
    Handles file upload to Supabase and optional video processing via Sieve.
    """
    try:
        from src.media_store import media_store
        from src.sieve_integration import sieve_api
        import base64
        
        # Decode stub base64
        file_bytes = base64.b64decode(request.file_bytes_base64)
        
        # Upload to Supabase and Neon
        metadata = await media_store.upload_media(
            user_id=request.user_id,
            file_name=request.file_name,
            file_bytes=file_bytes,
            mime_type=request.mime_type
        )
        
        sieve_metadata = {}
        if request.process_with_sieve and "video" in request.mime_type:
            sieve_metadata = await sieve_api.process_video(metadata["url"])
            
        return {
            "status": "success",
            "media": metadata,
            "sieve_job": sieve_metadata
        }
    except Exception as e:
        logger.error(f"Media upload failed: {e}")
        return {"status": "error", "message": str(e)}

class DatasetQueryRequest(BaseModel):
    query: str
    top_k: int = 5

@app.post("/api/dataset/query")
async def dataset_query_endpoint(request: DatasetQueryRequest):
    """
    Query the HoloKai V17.1 dataset in Pinecone.
    """
    try:
        from src.vector_store import VectorStore
        vs = VectorStore()
        
        results = vs.retrieve(query=request.query, top_k=request.top_k)
        return {
            "status": "success",
            "results": results
        }
    except Exception as e:
        logger.error(f"Dataset query failed: {e}")
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
