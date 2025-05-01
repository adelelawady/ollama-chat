from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import json
from typing import List, Optional
import os
import logging
from database import Database

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:8080"],  # Both Vite dev server ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database
db = Database()

# Ollama API base URL
OLLAMA_API_URL = "http://localhost:11434/api"

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    model: str
    messages: List[ChatMessage]
    stream: bool = False
    session_id: Optional[int] = None

@app.get("/api/models")
async def get_models():
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{OLLAMA_API_URL}/tags")
            return response.json()
    except Exception as e:
        logger.error(f"Error fetching models: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        # Create new session if none exists
        if not request.session_id:
            request.session_id = db.create_chat_session(request.model)
        
        # Get existing messages for this session
        existing_messages = db.get_chat_history(request.session_id)
        
        # Store user's message in database first
        for msg in request.messages:
            if msg.role == "user":
                db.add_message(request.session_id, msg.role, msg.content)
        
        # Combine existing messages with new messages
        all_messages = [
            {"role": msg["role"], "content": msg["content"]}
            for msg in existing_messages
        ] + [{"role": msg.role, "content": msg.content} for msg in request.messages]

        logger.info(f"Sending chat request to Ollama with {len(all_messages)} messages")
        logger.debug(f"Messages: {json.dumps(all_messages, indent=2)}")
        
        # Check if Ollama is running
        try:
            async with httpx.AsyncClient() as client:
                # First check if Ollama is available
                health_check = await client.get(f"{OLLAMA_API_URL}/tags")
                if health_check.status_code != 200:
                    raise HTTPException(
                        status_code=503,
                        detail="Ollama service is not available. Please make sure Ollama is running."
                    )
                
                # Now send the chat request
                response = await client.post(
                    f"{OLLAMA_API_URL}/chat",
                    json={
                        "model": request.model,
                        "messages": all_messages,
                        "stream": request.stream
                    },
                    timeout=30.0  # Add timeout
                )
                
                if response.status_code != 200:
                    error_msg = f"Ollama API returned status {response.status_code}: {response.text}"
                    logger.error(error_msg)
                    raise HTTPException(status_code=500, detail=error_msg)
                
                response_data = response.json()
                
                # Store assistant's response in database
                if "message" in response_data:
                    db.add_message(
                        request.session_id,
                        "assistant",
                        response_data["message"]["content"]
                    )
                
                # Get updated chat history
                updated_history = db.get_chat_history(request.session_id)
                
                return {
                    **response_data,
                    "session_id": request.session_id,
                    "history": updated_history
                }
        except httpx.ConnectError as e:
            logger.error(f"Failed to connect to Ollama API: {str(e)}")
            raise HTTPException(
                status_code=503,
                detail="Failed to connect to Ollama API. Please make sure Ollama is running and accessible at http://localhost:11434"
            )
        except httpx.TimeoutException as e:
            logger.error(f"Timeout while communicating with Ollama API: {str(e)}")
            raise HTTPException(
                status_code=504,
                detail="Request to Ollama API timed out. Please try again."
            )
    except httpx.HTTPError as e:
        logger.error(f"HTTP error in chat endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to communicate with Ollama API: {str(e)}")
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/chat/history")
async def get_chat_history(session_id: Optional[int] = None):
    try:
        return db.get_chat_history(session_id)
    except Exception as e:
        logger.error(f"Error fetching chat history: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/chat/sessions")
async def get_chat_sessions():
    try:
        return db.get_chat_sessions()
    except Exception as e:
        logger.error(f"Error fetching chat sessions: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,  # Enable auto-reload
        reload_dirs=["backend"],  # Watch the backend directory for changes
    ) 