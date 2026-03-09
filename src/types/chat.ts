export type Role = 'user' | 'assistant' | 'system';

export type AIModel = 'llama-3.3-70b-versatile' | 'mixtral-8x7b-32768' | 'gemma2-9b-it' | 'deepseek-r1-distill-llama-70b';

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export interface ChatContextType extends ChatState {
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
  selectedModel: AIModel;
  setSelectedModel: (model: AIModel) => void;
}
