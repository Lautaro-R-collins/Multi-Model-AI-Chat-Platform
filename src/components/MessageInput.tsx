import React from 'react';
import { HiOutlineArrowUp, HiOutlinePaperClip, HiOutlineEmojiHappy } from 'react-icons/hi';

const MessageInput: React.FC = () => {
  return (
    <div className="p-4 md:p-6 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
      <div className="max-w-3xl mx-auto relative group">
        <div className="flex items-end gap-2 bg-neutral-100 dark:bg-neutral-800 rounded-2xl p-2 transition-all focus-within:ring-2 focus-within:ring-blue-500/50">
          <button className="p-2 text-neutral-500 hover:text-blue-500 transition-colors rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700">
            <HiOutlinePaperClip size={20} />
          </button>
          
          <textarea
            rows={1}
            placeholder="Ask anything..."
            className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-2 text-neutral-700 dark:text-neutral-200 placeholder-neutral-500 max-h-48"
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${target.scrollHeight}px`;
            }}
          />

          <button className="p-2 text-neutral-500 hover:text-blue-500 transition-colors rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700">
            <HiOutlineEmojiHappy size={20} />
          </button>

          <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:grayscale">
            <HiOutlineArrowUp size={20} strokeWidth={2.5} />
          </button>
        </div>
        <p className="text-[10px] text-center mt-2 text-neutral-400">
          AI can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
};

export default MessageInput;
