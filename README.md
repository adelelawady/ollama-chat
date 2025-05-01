# Ollama Chat Application

A modern chat application that allows you to interact with Ollama models through a beautiful user interface.

## Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- Ollama installed and running locally (default port: 11434)

## Setup

### Backend Setup

1. Create a Python virtual environment:
```bash
python -m venv venv
venv\Scripts\activate  # On Windows
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Start the backend server:
```bash
python backend/main.py
```

The backend server will run on `http://localhost:8000`

### Frontend Setup

1. Install Node.js dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Features

- Browse and select from available Ollama models
- Chat with selected models
- View chat history
- Create new chat sessions
- Switch between different chat sessions
- Modern, responsive UI with dark/light mode support

## Project Structure

- `backend/` - Python FastAPI server
  - `main.py` - Main server file with API endpoints
  - `database.py` - SQLite database management
  - `requirements.txt` - Python dependencies

- `src/` - React frontend
  - `components/` - UI components
  - `services/` - API service layer
  - `types/` - TypeScript type definitions

## API Endpoints

### Backend API

- `GET /api/models` - Get available Ollama models
- `POST /api/chat` - Send chat message
- `GET /api/chat/history` - Get chat history
- `GET /api/chat/sessions` - Get chat sessions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT
