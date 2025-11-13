import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './SettingsModal.css';
import { FaTimes } from 'react-icons/fa';

function LanguageModal({ isOpen, onClose, user, setLoggedInUser }) {
  const { t, i18n } = useTranslation();
  const [selectedLang, setSelectedLang] = useState(user.language || 'english');

  if (!isOpen) return null;

  const handleSave = async () => {
    try {
      await fetch('http://localhost:3001/update-language', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, language: selectedLang }),
      });
      const langCode = selectedLang === 'hindi' ? 'hi' : 'en';
      i18n.changeLanguage(langCode);
      setLoggedInUser({ ...user, language: selectedLang });
      onClose();
    } catch (error) {
      console.error("Failed to save language:", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{t('select_language')}</h2>
          <button onClick={onClose} className="close-button"><FaTimes /></button>
        </div>
        <div className="modal-body">
          <div className="setting-item">
            <select className="settings-select" value={selectedLang} onChange={(e) => setSelectedLang(e.target.value)}>
              <option value="english">English</option>
              <option value="hinglish">Hinglish</option>
              <option value="hindi">Hindi</option>
            </select>
          </div>
        </div>
        <div className="modal-footer">
          <button onClick={handleSave} className="settings-button">{t('save_changes')}</button>
        </div>
      </div>
    </div>
  );
}

export default LanguageModal;