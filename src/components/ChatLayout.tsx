import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ModelSidebar from "./ModelSidebar";
import ChatContainer from "./ChatContainer";
import MessageInput from "./MessageInput";
import ChatHistory from "./ChatHistory";
import MacOSTitleBar from "./MacOSTitleBar";
import { Settings, History as HistoryIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api, Message as ApiMessage } from "@/services/api";
import { ChatSession } from "@/services/api";
import { Message } from "@/types/chat";
import { useToast } from "@/components/ui/use-toast";

const ChatLayout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedModelName, setSelectedModelName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [modelSidebarCollapsed, setModelSidebarCollapsed] = useState(false);
  const [historySidebarCollapsed, setHistorySidebarCollapsed] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);

  // Check connection status periodically
  useEffect(() => {
    const checkConnection = async () => {
      try {
        await api.getModels();
        setIsConnected(true);
      } catch (error) {
        setIsConnected(false);
        toast({
          variant: "destructive",
          title: "Connection Error",
          description: "Failed to connect to Ollama. Please make sure Ollama is running.",
        });
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [toast]);

  // Convert API message to Chat message
  const convertApiMessageToChatMessage = (apiMessage: ApiMessage): Message => ({
    content: apiMessage.content,
    role: apiMessage.role as "user" | "assistant" | "system",
    timestamp: apiMessage.created_at,
    modelName: selectedModelName
  });

  // Fetch chat sessions on component mount
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const sessions = await api.getChatSessions();
        setChatSessions(sessions);
        if (sessions.length > 0 && !currentSessionId) {
          setCurrentSessionId(sessions[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch chat sessions:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load chat sessions.",
        });
      }
    };

    fetchSessions();
  }, [toast]);

  // Fetch messages when session changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (currentSessionId) {
        try {
          const history = await api.getChatHistory(currentSessionId);
          setMessages(history.map(convertApiMessageToChatMessage));
        } catch (error) {
          console.error("Failed to fetch chat history:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load chat history.",
          });
        }
      } else {
        setMessages([]);
      }
    };

    fetchMessages();
  }, [currentSessionId]);

  const handleNewChat = () => {
    setCurrentSessionId(null);
    setMessages([]);
  };

  const handleSelectSession = (sessionId: number) => {
    setCurrentSessionId(sessionId);
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedModelName) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a model first",
      });
      return;
    }

    if (!isConnected) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Cannot send message: Ollama is not connected",
      });
      return;
    }
    
    setLoading(true);

    try {
      // Add user message immediately
      const userMessage: Message = {
        role: "user",
        content: content,
        timestamp: new Date().toISOString(),
        modelName: selectedModelName
      };
      setMessages(prev => [...prev, userMessage]);

      const response = await api.sendChat({
        model: selectedModelName,
        messages: [{ role: "user", content }],
        session_id: currentSessionId || undefined
      });

      // Add assistant message
      if (response.message) {
        const assistantMessage: Message = {
          role: "assistant",
          content: response.message.content,
          timestamp: new Date().toISOString(),
          modelName: selectedModelName
        };
        setMessages(prev => [...prev, assistantMessage]);
      }

      // Update chat sessions if a new session was created
      if (response.session_id && !currentSessionId) {
        const sessions = await api.getChatSessions();
        setChatSessions(sessions);
        setCurrentSessionId(response.session_id);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-background text-foreground">
      <MacOSTitleBar title="Ollama Chat" />
      
      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-col w-64">
          <ChatHistory 
            sessions={chatSessions}
            currentSessionId={currentSessionId}
            onSelectSession={handleSelectSession}
            onNewChat={handleNewChat}
            collapsed={historySidebarCollapsed}
          />
          <ModelSidebar
            selectedModel={selectedModelName}
            onSelectModel={setSelectedModelName}
            onNewChat={handleNewChat}
            collapsed={modelSidebarCollapsed}
            setCollapsed={setModelSidebarCollapsed}
          />
        </div>

        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="h-12 border-b flex items-center px-4 justify-between">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setHistorySidebarCollapsed(!historySidebarCollapsed)}
                className="mr-2"
              >
                <HistoryIcon className="h-4 w-4" />
              </Button>
              <h1 className="font-semibold">
                {currentSessionId 
                  ? chatSessions.find(s => s.id === currentSessionId)?.model_name || "Chat" 
                  : "New Chat"}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">
                Model: {selectedModelName || "Not selected"}
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate("/settings")}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <ChatContainer
            selectedModelName={selectedModelName}
            sessionId={currentSessionId || undefined}
            messages={messages}
            onSendMessage={handleSendMessage}
            loading={loading}
            isConnected={isConnected}
          />
          <MessageInput 
            onSendMessage={handleSendMessage} 
            isLoading={loading}
            disabled={!isConnected}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;
