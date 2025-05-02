import { useRef, useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "@/types/chat";
import ChatMessage from "./ChatMessage";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";

interface ChatContainerProps {
  selectedModelName: string;
  sessionId?: number;
  messages: Message[];
  onSendMessage: (content: string) => Promise<void>;
  loading: boolean;
  isConnected: boolean;
  onSelectModel: (modelName: string) => void;
}

const ChatContainer = ({ 
  selectedModelName, 
  sessionId, 
  messages,
  onSendMessage,
  loading,
  isConnected,
  onSelectModel
}: ChatContainerProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [models, setModels] = useState<{ name: string }[]>([]);
  const { toast } = useToast();
  
  // Scroll to bottom when messages change or loading state changes
  /*
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);
  */
  // Fetch models
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await api.getModels();
        setModels(response.models || []);
      } catch (error) {
        console.error("Failed to fetch models:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load models. Please make sure the backend server is running.",
        });
      }
    };

    fetchModels();
  }, [toast]);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex justify-between items-center px-4 py-2 border-b">
        <div className="flex items-center gap-2">
          <Select value={selectedModelName} onValueChange={onSelectModel}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              {models.map((model) => (
                <SelectItem key={model.name} value={model.name}>
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Badge variant={isConnected ? "default" : "destructive"}>
          {isConnected ? "Connected" : "Disconnected"}
        </Badge>
      </div>

      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="text-4xl font-bold mb-2">Ollama Chat</div>
          <p className="text-muted-foreground mb-6">
            Start chatting with {selectedModelName || "an AI model"}
          </p>
        </div>
      ) : (
        <ScrollArea ref={scrollAreaRef} className="flex-1 px-4">
          <div className="max-w-3xl mx-auto space-y-4 py-4">
            {messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}
            
            {loading && (
              <div className="flex justify-center py-4">
                <div className="flex space-x-2">
                  <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default ChatContainer;
