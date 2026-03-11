import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import MainLayout from './layouts/MainLayout';
import ChatArea from './components/chat/ChatArea';
import MessageInput from './components/chat/MessageInput';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ChatProvider>
          <MainLayout>
            <ChatArea />
            <MessageInput />
          </MainLayout>
        </ChatProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
