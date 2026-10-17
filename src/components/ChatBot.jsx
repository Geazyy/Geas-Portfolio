import { useState } from 'react';
import ChatWindow from './ChatWindow';
import './css/ChatBot.css';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button 
        className="chatbot-trigger" 
        onClick={toggleChat}
        aria-label="Toggle Gea AI Assistant"
      >
        🤖
      </button>
      <ChatWindow isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default ChatBot;
