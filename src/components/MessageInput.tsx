import { useState, useRef } from 'react';
import { HiOutlineArrowUp, HiOutlinePaperClip, HiOutlineEmojiHappy } from 'react-icons/hi';
import { useChat } from '../hooks/useChat';

const MessageInput = () => {
  const [content, setContent] = useState('');
  const { sendMessage, isLoading } = useChat();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!content.trim() || isLoading) return;

    const messageToSend = content;
    setContent('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    
    await sendMessage(messageToSend);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="p-4 md:p-6 bg-white dark:bg-neutral-900">
      <div className="max-w-3xl mx-auto relative group">
        <form 
          onSubmit={handleSubmit}
          className="flex items-end gap-1.5 md:gap-2 bg-neutral-100 dark:bg-neutral-800 rounded-2xl p-1.5 md:p-2 transition-all focus-within:ring-2 focus-within:ring-blue-500/50"
        >
          <button 
            type="button"
            className="p-2 text-neutral-500 hover:text-blue-500 transition-colors rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 shrink-0"
          >
            <HiOutlinePaperClip size={20} />
          </button>
          
          <textarea
            ref={textareaRef}
            rows={1}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
            className="flex-1 bg-transparent border-none focus:ring-0 outline-hidden resize-none py-2 text-neutral-700 dark:text-neutral-200 placeholder-neutral-500 max-h-48 text-sm md:text-base min-w-0"
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${target.scrollHeight}px`;
            }}
          />

          <button 
            type="button"
            className="hidden sm:flex p-2 text-neutral-500 hover:text-blue-500 transition-colors rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 shrink-0"
          >
            <HiOutlineEmojiHappy size={20} />
          </button>

          <button 
            type="submit"
            disabled={!content.trim() || isLoading}
            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:grayscale shrink-0"
          >
            <HiOutlineArrowUp size={20} strokeWidth={2.5} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessageInput;
