import React from 'react';
import { useLanguage } from '../LanguageContext';
import './Hero.css';

const HeroInfo = () => {
  const { t } = useLanguage();

  const scrollToForm = () => {
    const formElement = document.getElementById('booking-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-text-section">
      <div className="container hero-info-container">
        <div className="hero-info-text">
          <p className="hero-tagline text-sans fade-in delay-1">{t('hero', 'tagline')}</p>
          <p className="hero-subtitle text-serif fade-in delay-2">
            {t('hero', 'subtitle')}
          </p>
          <div className="hero-cta fade-in delay-3">
            <button onClick={scrollToForm} className="btn btn-primary">{t('hero', 'cta')}</button>
          </div>
        </div>
        <div className="hero-info-image fade-in delay-2">
          <img src="/hero-back.jpg" alt="Viktoria Tattoo" loading="lazy" />
        </div>
      </div>
    </section>
  );
};

export default HeroInfo;
