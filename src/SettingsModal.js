import React, { useState } from 'react';
import './SettingsModal.css';
import { FaTimes } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

function SettingsModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  const [privacySetting, setPrivacySetting] = useState('save');

  if (!isOpen) return null;

  const handlePrivacyChange = (event) => {
    const selectedValue = event.target.value;
    if (selectedValue === 'delete') {
      const userConfirmed = window.confirm(
        "WARNING: This will make the AI know less about you and may give wrong outputs or unwanted results. Are you sure you want to proceed?"
      );
      if (userConfirmed) {
        setPrivacySetting(selectedValue);
      }
    } else {
      setPrivacySetting(selectedValue);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{t('settings_title')}</h2>
          <button onClick={onClose} className="close-button"><FaTimes /></button>
        </div>
        <div className="modal-body">
          <div className="setting-item">
            <label htmlFor="audio-select">{t('audio_input')}</label>
            <select id="audio-select" className="settings-select">
              <option>{t('default_device')}</option>
            </select>
          </div>
          <div className="setting-item">
            <label htmlFor="privacy-select">{t('privacy_prefs')}</label>
            <select id="privacy-select" className="settings-select" value={privacySetting} onChange={handlePrivacyChange}>
              <option value="save">{t('privacy_save')}</option>
              <option value="delete">{t('privacy_delete')}</option>
            </select>
          </div>
          <div className="setting-item">
            <label>{t('data_management')}</label>
            <button className="settings-button danger">{t('clear_history')}</button>
          </div>
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="settings-button">{t('save_changes')}</button>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;