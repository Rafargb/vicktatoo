import React from 'react';
import { useLanguage } from '../LanguageContext';
import './Hero.css';

const Hero = () => {
  const { t } = useLanguage();

  const scrollToForm = () => {
    document.getElementById('booking-form').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <header className="hero-section">
        <div className="container hero-container">
          <nav className="hero-nav fade-in">
            <span className="logo text-sans">VIKTORIA • TATTOO PHUKET</span>
          </nav>
        </div>
        
        <div className="scroll-indicator fade-in delay-3">
          <svg className="mouse-icon" width="24" height="34" viewBox="0 0 24 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="22" height="32" rx="11" stroke="white" strokeWidth="2" />
            <circle className="mouse-wheel" cx="12" cy="10" r="2" fill="white" />
          </svg>
          <svg className="arrow-icon" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 5L7 11L13 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </header>
    </>
  );
};

export default Hero;
