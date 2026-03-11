import { IoMdMoon, IoMdSunny } from 'react-icons/io';
import { HiOutlineUserCircle, HiOutlineServer, HiChevronDown, HiOutlineLogout } from 'react-icons/hi';
import { useTheme } from '../hooks/useTheme';
import { useChat } from '../hooks/useChat';
import { useAuth } from '../context/AuthContext';
import AuthModal from './auth/AuthModal';
import type { AIModel } from '../types/chat';
import { useState } from 'react';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { selectedModel, setSelectedModel } = useChat();
  const { state: { user, isAuthenticated }, logout } = useAuth();
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const models: { id: AIModel; name: string; desc: string }[] = [
    { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B', desc: 'Más inteligente y versátil' },
    { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B', desc: 'Ultra rápido y eficiente' },
  ];

  const currentModelName = models.find(m => m.id === selectedModel)?.name || 'Select Model';

  return (
    <nav className="fixed top-0 right-0 left-0 h-16 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between px-4 md:px-8 z-50 transition-colors">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold">
          ChatIAClone
        </h1>
        
        {/* Model Selector */}
        <div className="relative hidden md:block">
          <button 
            onClick={() => setIsModelMenuOpen(!isModelMenuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 transition-all text-sm font-medium text-neutral-700 dark:text-neutral-300 border border-transparent focus:border-blue-500/50 cursor-pointer"
          >
            <HiOutlineServer className="text-blue-500" />
            <span>{currentModelName}</span>
            <HiChevronDown className={`transition-transform duration-200 ${isModelMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {isModelMenuOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsModelMenuOpen(false)}
              ></div>
              <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/40 z-20 py-2 animate-in fade-in zoom-in-95 duration-100 origin-top-left">
                {models.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => {
                      setSelectedModel(model.id);
                      setIsModelMenuOpen(false);
                    }}
                    className={`w-full flex flex-col items-start px-4 py-2.5 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors cursor-pointer ${
                      selectedModel === model.id ? 'bg-blue-50/50 dark:bg-blue-500/10' : ''
                    }`}
                  >
                    <span className={`text-sm font-semibold ${selectedModel === model.id ? 'text-blue-600 dark:text-blue-400' : 'text-neutral-700 dark:text-neutral-200'}`}>
                      {model.name}
                    </span>
                    <span className="text-[10px] text-neutral-500 dark:text-neutral-400">
                      {model.desc}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-600 dark:text-neutral-400 cursor-pointer"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <IoMdMoon size={22} /> : <IoMdSunny size={22} />}
        </button>
        
        {isAuthenticated ? (
          <div className="flex items-center gap-3 ml-2">
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hidden sm:block">
              {user?.username}
            </span>
            <button 
              onClick={logout}
              className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 cursor-pointer"
              title="Cerrar sesión"
            >
              <HiOutlineLogout size={22} />
            </button>
          </div>
        ) : (
          <button 
            onClick={() => {
              setAuthMode('login');
              setIsAuthModalOpen(true);
            }}
            className="flex items-center gap-2 p-2 px-3 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-600 dark:text-neutral-400 cursor-pointer group"
          >
            <HiOutlineUserCircle size={26} className="group-hover:text-blue-500 transition-colors" />
            <span className="text-sm font-medium hidden sm:block">Iniciar sesión</span>
          </button>
        )}
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialMode={authMode} 
      />
    </nav>
  );
};

export default Navbar;
