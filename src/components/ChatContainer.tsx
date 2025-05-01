
import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "@/types/chat";
import ChatMessage from "./ChatMessage";

interface ChatContainerProps {
  messages: Message[];
  selectedModelName: string;
  loading: boolean;
}

const ChatContainer = ({ messages, selectedModelName, loading }: ChatContainerProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current;
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-[calc(100vh-180px)]">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="text-4xl font-bold mb-2">Ollama Chat</div>
          <p className="text-muted-foreground mb-6">
            Start chatting with {selectedModelName || "an AI model"}
          </p>
        </div>
      ) : (
        <ScrollArea ref={scrollAreaRef} className="flex-1 px-4">
          <div className="max-w-3xl mx-auto">
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
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default ChatContainer;
