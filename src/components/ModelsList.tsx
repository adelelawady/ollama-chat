import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import ModelItem from "./ModelItem";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";

interface ModelsListProps {
  selectedModel: string;
  onSelectModel: (modelId: string) => void;
  onCreateNewChat: () => void;
}

interface OllamaModel {
  name: string;
  modified_at: string;
  size: number;
  digest: string;
}

const ModelsList = ({ selectedModel, onSelectModel, onCreateNewChat }: ModelsListProps) => {
  const [models, setModels] = useState<OllamaModel[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchModels = async () => {
      setLoading(true);
      try {
        const response = await api.getModels();
        setModels(response.models || []);
      } catch (error) {
        console.error("Failed to fetch models:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load models. Please make sure the backend server is running.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, [toast]);

  const handleModelSelect = (modelId: string) => {
    onSelectModel(modelId);
    onCreateNewChat();
  };

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
            key={model.name}
            name={model.name}
            description={`Size: ${(model.size / 1024 / 1024 / 1024).toFixed(2)} GB`}
            selected={selectedModel === model.name}
            onClick={() => handleModelSelect(model.name)}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default ModelsList;
