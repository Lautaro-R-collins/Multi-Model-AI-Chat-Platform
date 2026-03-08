import { ThemeProvider } from './context/ThemeContext';
import { ChatProvider } from './context/ChatContext';
import MainLayout from './layouts/MainLayout';
import ChatArea from './components/ChatArea';
import MessageInput from './components/MessageInput';

function App() {
  return (
    <ThemeProvider>
      <ChatProvider>
        <MainLayout>
          <ChatArea />
          <MessageInput />
        </MainLayout>
      </ChatProvider>
    </ThemeProvider>
  );
}

export default App;
