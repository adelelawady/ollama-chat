import React from "react";
import { Button } from "@/components/ui/button";
import { X, Minus, Square } from "lucide-react";
import { cn } from "@/lib/utils";

interface MacOSTitleBarProps {
  title?: string;
}

const MacOSTitleBar = ({ title = "Ollama Chat" }: MacOSTitleBarProps) => {
  return (
    <div className="bg-sidebar-background h-8 flex items-center justify-between px-3 border-b border-border">
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2">
          <Button
            size="icon"
            variant="ghost"
            className="h-4 w-4 rounded-full bg-[#ff5f57] hover:bg-[#ff5f57]/90 p-0 flex items-center justify-center"
          >
            <X className="h-2.5 w-2.5 text-[#4d0000] stroke-[2.5]" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-4 w-4 rounded-full bg-[#febc2e] hover:bg-[#febc2e]/90 p-0 flex items-center justify-center"
          >
            <Minus className="h-2.5 w-2.5 text-[#995700] stroke-[2.5]" />
          </Button>
          <Button
            size="icon"
            variant="ghost" 
            className="h-4 w-4 rounded-full bg-[#28c840] hover:bg-[#28c840]/90 p-0 flex items-center justify-center"
          >
            <Square className="h-2.5 w-2.5 text-[#006500] stroke-[2.5]" />
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
