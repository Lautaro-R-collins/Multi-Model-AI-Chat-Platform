import { useState, useRef, useEffect } from 'react';
import { HiOutlineArrowUp, HiOutlinePaperClip, HiOutlineEmojiHappy, HiOutlineX } from 'react-icons/hi';
import { useChat } from '../../hooks/useChat';
import EmojiPicker, { type EmojiClickData, Theme } from 'emoji-picker-react';
import { useTheme } from '../../hooks/useTheme';

const MessageInput = () => {
  const [content, setContent] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const { sendMessage, isLoading } = useChat();
  const { theme } = useTheme();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((!content.trim() && files.length === 0) || isLoading) return;

    // In a real app, we would upload files here and get URLs
    // For now, we'll just send the text and clear files
    const messageToSend = content;
    setContent('');
    setFiles([]);
    setShowEmojiPicker(false);
    
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

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setContent(prev => prev + emojiData.emoji);
    // Focus back to textarea after selecting emoji
    textareaRef.current?.focus();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
    // Reset file input value to allow selecting the same file again
    e.target.value = '';
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 md:p-6 bg-white dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800 transition-colors">
      <div className="max-w-3xl mx-auto relative group">
        
        {/* Attachment Previews */}
        {files.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {files.map((file, index) => (
              <div 
                key={index} 
                className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 group/file animate-in zoom-in-95 duration-200"
              >
                <span className="text-xs font-medium text-neutral-600 dark:text-neutral-300 truncate max-w-[150px]">
                  {file.name}
                </span>
                <button 
                  onClick={() => removeFile(index)}
                  className="text-neutral-400 hover:text-red-500 transition-colors cursor-pointer"
                >
                  <HiOutlineX size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Emoji Picker Popover */}
        {showEmojiPicker && (
          <div 
            ref={emojiPickerRef}
            className="absolute bottom-full right-0 mb-4 z-50 shadow-2xl rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-700 animate-in fade-in zoom-in-95 duration-200 origin-bottom-right"
          >
            <EmojiPicker 
              onEmojiClick={onEmojiClick}
              theme={theme === 'dark' ? Theme.DARK : Theme.LIGHT}
              lazyLoadEmojis={true}
              searchPlaceholder="Busca un emoji..."
              width={320}
              height={400}
            />
          </div>
        )}

        <form 
          onSubmit={handleSubmit}
          className="flex items-end gap-1.5 md:gap-2 bg-neutral-100 dark:bg-neutral-800 rounded-2xl p-1.5 md:p-2 transition-all focus-within:ring-2 focus-within:ring-blue-500/50 relative"
        >
          {/* Hidden File Input */}
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden" 
            multiple
          />

          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-neutral-500 hover:text-blue-500 transition-colors rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 shrink-0 cursor-pointer"
            title="Adjuntar archivos"
          >
            <HiOutlinePaperClip size={20} />
          </button>
          
          <textarea
            ref={textareaRef}
            rows={1}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe un mensaje..."
            className="flex-1 bg-transparent border-none focus:ring-0 outline-hidden resize-none py-2 text-neutral-700 dark:text-neutral-200 placeholder-neutral-500 max-h-48 text-sm md:text-base min-w-0 cursor-text"
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${target.scrollHeight}px`;
            }}
          />

          <button 
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`hidden sm:flex p-2 transition-colors rounded-lg shrink-0 cursor-pointer ${
              showEmojiPicker 
                ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400' 
                : 'text-neutral-500 hover:text-blue-500 hover:bg-neutral-200 dark:hover:bg-neutral-700'
            }`}
            title="Emojis"
          >
            <HiOutlineEmojiHappy size={20} />
          </button>

          <button 
            type="submit"
            disabled={(!content.trim() && files.length === 0) || isLoading}
            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:grayscale shrink-0 cursor-pointer"
          >
            <HiOutlineArrowUp size={20} strokeWidth={2.5} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessageInput;
