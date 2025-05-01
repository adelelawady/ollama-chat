
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Message } from "@/types/chat";

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === "user";
  
  return (
    <div
      className={cn(
        "flex w-full items-start gap-4 py-4 message-animation",
        isUser ? "flex-row" : "flex-row bg-secondary/30"
      )}
    >
      <Avatar className={cn("h-8 w-8", isUser ? "bg-primary" : "bg-ollama")}>
        <span className="text-xs">{isUser ? "You" : "AI"}</span>
      </Avatar>
      
      <div className="flex-1 space-y-2">
        <div className="font-semibold">{isUser ? "You" : message.modelName}</div>
        <div className="prose prose-invert max-w-none">
          {message.content.split("\n").map((line, i) => (
            <p key={i} className={line === "" ? "h-4" : ""}>
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
