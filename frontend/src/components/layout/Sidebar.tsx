import { HiOutlineChevronRight, HiOutlineChatAlt2, HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi';
import { useChat } from '../../hooks/useChat';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const { chats, activeChatId, createNewChat, switchChat, deleteChat, isTemporaryMode } = useChat();
  const { state: { user, isAuthenticated } } = useAuth();

  return (
    <aside
      className={`fixed left-0 top-16 bottom-0 z-40 w-64 bg-neutral-50 dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className={`h-full flex flex-col transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none md:opacity-0'}`}>
        <div className="p-4 flex-1 overflow-y-auto">
          <button 
            onClick={createNewChat}
            className="w-full flex items-center gap-2 p-3 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-500 hover:border-blue-500 hover:text-blue-500 transition-all mb-6 cursor-pointer"
          >
            <HiOutlinePlus size={20} />
            <span className="font-medium text-sm">Nuevo Chat</span>
          </button>

          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 px-2">Chats Recientes</h3>
            {chats.length === 0 ? (
              <p className="text-xs text-neutral-400 px-2 italic">No hay chats aún</p>
            ) : (
              chats.map((chat) => (
                <div key={chat.id} className="group relative">
                  <button
                    onClick={() => switchChat(chat.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left cursor-pointer pr-10 ${
                      activeChatId === chat.id && !isTemporaryMode
                        ? 'bg-neutral-200 dark:bg-neutral-800 text-blue-600 dark:text-blue-400' 
                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <HiOutlineChatAlt2 size={18} className="shrink-0" />
                    <span className="text-sm truncate font-medium">{chat.title}</span>
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChat(chat.id);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                    title="Eliminar chat"
                  >
                    <HiOutlineTrash size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-3 p-2 bg-neutral-100 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 flex items-center justify-center text-white text-sm font-bold shadow-sm">
              {user?.username?.charAt(0).toUpperCase() || 'I'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 truncate">
                {isAuthenticated ? user?.username : 'Invitado'}
              </p>
              <p className="text-[10px] text-neutral-500 truncate uppercase tracking-widest font-bold">
                {isAuthenticated ? user?.email : 'Acceso Limitado'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`absolute top-1/2 -right-4 -translate-y-1/2 w-8 h-8 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-full flex items-center justify-center shadow-lg text-neutral-500 hover:text-blue-500 transition-all cursor-pointer ${
          isOpen ? 'rotate-180' : ''
        }`}
      >
        <HiOutlineChevronRight size={16} />
      </button>
    </aside>
  );
};

export default Sidebar;
