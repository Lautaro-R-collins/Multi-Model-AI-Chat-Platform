import { useState, type ReactNode } from 'react';
import type { Message, ChatState, AIModel } from '../types/chat';
import { sendMessageToAI } from '../services/aiService';
import { ChatContext } from './ChatContextInstance';

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [selectedModel, setSelectedModel] = useState<AIModel>('llama-3.3-70b-versatile');
  const [state, setState] = useState<ChatState>({
    messages: [],
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
      const aiResponse = await sendMessageToAI([...state.messages, userMessage], selectedModel);
      
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
    <ChatContext.Provider value={{ ...state, sendMessage, clearChat, selectedModel, setSelectedModel }}>
      {children}
    </ChatContext.Provider>
  );
};
