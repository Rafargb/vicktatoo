import React from 'react';
import { useLanguage } from '../LanguageContext';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="language-switcher fade-in">
      <button 
        className={`lang-btn ${language === 'en' ? 'active' : ''}`} 
        onClick={() => setLanguage('en')}
        title="English"
      >
        EN
      </button>
      <button 
        className={`lang-btn ${language === 'ru' ? 'active' : ''}`} 
        onClick={() => setLanguage('ru')}
        title="Русский"
      >
        RU
      </button>
      <button 
        className={`lang-btn ${language === 'th' ? 'active' : ''}`} 
        onClick={() => setLanguage('th')}
        title="ภาษาไทย"
      >
        TH
      </button>
    </div>
  );
};

export default LanguageSwitcher;
