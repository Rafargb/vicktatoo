import React from 'react';
import { useLanguage } from '../LanguageContext';
import './Manifesto.css';

const Manifesto = () => {
  const { t } = useLanguage();

  return (
    <section className="section manifesto-section">
      <div className="container">
        <div className="manifesto-grid">
          <div className="manifesto-header">
            <img src="/manifesto-bird.jpg" alt="Manifesto Bird" className="manifesto-image" loading="lazy" />
          </div>
          <div className="manifesto-content">
            <blockquote className="manifesto-quote text-serif">
              {t('manifesto', 'quote')}
            </blockquote>
            <div className="manifesto-body text-sans">
              <p>{t('manifesto', 'body1')}</p>
              <p>{t('manifesto', 'body2')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Manifesto;
