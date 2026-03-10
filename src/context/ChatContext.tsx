import { useState, useEffect, type ReactNode } from 'react';
import type { Message, ChatState, AIModel, Conversation, ChatContextType } from '../types/chat';
import { sendMessageToAI } from '../services/aiService';
import { ChatContext } from './ChatContextInstance';

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [selectedModel, setSelectedModel] = useState<AIModel>('llama-3.3-70b-versatile');
  const [state, setState] = useState<ChatState>(() => {
    const saved = localStorage.getItem('chat_state');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load chat state', e);
      }
    }
    return {
      chats: [],
      activeChatId: null,
      isLoading: false,
      error: null,
    };
  });

  // Persist state to localStorage
  useEffect(() => {
    const { chats, activeChatId } = state;
    localStorage.setItem('chat_state', JSON.stringify({ chats, activeChatId, isLoading: false, error: null }));
  }, [state]);

  const createNewChat = () => {
    const newId = Date.now().toString();
    const newChat: Conversation = {
      id: newId,
      title: 'Nueva Conversación',
      messages: [],
      model: selectedModel,
      timestamp: Date.now(),
    };

    setState(prev => ({
      ...prev,
      chats: [newChat, ...prev.chats],
      activeChatId: newId,
      error: null,
    }));
  };

  const switchChat = (id: string) => {
    setState(prev => ({ ...prev, activeChatId: id, error: null }));
  };

  const deleteChat = (id: string) => {
    setState(prev => {
      const newChats = prev.chats.filter(c => c.id !== id);
      let newActiveId = prev.activeChatId;
      if (prev.activeChatId === id) {
        newActiveId = newChats.length > 0 ? newChats[0].id : null;
      }
      return { ...prev, chats: newChats, activeChatId: newActiveId };
    });
  };

  const sendMessage = async (content: string) => {
    let currentId = state.activeChatId;
    
    // If no active chat, create one automatically
    if (!currentId) {
      const newId = Date.now().toString();
      const newChat: Conversation = {
        id: newId,
        title: content.slice(0, 30) + (content.length > 30 ? '...' : ''),
        messages: [],
        model: selectedModel,
        timestamp: Date.now(),
      };
      setState(prev => ({
        ...prev,
        chats: [newChat, ...prev.chats],
        activeChatId: newId,
      }));
      currentId = newId;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    // Add user message and set loading
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      chats: prev.chats.map(chat => {
        if (chat.id === currentId) {
          const isFirstMessage = chat.messages.length === 0;
          return {
            ...chat,
            title: isFirstMessage ? content.slice(0, 30) + (content.length > 30 ? '...' : '') : chat.title,
            messages: [...chat.messages, userMessage],
          };
        }
        return chat;
      }),
    }));

    try {
      const activeChat = state.chats.find(c => c.id === currentId);
      const history = activeChat ? activeChat.messages : [];
      
      const aiResponse = await sendMessageToAI([...history, userMessage], selectedModel);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: Date.now(),
      };

      setState(prev => ({
        ...prev,
        isLoading: false,
        chats: prev.chats.map(chat => 
          chat.id === currentId 
            ? { ...chat, messages: [...chat.messages, assistantMessage] } 
            : chat
        ),
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
    if (!state.activeChatId) return;
    setState(prev => ({
      ...prev,
      chats: prev.chats.map(chat => 
        chat.id === prev.activeChatId ? { ...chat, messages: [] } : chat
      ),
    }));
  };

  const activeChat = state.chats.find(c => c.id === state.activeChatId);
  const messages = activeChat ? activeChat.messages : [];

  const contextValue: ChatContextType = {
    ...state,
    messages, // Derived for convenience
    sendMessage,
    clearChat,
    createNewChat,
    switchChat,
    deleteChat,
    selectedModel,
    setSelectedModel,
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};
