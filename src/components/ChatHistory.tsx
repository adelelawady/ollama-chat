import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HistoryIcon, MessageSquare } from "lucide-react";
import { ChatSession } from "@/services/api";

interface ChatHistoryProps {
  sessions: ChatSession[];
  currentSessionId: number | null;
  onSelectSession: (sessionId: number) => void;
  onNewChat: () => void;
  collapsed: boolean;
}

const ChatHistory = ({ 
  sessions, 
  currentSessionId, 
  onSelectSession, 
  onNewChat, 
  collapsed 
}: ChatHistoryProps) => {
  return (
    <div className={`flex flex-col flex-grow ${collapsed ? "w-16" : "w-full"} bg-background border-r border-border transition-all duration-200`}>
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && <h2 className="font-semibold">Chat History</h2>}
        <HistoryIcon className="h-5 w-5 text-muted-foreground" />
      </div>
      
      <div className="p-2">
        <Button 
          variant="default" 
          className="w-full flex items-center gap-2 mb-4" 
          onClick={onNewChat}
        >
          <MessageSquare className="h-4 w-4" />
          {!collapsed && <span>New Chat</span>}
        </Button>
      </div>

      <div className="flex-1 overflow-auto">
        {sessions.map((session) => (
          <Button
            key={session.id}
            variant="ghost"
            className={`w-full justify-start p-3 mb-1 text-left h-auto flex items-center gap-2 ${
              session.id === currentSessionId ? "bg-secondary/50" : ""
            }`}
            onClick={() => onSelectSession(session.id)}
          >
            <MessageSquare className="h-4 w-4 flex-shrink-0" />
            {!collapsed && (
              <div className="truncate">
                <span className="block truncate">{session.model_name}</span>
                <span className="text-xs text-muted-foreground block truncate">
                  {new Date(session.created_at).toLocaleDateString()}
                </span>
              </div>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ChatHistory;
