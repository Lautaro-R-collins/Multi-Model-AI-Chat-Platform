import React from 'react';
import { HiOutlineChevronRight, HiOutlineChatAlt2, HiOutlinePlus } from 'react-icons/hi';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  return (
    <aside
      className={`fixed left-0 top-16 bottom-0 z-40 w-64 bg-neutral-50 dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className={`h-full flex flex-col transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none md:opacity-0'}`}>
        <div className="p-4 flex-1 overflow-y-auto">
          <button className="w-full flex items-center gap-2 p-3 border border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-500 hover:border-blue-500 hover:text-blue-500 transition-all mb-6 cursor-pointer">
            <HiOutlinePlus size={20} />
            <span className="font-medium text-sm">New Chat</span>
          </button>

          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 px-2">Recent Chats</h3>
            {[1, 2, 3].map((i) => (
              <button
                key={i}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors text-left cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-neutral-200 dark:bg-neutral-800 text-neutral-500 group-hover:bg-blue-500/10 group-hover:text-blue-500 transition-colors">
                  <HiOutlineChatAlt2 size={18} />
                </div>
                <span className="text-sm truncate">Chat example {i}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-3 p-2 bg-neutral-100 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-neutral-300 to-neutral-400 dark:from-neutral-700 dark:to-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300 text-xs font-bold shadow-sm">
              G
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 truncate">Guest User</p>
              <p className="text-[10px] text-neutral-500 truncate uppercase tracking-widest font-bold">Limited Access</p>
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
