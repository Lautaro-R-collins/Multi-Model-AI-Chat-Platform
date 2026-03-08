import { useChat } from '../context/ChatContext';

const ChatArea = () => {
  const { messages, isLoading, error } = useChat();

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
                  : 'p-2 md:p-3 text-neutral-800 dark:text-neutral-200 text-left w-full'
              }
            >
              <div className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
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

        {isLoading && (
          <div className="flex flex-col max-w-[85%] md:max-w-[80%] animate-pulse self-start">
            <div className="p-4 md:p-5 rounded-2xl md:rounded-3xl bg-neutral-100 dark:bg-neutral-800 text-neutral-400">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="max-w-md mx-auto p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatArea;
