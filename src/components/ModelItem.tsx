
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ModelItemProps {
  name: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}

const ModelItem = ({ name, description, selected, onClick }: ModelItemProps) => {
  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start px-3 py-5 text-left h-auto flex flex-col items-start gap-1 border-l-2",
        selected
          ? "border-l-ollama bg-secondary/50"
          : "border-l-transparent hover:border-l-muted-foreground/50"
      )}
      onClick={onClick}
    >
      <div className="font-semibold text-sm">{name}</div>
      <div className="text-xs text-muted-foreground line-clamp-2">{description}</div>
    </Button>
  );
};

export default ModelItem;
