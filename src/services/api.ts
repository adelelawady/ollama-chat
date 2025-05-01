import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

export interface ChatMessage {
  role: string;
  content: string;
}

export interface ChatRequest {
  model: string;
  messages: ChatMessage[];
  stream?: boolean;
  session_id?: number;
}

export interface ChatSession {
  id: number;
  model_name: string;
  created_at: string;
}

export interface Message {
  role: string;
  content: string;
  created_at: string;
}

export const api = {
  // Get available models
  getModels: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/models`);
      return response.data;
    } catch (error) {
      console.error("Error fetching models:", error);
      throw error;
    }
  },

  // Send chat message
  sendChat: async (request: ChatRequest) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/chat`, request);
      return response.data;
    } catch (error) {
      console.error("Error sending chat message:", error);
      throw error;
    }
  },

  // Get chat history
  getChatHistory: async (sessionId?: number) => {
    try {
      const url = sessionId 
        ? `${API_BASE_URL}/chat/history?session_id=${sessionId}`
        : `${API_BASE_URL}/chat/history`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching chat history:", error);
      throw error;
    }
  },

  // Get chat sessions
  getChatSessions: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/chat/sessions`);
      return response.data;
    } catch (error) {
      console.error("Error fetching chat sessions:", error);
      throw error;
    }
  }
}; 