import { useState, useEffect, useRef } from 'react';

const QUICK_ACTIONS = [
  "About Me",
  "Skills",
  "Projects",
  "Certificates",
  "Hire Me",
  "Contact"
];

const ChatWindow = ({ isOpen, onClose }) => {
  const [visitorDetails, setVisitorDetails] = useState({ name: '', email: '' });
  const [hasDetails, setHasDetails] = useState(false);
  const [sessionId, setSessionId] = useState('');

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'model',
      text: "Hello! I’m Gea AI Assistant. Ask me about Geaser Jan Gadingan, his skills, projects, certificates, or hiring availability."
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, hasDetails]);

  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    if (visitorDetails.name && visitorDetails.email) {
      setHasDetails(true);
      setSessionId(Date.now().toString());
    }
  };

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg = { id: Date.now(), sender: 'user', text };
    const currentHistory = [...messages, userMsg];
    setMessages(currentHistory);
    setInputValue('');
    setIsTyping(true);

    try {
      // Call Backend API
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          visitorName: visitorDetails.name,
          visitorEmail: visitorDetails.email,
          sessionId: sessionId,
          message: text,
          history: currentHistory.slice(0, -1) // Exclude the message we just added as it's passed separately
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Add bot message
        const botMsg = { id: Date.now() + 1, sender: 'model', text: data.reply };
        setMessages(prev => [...prev, botMsg]);
      } else {
        const errorMsg = { id: Date.now() + 1, sender: 'model', text: "Error connecting to server." };
        setMessages(prev => [...prev, errorMsg]);
      }
    } catch (error) {
      console.error("Chat API Error:", error);
      const botMsg = { id: Date.now() + 1, sender: 'model', text: "Sorry, I'm having trouble connecting to my server right now." };
      setMessages(prev => [...prev, botMsg]);
    }

    setIsTyping(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage(inputValue);
    }
  };

  const renderMessageText = (text) => {
    const isHiringDetected = /(hire|freelance|project|developer|job|work|internship|opportunity)/i.test(text);
    
    return (
      <>
        {text}
        {isHiringDetected && text.includes("Telegram or Email") && (
          <div className="bot-links">
            <a href="https://t.me/your_telegram_username" target="_blank" rel="noopener noreferrer" className="bot-link-btn">Telegram</a>
            <a href="mailto:geaser.gadingan@gmail.com" className="bot-link-btn">Email</a>
            <a href="/cv.pdf" target="_blank" rel="noopener noreferrer" className="bot-link-btn">Download CV</a>
          </div>
        )}
      </>
    );
  };

  if (!isOpen) return null;

  return (
    <div className={`chat-window ${isOpen ? 'open' : 'closed'}`}>
      <div className="chat-header">
        <h3>🤖 Gea AI Assistant</h3>
        <button onClick={onClose} className="close-btn">×</button>
      </div>

      {!hasDetails ? (
        <div className="visitor-details-form">
          <p>Please enter your details to start chatting:</p>
          <form onSubmit={handleDetailsSubmit}>
            <input 
              type="text" 
              placeholder="Your Name" 
              required 
              value={visitorDetails.name}
              onChange={(e) => setVisitorDetails({...visitorDetails, name: e.target.value})}
            />
            <input 
              type="email" 
              placeholder="Your Email" 
              required 
              value={visitorDetails.email}
              onChange={(e) => setVisitorDetails({...visitorDetails, email: e.target.value})}
            />
            <button type="submit" className="start-chat-btn">Start Chat</button>
          </form>
        </div>
      ) : (
        <>
          <div className="chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.sender}`}>
                {msg.sender === 'model' ? renderMessageText(msg.text) : msg.text}
              </div>
            ))}
            {isTyping && (
              <div className="typing-indicator">
                <span></span><span></span><span></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="quick-actions-container">
            {QUICK_ACTIONS.map(action => (
              <button 
                key={action} 
                className="quick-action-btn"
                onClick={() => handleSendMessage(action)}
                disabled={isTyping}
              >
                {action}
              </button>
            ))}
          </div>

          <div className="chat-input-area">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              disabled={isTyping}
            />
            <button 
              onClick={() => handleSendMessage(inputValue)} 
              className="send-btn"
              disabled={isTyping || !inputValue.trim()}
            >
              ➤
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatWindow;
