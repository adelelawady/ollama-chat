
import { OllamaModel } from "@/types/ollama";

export const dummyModels: OllamaModel[] = [
  {
    id: "llama3",
    name: "Llama 3 8B",
    description: "Meta's latest open LLM, optimized for chat and coding. 8 billion parameters.",
    parameters: 8000000000,
    context: 8192,
  },
  {
    id: "gemma",
    name: "Gemma 7B",
    description: "Google's lightweight and capable open model. Great for everyday tasks.",
    parameters: 7000000000,
    context: 4096,
  },
  {
    id: "mistral",
    name: "Mistral 7B",
    description: "High-performance open language model with efficient inference.",
    parameters: 7000000000,
    context: 8192,
  },
  {
    id: "codellama",
    name: "CodeLlama 13B",
    description: "Specialized for code generation and programming tasks.",
    parameters: 13000000000, 
    context: 16384,
  },
  {
    id: "llama2",
    name: "Llama 2 13B",
    description: "Meta's previous LLM, well-balanced for general tasks.",
    parameters: 13000000000,
    context: 4096,
  },
  {
    id: "phi3",
    name: "Phi-3 Mini",
    description: "Microsoft's compact but powerful model with surprising capabilities.",
    parameters: 4000000000,
    context: 4096,
  },
  {
    id: "wizard",
    name: "WizardCoder 15B",
    description: "Advanced code generation model with improved reasoning.",
    parameters: 15000000000,
    context: 8192,
  },
  {
    id: "neural-chat",
    name: "Neural Chat 7B",
    description: "Intel's optimized conversational model for general use.",
    parameters: 7000000000,
    context: 4096,
  },
  {
    id: "stablelm",
    name: "StableLM 7B",
    description: "Stable and reliable for a variety of tasks. Good at following instructions.",
    parameters: 7000000000,
    context: 4096,
  },
];
