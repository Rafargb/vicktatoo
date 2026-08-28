import React, { createContext, useState, useContext, useEffect } from 'react';
import { translations as fallbackTranslations } from './translations';
import { supabase } from './supabase';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [translations, setTranslations] = useState(fallbackTranslations);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from('site_content')
          .select('data')
          .eq('id', 'translations')
          .single();
        
        if (data && data.data) {
          setTranslations(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch translations, using fallback.');
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const toggleLanguage = (lang) => {
    setLanguage(lang);
  };

  const t = (section, key) => {
    if (!translations[language] || !translations[language][section]) return key;
    return translations[language][section][key] || key;
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#faf9f7' }}>Carregando...</div>;
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t, translations, setTranslations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
