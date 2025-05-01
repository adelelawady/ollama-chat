# Ollama Chat Backend

This is the backend server for the Ollama Chat application. It provides API endpoints to interact with Ollama models and manage chat history.

## Prerequisites

- Python 3.8 or higher
- Ollama installed and running locally (default port: 11434)

## Setup

1. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Server

1. Make sure Ollama is running locally
2. Start the backend server:
```bash
python main.py
```

The server will start on `http://localhost:8000`

## API Endpoints

### GET /api/models
Returns a list of available Ollama models

### POST /api/chat
Send a chat message to a model

Request body:
```json
{
    "model": "model-name",
    "messages": [
        {
            "role": "user",
            "content": "Hello!"
        }
    ],
    "stream": false,
    "session_id": null
}
```

### GET /api/chat/history
Get chat history for a specific session or all sessions

Query parameters:
- `session_id` (optional): Filter by specific chat session

### GET /api/chat/sessions
Get list of all chat sessions

## Database

The chat history is stored in a SQLite database (`chat_history.db`). The database contains two tables:
- `chat_sessions`: Stores information about each chat session
- `messages`: Stores individual messages within sessions 