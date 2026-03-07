import React from 'react';
import { HiOutlineUser, HiOutlineSparkles } from 'react-icons/hi';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const ChatArea: React.FC = () => {
  // Static example for UI/UX demonstration
  const messages: Message[] = [
    { id: '1', role: 'assistant', content: "Hello! I'm your AI assistant. How can I help you today?" },
    { id: '2', role: 'user', content: "Can you help me build a React application with Tailwind CSS?" },
    { id: '3', role: 'assistant', content: "Of course! We are already doing that. This is the UI we've built so far. What do you think?" },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-4 py-8 md:px-8 bg-white dark:bg-neutral-900 transition-colors">
      <div className="max-w-3xl mx-auto space-y-8">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500 ${
              msg.role === 'assistant' ? 'bg-neutral-50/80 dark:bg-neutral-800/20 p-6 rounded-3xl border border-neutral-100 dark:border-neutral-800' : ''
            }`}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                msg.role === 'assistant'
                  ? 'bg-linear-to-br from-blue-500 to-purple-600 text-white shadow-blue-500/20'
                  : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
              }`}
            >
              {msg.role === 'assistant' ? <HiOutlineSparkles size={18} /> : <HiOutlineUser size={18} />}
            </div>
            <div className="flex-1 space-y-2 pt-1 border-0">
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest pl-1">
                {msg.role === 'assistant' ? 'AI Assistant' : 'You'}
              </p>
              <div className="text-neutral-800 dark:text-neutral-200 leading-relaxed text-sm md:text-base pl-1">
                {msg.content}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatArea;
