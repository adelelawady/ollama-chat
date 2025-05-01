
import { useState } from "react";
import ModelSidebar from "./ModelSidebar";
import ChatContainer from "./ChatContainer";
import MessageInput from "./MessageInput";
import { dummyModels } from "@/data/dummyData";
import { Message } from "@/types/chat";

const ChatLayout = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedModelId, setSelectedModelId] = useState("llama3");
  const [loading, setLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const selectedModel = dummyModels.find(model => model.id === selectedModelId);
  const selectedModelName = selectedModel?.name || "AI Assistant";

  const handleNewChat = () => {
    setMessages([]);
  };

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, userMessage]);
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
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error getting response:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <ModelSidebar
        selectedModel={selectedModelId}
        onSelectModel={setSelectedModelId}
        onNewChat={handleNewChat}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <ChatContainer
          messages={messages}
          selectedModelName={selectedModelName}
          loading={loading}
        />
        <MessageInput onSendMessage={handleSendMessage} isLoading={loading} />
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
