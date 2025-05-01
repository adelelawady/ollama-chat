
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import ModelItem from "./ModelItem";
import { ScrollArea } from "@/components/ui/scroll-area";
import { OllamaModel } from "@/types/ollama";
import { dummyModels } from "@/data/dummyData";

interface ModelsListProps {
  selectedModel: string;
  onSelectModel: (modelId: string) => void;
}

const ModelsList = ({ selectedModel, onSelectModel }: ModelsListProps) => {
  const [models, setModels] = useState<OllamaModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from Ollama API
    // This is simulating an API call with dummy data
    const fetchModels = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setModels(dummyModels);
      } catch (error) {
        console.error("Failed to fetch models:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-200px)]">
      <div className="flex flex-col gap-1">
        {models.map((model) => (
          <ModelItem
            key={model.id}
            name={model.name}
            description={model.description}
            selected={selectedModel === model.id}
            onClick={() => onSelectModel(model.id)}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default ModelsList;
