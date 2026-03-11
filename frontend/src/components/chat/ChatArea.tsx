import { useRef, useEffect } from 'react';
import { useChat } from '../../hooks/useChat';
import { HiOutlineSparkles, HiOutlineChatAlt2, HiOutlineCode, HiOutlineLightBulb } from 'react-icons/hi';

const ChatArea = () => {
  const { messages, isLoading, error, sendMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700">
        <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 dark:text-white mb-4">
          ¿En qué puedo ayudarte hoy?
        </h2>
        <p className="text-neutral-500 dark:text-neutral-400 max-w-md mb-12 text-lg">
          Tu asistente de IA está listo.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full">
          {[
            { icon: HiOutlineChatAlt2, text: "Cuéntame un dato curioso sobre el espacio" },
            { icon: HiOutlineCode, text: "¿Cómo puedo centrar un div en CSS?" },
            { icon: HiOutlineLightBulb, text: "Dame ideas para un proyecto de React" },
            { icon: HiOutlineSparkles, text: "Escribe un poema" }
          ].map((item, i) => (
            <div 
              key={i}
              onClick={() => sendMessage(item.text)}
              className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800/50 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all cursor-pointer flex items-center gap-3 text-left group"
            >
              <item.icon className="text-neutral-400 group-hover:text-blue-500 transition-colors" />
              <span className="text-sm text-neutral-600 dark:text-neutral-300">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

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
        <div ref={messagesEndRef} className="h-4" />
      </div>
    </div>
  );
};

export default ChatArea;
