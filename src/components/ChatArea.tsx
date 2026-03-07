import React from 'react';

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
    <div className="flex-1 overflow-y-auto px-2 py-4 md:px-8 md:py-8 bg-white dark:bg-neutral-900 transition-colors">
      <div className="max-w-3xl mx-auto flex flex-col space-y-4 md:space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col max-w-[85%] md:max-w-[80%] animate-in fade-in slide-in-from-bottom-2 duration-500 ${
              msg.role === 'user' ? 'self-end' : 'self-start'
            }`}
          >
            <div
              className={
                msg.role === 'user'
                  ? 'p-4 md:p-5 rounded-2xl md:rounded-3xl bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200'
                  : 'p-2 md:p-3 text-neutral-800 dark:text-neutral-200'
              }
            >
              <div className="text-sm md:text-base leading-relaxed">
                {msg.content}
              </div>
            </div>
            <p className={`text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1 px-2 ${
              msg.role === 'user' ? 'text-right' : 'text-left'
            }`}>
              {msg.role === 'assistant' ? 'AI Assistant' : 'You'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatArea;
