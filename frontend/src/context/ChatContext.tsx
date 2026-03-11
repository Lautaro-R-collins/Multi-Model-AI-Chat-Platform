import { useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Message, ChatState, AIModel, Conversation, ChatContextType } from '../types/chat';
import { sendMessageToAI } from '../services/aiService';
import { ChatContext } from './ChatContextInstance';
import { useAuth } from './AuthContext';

const API_URL = 'http://localhost:5000/api';

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const { state: auth } = useAuth();
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

  // Persist guest state to localStorage
  useEffect(() => {
    if (!auth.isAuthenticated) {
      const { chats, activeChatId } = state;
      localStorage.setItem('chat_state', JSON.stringify({ chats, activeChatId, isLoading: false, error: null }));
    }
  }, [state, auth.isAuthenticated]);

  // Fetch chats from backend when authenticated
  const fetchChats = useCallback(async () => {
    if (!auth.token) return;
    
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const res = await fetch(`${API_URL}/chats`, {
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });
      
      if (!res.ok) throw new Error('Failed to fetch chats');
      
      const data = await res.json();
      const backendChats: Conversation[] = data.map((chat: { _id: string; title: string; messages: Message[]; aiModel: string; timestamp: number }) => ({
        id: chat._id,
        title: chat.title,
        messages: chat.messages,
        model: chat.aiModel as AIModel,
        timestamp: chat.timestamp,
      }));

      setState(prev => ({
        ...prev,
        chats: backendChats,
        activeChatId: backendChats.length > 0 ? backendChats[0].id : null,
        isLoading: false,
      }));
    } catch (err: any) {
      setState(prev => ({ ...prev, isLoading: false, error: err.message }));
    }
  }, [auth.token]);

  useEffect(() => {
    if (auth.isAuthenticated) {
      fetchChats();
    } else {
      // Revert to local storage if logged out
      const saved = localStorage.getItem('chat_state');
      if (saved) {
        setState(JSON.parse(saved));
      } else {
        setState({ chats: [], activeChatId: null, isLoading: false, error: null });
      }
    }
  }, [auth.isAuthenticated, fetchChats]);

  const createNewChat = async () => {
    const tempId = Date.now().toString();
    const newChat: Conversation = {
      id: tempId,
      title: 'Nueva Conversación',
      messages: [],
      model: selectedModel,
      timestamp: Date.now(),
    };

    // Optimistic UI update
    setState(prev => ({
      ...prev,
      chats: [newChat, ...prev.chats],
      activeChatId: tempId,
      error: null,
    }));

    if (auth.isAuthenticated && auth.token) {
      try {
        const res = await fetch(`${API_URL}/chats`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth.token}`,
          },
          body: JSON.stringify({
            title: newChat.title,
            messages: [],
            model: selectedModel,
          }),
        });

        if (!res.ok) throw new Error('Failed to create chat in backend');
        
        const savedChat = await res.json() as { _id: string };
        // Update the tempId with the real backend ID
        setState(prev => ({
          ...prev,
          chats: prev.chats.map(c => c.id === tempId ? { ...c, id: savedChat._id } : c),
          activeChatId: prev.activeChatId === tempId ? savedChat._id : prev.activeChatId,
        }));
      } catch (err: unknown) {
        console.error('Error syncing new chat:', err);
      }
    }
  };

  const switchChat = (id: string) => {
    setState(prev => ({ ...prev, activeChatId: id, error: null }));
  };

  const deleteChat = async (id: string) => {
    setState(prev => {
      const newChats = prev.chats.filter(c => c.id !== id);
      let newActiveId = prev.activeChatId;
      if (prev.activeChatId === id) {
        newActiveId = newChats.length > 0 ? newChats[0].id : null;
      }
      return { ...prev, chats: newChats, activeChatId: newActiveId };
    });

    if (auth.isAuthenticated && auth.token) {
      try {
        await fetch(`${API_URL}/chats/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${auth.token}`,
          },
        });
      } catch (err) {
        console.error('Error deleting chat from backend:', err);
      }
    }
  };

  const syncChatMessages = async (chatId: string, messages: Message[], title?: string) => {
    if (!auth.isAuthenticated || !auth.token) return;
    
    try {
      await fetch(`${API_URL}/chats/${chatId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ messages, title }),
      });
    } catch (err) {
      console.error('Error syncing messages:', err);
    }
  };

  const sendMessage = async (content: string) => {
    let currentId = state.activeChatId;
    let isNewChat = false;
    
    // If no active chat, create one automatically
    if (!currentId) {
      const tempId = Date.now().toString();
      const newChat: Conversation = {
        id: tempId,
        title: content.slice(0, 30) + (content.length > 30 ? '...' : ''),
        messages: [],
        model: selectedModel,
        timestamp: Date.now(),
      };
      setState(prev => ({
        ...prev,
        chats: [newChat, ...prev.chats],
        activeChatId: tempId,
      }));
      currentId = tempId;
      isNewChat = true;
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

      setState(prev => {
        const updatedChats = prev.chats.map(chat => 
          chat.id === currentId 
            ? { ...chat, messages: [...chat.messages, assistantMessage] } 
            : chat
        );
        
        // Sync with backend after assistant message
        const finalChat = updatedChats.find(c => c.id === currentId);
        if (finalChat) {
          if (isNewChat && auth.isAuthenticated) {
            // First message in a newly auto-created chat
            fetch(`${API_URL}/chats`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.token}`,
              },
              body: JSON.stringify({
                title: finalChat.title,
                messages: finalChat.messages,
                model: selectedModel,
              }),
            }).then(res => res.json()).then(savedChat => {
              if (savedChat && typeof savedChat === 'object' && '_id' in savedChat) {
                const chatId = (savedChat as { _id: string })._id;
                setState(p => ({
                  ...p,
                  chats: p.chats.map(c => c.id === currentId ? { ...c, id: chatId } : c),
                  activeChatId: p.activeChatId === currentId ? chatId : p.activeChatId,
                }));
              }
            });
          } else {
            syncChatMessages(currentId!, finalChat.messages, finalChat.title);
          }
        }

        return {
          ...prev,
          isLoading: false,
          chats: updatedChats,
        };
      });
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
    
    const activeChat = state.chats.find(c => c.id === state.activeChatId);
    if (activeChat) syncChatMessages(state.activeChatId!, []);
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
