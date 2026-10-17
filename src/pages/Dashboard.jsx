import { useState, useEffect } from 'react';
import '../components/css/Dashboard.css';

const Dashboard = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/chat');
      const data = await response.json();
      if (data.success) {
        setChats(data.chats);
        if (data.chats.length > 0) {
          setSelectedChat(data.chats[0]);
        }
      } else {
        setError('Failed to fetch chats from server.');
      }
    } catch (err) {
      setError('Could not connect to the backend server. Make sure it is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChat = async (chat) => {
    setSelectedChat(chat);
    
    // Auto mark as read if there are unread messages
    const hasUnread = chat.messages.some(m => !m.read_status && m.sender === 'user');
    if (hasUnread) {
      try {
        await fetch(`http://localhost:5000/api/chat/${chat.id}/read`, { method: 'PUT' });
        // Update local state
        setChats(chats.map(c => c.id === chat.id 
          ? { ...c, messages: c.messages.map(m => ({ ...m, read_status: true })) }
          : c
        ));
      } catch (e) {
        console.error("Failed to mark read", e);
      }
    }
  };

  const handleDeleteChat = async (chatId, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this conversation?')) return;
    
    try {
      await fetch(`http://localhost:5000/api/chat/${chatId}`, { method: 'DELETE' });
      const newChats = chats.filter(c => c.id !== chatId);
      setChats(newChats);
      if (selectedChat?.id === chatId) {
        setSelectedChat(newChats.length > 0 ? newChats[0] : null);
      }
    } catch (e) {
      alert("Failed to delete chat");
    }
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim() || !selectedChat) return;
    setSendingReply(true);

    try {
      const res = await fetch(`http://localhost:5000/api/chat/${selectedChat.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: replyMessage, 
          visitorEmail: selectedChat.visitor_email 
        })
      });

      if (res.ok) {
        // Optimistically add to UI
        const newMsg = {
          id: Date.now(),
          sender: 'model',
          message: replyMessage,
          created_at: new Date().toISOString()
        };
        const updatedChat = { ...selectedChat, messages: [...selectedChat.messages, newMsg] };
        setSelectedChat(updatedChat);
        setChats(chats.map(c => c.id === selectedChat.id ? updatedChat : c));
        setReplyMessage('');
      } else {
        alert("Failed to send reply");
      }
    } catch (e) {
      console.error(e);
      alert("Error sending reply");
    } finally {
      setSendingReply(false);
    }
  };

  const filteredChats = chats.filter(c => 
    c.visitor_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.visitor_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unreadCount = chats.reduce((count, chat) => {
    return count + (chat.messages?.some(m => !m.read_status && m.sender === 'user') ? 1 : 0);
  }, 0);

  if (loading) return <div className="dashboard-loading">Loading Dashboard...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Total Chats</h3>
            <p>{chats.length}</p>
          </div>
          <div className="stat-card">
            <h3>Unread</h3>
            <p className={unreadCount > 0 ? 'unread-alert' : ''}>{unreadCount}</p>
          </div>
        </div>
      </div>

      {error ? (
        <div className="dashboard-error">{error}</div>
      ) : (
        <div className="dashboard-layout">
          {/* Left Panel: Chat List */}
          <div className="chat-list-panel">
            <div className="chat-list-header">
              <h2>Recent Conversations</h2>
              <input 
                type="text" 
                placeholder="Search name or email..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="chat-list">
              {filteredChats.map(chat => {
                const isUnread = chat.messages?.some(m => !m.read_status && m.sender === 'user');
                return (
                  <div 
                    key={chat.id} 
                    className={`chat-list-item ${selectedChat?.id === chat.id ? 'active' : ''} ${isUnread ? 'unread' : ''}`}
                    onClick={() => handleSelectChat(chat)}
                  >
                    <div className="chat-item-header">
                      <h4>{chat.visitor_name} {isUnread && <span className="unread-dot"></span>}</h4>
                      <div className="chat-actions">
                        <span className="chat-time">
                          {new Date(chat.created_at).toLocaleDateString()}
                        </span>
                        <button className="delete-chat-btn" onClick={(e) => handleDeleteChat(chat.id, e)}>🗑️</button>
                      </div>
                    </div>
                    <p className="chat-email">{chat.visitor_email}</p>
                    <p className="chat-preview">
                      {chat.messages && chat.messages.length > 0 
                        ? chat.messages[chat.messages.length - 1].message.substring(0, 30) + '...'
                        : 'No messages yet'}
                    </p>
                  </div>
                );
              })}
              {filteredChats.length === 0 && <p className="no-chats">No conversations found.</p>}
            </div>
          </div>

          {/* Right Panel: Chat Thread */}
          <div className="chat-thread-panel">
            {selectedChat ? (
              <>
                <div className="thread-header">
                  <h2>{selectedChat.visitor_name}</h2>
                  <p>{selectedChat.visitor_email}</p>
                  <span className="session-id">Session: {selectedChat.session_id}</span>
                </div>
                <div className="thread-messages">
                  {selectedChat.messages && selectedChat.messages.map(msg => (
                    <div key={msg.id} className={`thread-message ${msg.sender}`}>
                      <div className="msg-bubble">
                        {msg.message}
                      </div>
                      <span className="msg-time">
                        {new Date(msg.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                  {(!selectedChat.messages || selectedChat.messages.length === 0) && (
                    <p className="no-messages">No messages recorded in this session.</p>
                  )}
                </div>
                
                <div className="reply-container">
                  <textarea 
                    placeholder="Type a manual reply to send to their email..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    rows="3"
                  />
                  <button onClick={handleSendReply} disabled={sendingReply || !replyMessage.trim()}>
                    {sendingReply ? 'Sending...' : 'Send Reply'}
                  </button>
                </div>
              </>
            ) : (
              <div className="no-chat-selected">
                <p>Select a conversation to view the full thread</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
