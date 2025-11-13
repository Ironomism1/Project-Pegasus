import React, { useState, useEffect, useRef } from 'react';
import './ChatWindow.css';
import { FaTimes, FaPaperPlane, FaExpand, FaCompress, FaPlus, FaThLarge } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';

function ChatWindow({ 
  isOpen, onClose, isFullscreen, onToggleFullscreen, user,
  messages, handleSend, isLoading, setIsSpeaking, setMessages
}) {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const audioRef = useRef(null);
  const chatBodyRef = useRef(null);

  // Corrected useEffect for loading chat history
  useEffect(() => {
    const fetchHistory = async () => {
      if (user?.id) {
        try {
          const response = await fetch(`http://localhost:3001/chat-history/${user.id}`);
          const history = await response.json();
          if (history.length > 0) {
            setMessages(history);
          } else {
            // Only set welcome message if there is no history
            setMessages([{ role: 'ai', content: `${t('welcome')} ${user.username}, What do you want to do with me today?` }]);
          }
        } catch (error) { console.error("Failed to fetch chat history:", error); }
      }
    };
    // Fetch history only when the chat window opens
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen, user?.id, setMessages, t, user?.username]);

  useEffect(() => {
    if (chatBodyRef.current) chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'ai' && lastMessage.audioUrl && audioRef.current) {
      if (audioRef.current.src !== lastMessage.audioUrl) {
        audioRef.current.src = lastMessage.audioUrl;
        audioRef.current.play().catch(error => {
          console.error("Audio playback error:", error);
          setIsSpeaking(false);
        });
      }
    }
  }, [messages, setIsSpeaking]);
  
  const onSendClick = () => {
    if (input.trim()) {
      handleSend(input);
      setInput('');
    }
  };
  
  const chatWindowClass = `chat-window ${isOpen ? 'open' : ''} ${isFullscreen ? 'fullscreen' : ''}`;

  return (
    <div className={chatWindowClass}>
      <div className="chat-header">
        <h3>{t('chat_title')}</h3>
        <div>
          <button onClick={onToggleFullscreen} className="chat-fullscreen-button">{isFullscreen ? <FaCompress size={18} /> : <FaExpand size={18} />}</button>
          <button onClick={onClose} className="chat-close-button"><FaTimes size={20} /></button>
        </div>
      </div>
      <div className="chat-body" ref={chatBodyRef}>
        {messages.map((msg, index) => (<div key={index} className={`message ${msg.role}`}><ReactMarkdown>{msg.content}</ReactMarkdown></div>))}
        {isLoading && (<div className="message ai typing"><span className="typing-dot"></span><span className="typing-dot"></span><span className="typing-dot"></span></div>)}
      </div>
      <div className="chat-input-area">
        <input type="text" placeholder="Type your message..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && onSendClick()} disabled={isLoading} />
        <div className="chat-input-buttons">
          <button className="input-action-button" disabled={isLoading}><FaPlus size={20} /></button>
          <button className="input-action-button send-button" onClick={onSendClick} disabled={isLoading}><FaPaperPlane size={20} /></button>
          <button className="input-action-button" disabled={isLoading}><FaThLarge size={20} /></button>
        </div>
      </div>
      <audio 
        ref={audioRef} 
        hidden 
        onPlay={() => setIsSpeaking(true)} 
        onEnded={() => setIsSpeaking(false)} 
        onPause={() => setIsSpeaking(false)}
      />
    </div>
  );
}

export default ChatWindow;