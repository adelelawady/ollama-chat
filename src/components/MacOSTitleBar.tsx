import React from "react";
import { Button } from "@/components/ui/button";
import { X, Minus, Square } from "lucide-react";
import { cn } from "@/lib/utils";

// Extend the Window interface to include electron
declare global {
  interface Window {
    electron?: {
      minimize: () => void;
      maximize: () => void;
      close: () => void;
    };
  }
}

interface MacOSTitleBarProps {
  title?: string;
}

const MacOSTitleBar = ({ title = "Ollama Chat" }: MacOSTitleBarProps) => {
  const handleClose = () => {
    if (window.electron) {
      window.electron.close();
    }
  };

  const handleMinimize = () => {
    if (window.electron) {
      window.electron.minimize();
    }
  };

  const handleMaximize = () => {
    if (window.electron) {
      window.electron.maximize();
    }
  };

  return (
    <div className="bg-sidebar-background h-8 flex items-center justify-between px-3 border-b border-border">
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2">
          <Button
            size="icon"
            variant="ghost"
            className="h-3.5 w-3.5 rounded-full bg-[#ff5f57] hover:bg-[#ff5f57] p-0 flex items-center justify-center transition-colors"
            onClick={handleClose}
          >
            <X className="h-2 w-2 text-[#4d0000] stroke-[2.5] opacity-0 group-hover:opacity-100" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-3.5 w-3.5 rounded-full bg-[#febc2e] hover:bg-[#febc2e] p-0 flex items-center justify-center transition-colors"
            onClick={handleMinimize}
          >
            <Minus className="h-2 w-2 text-[#995700] stroke-[2.5] opacity-0 group-hover:opacity-100" />
          </Button>
          <Button
            size="icon"
            variant="ghost" 
            className="h-3.5 w-3.5 rounded-full bg-[#28c840] hover:bg-[#28c840] p-0 flex items-center justify-center transition-colors"
            onClick={handleMaximize}
          >
            <Square className="h-2 w-2 text-[#006500] stroke-[2.5] opacity-0 group-hover:opacity-100" />
          </Button>
        </div>
      </div>
      
      <div className="absolute left-0 right-0 mx-auto w-fit">
        <span className="text-xs font-medium text-muted-foreground">{title}</span>
      </div>
      
      <div className="w-16">
        {/* Spacer to balance the layout */}
      </div>
    </div>
  );
};

export default MacOSTitleBar;
