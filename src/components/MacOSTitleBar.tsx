
import React from "react";
import { Button } from "@/components/ui/button";
import { CircleX, Minimize, Square } from "lucide-react";
import { cn } from "@/lib/utils";

interface MacOSTitleBarProps {
  title?: string;
}

const MacOSTitleBar = ({ title = "Ollama Chat" }: MacOSTitleBarProps) => {
  return (
    <div className="bg-sidebar-background h-8 flex items-center justify-between px-3 border-b border-border">
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1.5">
          <Button
            size="icon"
            variant="ghost"
            className="h-3 w-3 rounded-full bg-destructive hover:bg-destructive/90 p-0"
          >
            <CircleX className="h-2 w-2 text-destructive-foreground" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-3 w-3 rounded-full bg-amber-500 hover:bg-amber-500/90 p-0"
          >
            <Minimize className="h-2 w-2 text-amber-900" />
          </Button>
          <Button
            size="icon"
            variant="ghost" 
            className="h-3 w-3 rounded-full bg-green-500 hover:bg-green-500/90 p-0"
          >
            <Square className="h-2 w-2 text-green-900" />
          </Button>
        </div>
      </div>
      
      <div className="absolute left-0 right-0 mx-auto w-fit">
        <span className="text-xs font-medium">{title}</span>
      </div>
      
      <div className="w-16">
        {/* Spacer to balance the layout */}
      </div>
    </div>
  );
};

export default MacOSTitleBar;
