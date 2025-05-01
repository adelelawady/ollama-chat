
import { useState, useEffect } from "react";
import ModelSidebar from "./ModelSidebar";
import ChatContainer from "./ChatContainer";
import MessageInput from "./MessageInput";
import ChatHistory from "./ChatHistory";
import MacOSTitleBar from "./MacOSTitleBar";
import { Button } from "@/components/ui/button";
import { HistoryIcon } from "lucide-react";
import { dummyModels } from "@/data/dummyData";
import { Message, Chat } from "@/types/chat";

const ChatLayout = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedModelId, setSelectedModelId] = useState("llama3");
  const [loading, setLoading] = useState(false);
  const [modelSidebarCollapsed, setModelSidebarCollapsed] = useState(false);
  const [historySidebarCollapsed, setHistorySidebarCollapsed] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  const selectedModel = dummyModels.find(model => model.id === selectedModelId);
  const selectedModelName = selectedModel?.name || "AI Assistant";

  // Initialize with a default chat if no chats exist
  useEffect(() => {
    if (chats.length === 0) {
      const newChat = createNewChat();
      setChats([newChat]);
      setCurrentChatId(newChat.id);
    }
  }, []);

  // Create a new chat object
  const createNewChat = (): Chat => {
    return {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      modelId: selectedModelId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  };

  const handleNewChat = () => {
    const newChat = createNewChat();
    setChats(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
    setMessages([]);
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
    const selectedChat = chats.find(chat => chat.id === chatId);
    if (selectedChat) {
      setMessages(selectedChat.messages);
      setSelectedModelId(selectedChat.modelId);
    }
  };

  const updateChatTitle = (chatId: string, messages: Message[]) => {
    if (messages.length >= 1) {
      const userMessage = messages.find(m => m.role === 'user')?.content || '';
      const title = userMessage.length > 30 
        ? `${userMessage.substring(0, 30)}...` 
        : userMessage || 'New Chat';

      setChats(prev => prev.map(chat => 
        chat.id === chatId 
          ? { ...chat, title, updatedAt: new Date().toISOString() } 
          : chat
      ));
    }
  };

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date().toISOString(),
    };
    
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setLoading(true);

    try {
      // Simulate AI response delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock AI response
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateMockResponse(content, selectedModelName),
        role: "assistant",
        modelName: selectedModelName,
        timestamp: new Date().toISOString(),
      };
      
      const updatedMessages = [...newMessages, aiResponse];
      setMessages(updatedMessages);

      // Update chat in history
      if (currentChatId) {
        setChats(prev => prev.map(chat => 
          chat.id === currentChatId 
            ? { 
                ...chat, 
                messages: updatedMessages,
                updatedAt: new Date().toISOString(),
                modelId: selectedModelId
              } 
            : chat
        ));
        
        // Update chat title based on first message
        updateChatTitle(currentChatId, updatedMessages);
      }
    } catch (error) {
      console.error("Error getting response:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background text-foreground border border-border rounded-lg shadow-lg">
      <MacOSTitleBar title="Ollama Chat" />
      
      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-col w-64">
          <ChatHistory 
            chats={chats}
            currentChatId={currentChatId}
            onSelectChat={handleSelectChat}
            onNewChat={handleNewChat}
            collapsed={historySidebarCollapsed}
          />
          <ModelSidebar
            selectedModel={selectedModelId}
            onSelectModel={setSelectedModelId}
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
                {currentChatId ? chats.find(c => c.id === currentChatId)?.title || "Chat" : "Chat"}
              </h1>
            </div>
            <div className="text-sm text-muted-foreground">
              Model: {selectedModelName}
            </div>
          </div>
          
          <ChatContainer
            messages={messages}
            selectedModelName={selectedModelName}
            loading={loading}
          />
          <MessageInput onSendMessage={handleSendMessage} isLoading={loading} />
        </div>
      </div>
    </div>
  );
};

// Helper function for mock responses
const generateMockResponse = (userMessage: string, modelName: string): string => {
  const responses = [
    `I'm ${modelName}, an AI assistant. I'm here to help answer your question about "${userMessage.substring(0, 30)}..."\n\nBased on my training, I can tell you that this is a fascinating topic. Would you like me to elaborate further?`,
    `Thanks for your query. As ${modelName}, I can provide some insights on "${userMessage.substring(0, 30)}..."\n\nThere are multiple perspectives to consider here. Would you like me to explore a specific angle?`,
    `${modelName} here! Regarding "${userMessage.substring(0, 30)}...", I think the key aspects to consider are:\n\n1. The fundamental principles\n2. Practical applications\n3. Future developments\n\nWhich would you like me to focus on?`
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};

export default ChatLayout;
