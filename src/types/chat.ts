export interface Message {
  id?: string;
  content: string;
  role: "user" | "assistant" | "system";
  timestamp: string;
  modelName?: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  modelId: string;
  createdAt: string;
  updatedAt: string;
}
