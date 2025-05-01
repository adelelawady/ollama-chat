
import { useState } from "react";
import ModelsList from "./ModelsList";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, MessagesSquare, PlusCircle } from "lucide-react";

interface ModelSidebarProps {
  selectedModel: string;
  onSelectModel: (modelId: string) => void;
  onNewChat: () => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const ModelSidebar = ({ 
  selectedModel,
  onSelectModel,
  onNewChat,
  collapsed,
  setCollapsed
}: ModelSidebarProps) => {
  return (
    <div
      className={cn(
        "flex flex-col h-screen border-r border-border bg-card transition-all",
        collapsed ? "w-[60px]" : "w-[280px]"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <div className={cn("flex items-center gap-2", collapsed && "hidden")}>
          <MessagesSquare className="h-5 w-5" />
          <span className="font-semibold">Ollama Chat</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="p-2">
        <Button
          variant="outline"
          className={cn(
            "w-full mb-4 flex items-center justify-center gap-2",
            collapsed ? "px-2" : ""
          )}
          onClick={onNewChat}
        >
          <PlusCircle className="h-4 w-4" />
          {!collapsed && <span>New Chat</span>}
        </Button>
      </div>

      {!collapsed && (
        <div className="p-2">
          <h2 className="text-sm font-semibold mb-2 px-2">Models</h2>
          <ModelsList 
            selectedModel={selectedModel} 
            onSelectModel={onSelectModel}
          />
        </div>
      )}
    </div>
  );
};

export default ModelSidebar;
