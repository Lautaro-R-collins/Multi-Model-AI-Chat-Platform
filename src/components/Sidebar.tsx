import React from 'react';
import { HiOutlineChevronRight, HiOutlineChatAlt2, HiOutlinePlus } from 'react-icons/hi';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  return (
    <aside
      className={`fixed left-0 top-16 bottom-0 z-40 bg-neutral-50 dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 transition-all duration-300 ease-in-out ${
        isOpen ? 'w-64' : 'w-0'
      }`}
    >
      <div className={`h-full flex flex-col ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="p-4 flex-1 overflow-y-auto">
          <button className="w-full flex items-center gap-2 p-3 border border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-500 hover:border-blue-500 hover:text-blue-500 transition-all mb-6 cursor-pointer">
            <HiOutlinePlus size={20} />
            <span className="font-medium text-sm">New Chat</span>
          </button>

          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 px-2">Recent</h3>
            {[1, 2, 3].map((i) => (
              <button
                key={i}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors text-left cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-neutral-200 dark:bg-neutral-800 text-neutral-500">
                  <HiOutlineChatAlt2 size={18} />
                </div>
                <span className="text-sm truncate">Chat history example {i}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-3 p-2 bg-neutral-100 dark:bg-neutral-900 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
              LR
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200 truncate">Lauta Collins</p>
              <p className="text-xs text-neutral-500 truncate">Pro Plan</p>
            </div>
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`absolute top-1/2 -right-4 -translate-y-1/2 w-8 h-8 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full flex items-center justify-center shadow-lg text-neutral-500 hover:text-blue-500 transition-all cursor-pointer ${
          isOpen ? 'rotate-180' : ''
        }`}
      >
        <HiOutlineChevronRight size={16} />
      </button>
    </aside>
  );
};

export default Sidebar;
