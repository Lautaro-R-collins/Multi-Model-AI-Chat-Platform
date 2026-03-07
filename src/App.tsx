import './App.css';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './layouts/MainLayout';
import ChatArea from './components/ChatArea';
import MessageInput from './components/MessageInput';

function App() {
  return (
    <ThemeProvider>
      <MainLayout>
        <ChatArea />
        <MessageInput />
      </MainLayout>
    </ThemeProvider>
  );
}

export default App;
