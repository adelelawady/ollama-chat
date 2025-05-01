
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
        "flex flex-col border-t border-border bg-card transition-all",
        collapsed ? "h-[60px]" : "h-[250px]"
      )}
    >
      <div className="flex items-center justify-between p-2 border-b">
        <div className={cn("flex items-center gap-2", collapsed && "hidden")}>
          <MessagesSquare className="h-5 w-5" />
          <span className="font-semibold text-sm">Models</span>
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

      {!collapsed && (
        <div className="p-2 overflow-auto flex-1">
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
