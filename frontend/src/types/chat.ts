export type Role = 'user' | 'assistant' | 'system';

export type AIModel = 'llama-3.3-70b-versatile' | 'llama-3.1-8b-instant' | 'llama-3.2-11b-vision-preview' | 'llama-3.2-3b-preview';

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  model: AIModel;
  timestamp: number;
}

export interface ChatState {
  chats: Conversation[];
  activeChatId: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface ChatContextType extends ChatState {
  messages: Message[];
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
  createNewChat: () => void;
  switchChat: (id: string) => void;
  deleteChat: (id: string) => void;
  selectedModel: AIModel;
  setSelectedModel: (model: AIModel) => void;
}
