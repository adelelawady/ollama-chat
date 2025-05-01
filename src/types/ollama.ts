
export interface OllamaModel {
  id: string;
  name: string;
  description: string;
  parameters?: number;
  size?: string;
  quantization?: string;
  context?: number;
}
