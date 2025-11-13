import React, { useState, useEffect, useCallback, useRef } from 'react';
import './UserPage.css';
import { FaGlobe, FaCog, FaCommentDots, FaSignOutAlt, FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import SettingsModal from './SettingsModal';
import ChatWindow from './ChatWindow';
import LanguageModal from './LanguageModal';

function UserPage({ user, setLoggedInUser }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatFullscreen, setIsChatFullscreen] = useState(false);
  
  const [messages, setMessages] = useState([]);
  const [isVoiceModeOn, setIsVoiceModeOn] = useState(false);
  const [conversationState, setConversationState] = useState('idle');
  const [transcript, setTranscript] = useState('');
  
  const recognitionRef = useRef(null);
  const isMounted = useRef(true);

  const handleSend = useCallback(async (promptToSend) => {
    if (!promptToSend.trim()) {
      if (isVoiceModeOn) setConversationState('listening');
      return;
    }
    
    setConversationState('thinking');
    const userMessage = { role: 'user', content: promptToSend };
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await fetch('http://localhost:3001/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage], user: user }),
      });
      const aiResponse = await response.json();
      if (isMounted.current) {
        setMessages(prev => [...prev, aiResponse]);
      }
    } catch (error) {
      console.error("Error fetching AI response:", error);
      if (isMounted.current) {
        setMessages(prev => [...prev, { role: 'ai', content: 'Sorry, an error occurred.' }]);
        if (isVoiceModeOn) setConversationState('listening');
      }
    }
  }, [messages, user, isVoiceModeOn]);

  // This effect runs only ONCE to create the speech recognition instance
  useEffect(() => {
    isMounted.current = true;
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognitionRef.current = recognition;
    } else {
      console.error("Browser doesn't support the Web Speech API.");
    }
    return () => { isMounted.current = false; };
  }, []);

  // This effect attaches and detaches event listeners
  useEffect(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    const handleResult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        finalTranscript += event.results[i][0].transcript;
      }
      setTranscript(finalTranscript);
      if (event.results[0].isFinal) {
        handleSend(finalTranscript);
      }
    };
    
    const handleError = (event) => {
      console.error('Speech recognition error:', event.error);
      if (isVoiceModeOn) setConversationState('listening');
    };
    
    const handleEnd = () => {
      if (isVoiceModeOn && conversationState === 'listening') {
        recognition.start();
      }
    };

    recognition.addEventListener('result', handleResult);
    recognition.addEventListener('error', handleError);
    recognition.addEventListener('end', handleEnd);

    return () => {
      recognition.removeEventListener('result', handleResult);
      recognition.removeEventListener('error', handleError);
      recognition.removeEventListener('end', handleEnd);
    };
  }, [isVoiceModeOn, conversationState, handleSend]);

  // This effect is the state machine that starts/stops the loop
  useEffect(() => {
    if (isVoiceModeOn && conversationState === 'listening') {
      recognitionRef.current.start();
    } else {
      recognitionRef.current.stop();
    }
  }, [isVoiceModeOn, conversationState]);

  const toggleVoiceMode = () => {
    setIsVoiceModeOn(prevState => !prevState);
    if (!isVoiceModeOn) {
      setConversationState('listening');
    } else {
      setConversationState('idle');
    }
  };

  const handleLogout = () => { setLoggedInUser(null); navigate('/'); };
  const toggleChatFullscreen = () => setIsChatFullscreen(!isChatFullscreen);
  const renderVisualizerContent = () => {
    if (isChatOpen && !isVoiceModeOn) return <FaMicrophoneSlash className="mic-icon" />;
    if (conversationState === 'listening') return (<><div className="orb orb-1"></div><div className="orb orb-2"></div><div className="orb orb-3"></div><p>{transcript || "Listening..."}</p></>);
    if (conversationState === 'thinking') return (<><div className="thinking-box box-1"></div><div className="thinking-box box-2"></div><p>Thinking...</p></>);
    if (conversationState === 'speaking') return (<div className="speaking-bars"><div className="bar"></div><div className="bar"></div><div className="bar"></div><div className="bar"></div><div className="bar"></div></div>);
    return <FaMicrophoneSlash className="mic-icon-center" />;
  };


  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="sidebar-logo"><h3>{t('lala_ai')}</h3></div>
        <ul className="sidebar-menu">
          <li onClick={toggleVoiceMode} className={isVoiceModeOn ? 'active' : ''}>
            {isVoiceModeOn ? <FaMicrophone /> : <FaMicrophoneSlash />} <span>Voice Mode</span>
          </li>
          <li onClick={() => setIsLangModalOpen(true)}><FaGlobe /> <span>{t('language')}</span></li>
          <li onClick={() => setIsSettingsOpen(true)}><FaCog /> <span>{t('settings')}</span></li>
        </ul>
        <div className="sidebar-logout" onClick={handleLogout}><FaSignOutAlt /> <span>{t('logout')}</span></div>
      </div>
      
      <div className={`main-content ${isChatOpen ? 'chat-active' : ''}`}>
        <div className="welcome-message"><p>{t('welcome')}<strong>{user.username}</strong></p></div>
        <div className={`voice-visualizer ${isVoiceModeOn ? 'listening-active' : ''}`}>
          {renderVisualizerContent()}
        </div>
      </div>
      
      <div className={`chat-button ${isChatOpen ? 'hidden' : ''}`} onClick={() => { setIsChatOpen(true); }}><FaCommentDots size={24} /></div>
      
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <LanguageModal isOpen={isLangModalOpen} onClose={() => setIsLangModalOpen(false)} user={user} setLoggedInUser={setLoggedInUser} />
      
      <ChatWindow 
        isOpen={isChatOpen} 
        onClose={() => { setIsChatOpen(false); setIsChatFullscreen(false); }}
        isFullscreen={isChatFullscreen}
        onToggleFullscreen={toggleChatFullscreen}
        user={user}
        messages={messages}
        handleSend={handleSend}
        isLoading={conversationState === 'thinking'}
        setIsSpeaking={(speaking) => setConversationState(speaking ? 'speaking' : 'listening')}
        setMessages={setMessages}
      />
    </div>
  );
}

export default UserPage;