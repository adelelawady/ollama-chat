# Ollama Chat Application

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Version](https://img.shields.io/badge/version-1.0.0-orange)

## Description
Ollama Chat is a chat application that allows users to interact with various models. It features a backend server for handling chat sessions and a frontend built with React and Electron for a seamless desktop experience.

## Installation
To set up the project, follow these steps:

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ollama-chat
   ```

2. Set up the backend:
   - Navigate to the `backend` directory:
     ```bash
     cd backend
     ```
   - Create a virtual environment and activate it:
     ```bash
     python -m venv venv
     .\venv\Scripts\activate  # On Windows
     # source venv/bin/activate  # On macOS/Linux
     ```
   - Install the required packages:
     ```bash
     pip install -r requirements.txt
     ```

3. Set up the Electron app:
   - Navigate to the `electron-app` directory:
     ```bash
     cd ../electron-app
     ```
   - Install the dependencies:
     ```bash
     npm install
     ```

4. Set up the frontend:
   - Navigate to the `src` directory:
     ```bash
     cd ../src
     ```
   - Install the required packages (if applicable):
     ```bash
     npm install
     ```

## Usage
To run the backend server:
```bash
cd backend
python run_server.py
```

To start the Electron app:
```bash
cd electron-app
npm start
```

## Backend
The backend is built using Python and FastAPI. It handles chat sessions and stores chat history in a SQLite database (`chat_history.db`). Key files include:
- `main.py`: The entry point for the FastAPI application.
- `database.py`: Contains the database connection and models.
- `ui_server.py`: Manages the UI server for the Electron app.

## Electron App
The Electron app provides a desktop interface for the chat application. Key files include:
- `main.js`: The main process for the Electron app.
- `renderer.js`: Handles the rendering of the UI components.
- `index.html`: The main HTML file for the Electron app.

## Frontend (src)
The frontend is built using React. Key components include:
- `App.tsx`: The main application component.
- `components/`: Contains various UI components like `ChatContainer`, `ChatMessage`, and `MessageInput`.

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
Contributions are welcome! Please open an issue or submit a pull request.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Tags
- Chat Application
- FastAPI
- Electron
- React
- Python
- SQLite
- Open Source

## Repository
[GitHub Repository](https://github.com/adelelawady/ollama-chat)
