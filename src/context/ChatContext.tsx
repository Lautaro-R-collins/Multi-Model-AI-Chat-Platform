import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Message, ChatState } from '../types/chat';
import { sendMessageToAI } from '../services/aiService';

interface ChatContextType extends ChatState {
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<ChatState>({
    messages: [
      { id: '1', role: 'assistant', content: "Hello! I'm your AI assistant. How can I help you today?", timestamp: 1710000000000 }
    ],
    isLoading: false,
    error: null,
  });

  const sendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null,
    }));

    try {
      const aiResponse = await sendMessageToAI([...state.messages, userMessage]);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: Date.now(),
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false,
      }));
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  };

  const clearChat = () => {
    setState({
      messages: [],
      isLoading: false,
      error: null,
    });
  };

  return (
    <ChatContext.Provider value={{ ...state, sendMessage, clearChat }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
