import React from 'react';
import { useLanguage } from '../LanguageContext';
import './About.css';

const About = () => {
  const { t } = useLanguage();

  return (
    <section className="section about-section">
      <div className="container">
        <div className="about-grid">
          <div className="about-image-wrapper fade-in">
            <div className="polaroid-frame">
              <div className="binder-clip">
                <svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="wireGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#E2E2E2" />
                      <stop offset="40%" stopColor="#FFFFFF" />
                      <stop offset="50%" stopColor="#999999" />
                      <stop offset="60%" stopColor="#FFFFFF" />
                      <stop offset="100%" stopColor="#A1A1A1" />
                    </linearGradient>
                    <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#D5D5D5" />
                      <stop offset="20%" stopColor="#FFFFFF" />
                      <stop offset="50%" stopColor="#888888" />
                      <stop offset="80%" stopColor="#EEEEEE" />
                      <stop offset="100%" stopColor="#555555" />
                    </linearGradient>
                    <filter id="clipShadow">
                      <feDropShadow dx="0" dy="6" stdDeviation="4" floodOpacity="0.4" />
                    </filter>
                  </defs>

                  <g filter="url(#clipShadow)">
                    <path d="M 28 65 L 28 95 C 28 98 30 100 33 100 L 67 100 C 70 100 72 98 72 95 L 72 65" stroke="url(#wireGrad)" strokeWidth="4.5" strokeLinecap="round"/>
                    
                    <path d="M 43 65 L 43 35 C 43 20 57 20 57 35 L 57 65" stroke="url(#wireGrad)" strokeWidth="4" />
                    
                    <circle cx="43" cy="25" r="11" stroke="url(#wireGrad)" strokeWidth="3.5" />
                    <circle cx="57" cy="25" r="11" stroke="url(#wireGrad)" strokeWidth="3.5" />
                    
                    <rect x="23" y="65" width="54" height="14" rx="2" fill="url(#bodyGrad)" stroke="#777" strokeWidth="0.5" />
                    <line x1="25" y1="70" x2="75" y2="70" stroke="#666" strokeWidth="2" />
                    <line x1="25" y1="74" x2="75" y2="74" stroke="#666" strokeWidth="1.5" />
                  </g>
                </svg>
              </div>
              <div className="polaroid-image-container">
                <img src="/IMG_6802.jpg" alt="Viktoria - Specialist" className="about-image" loading="lazy" />
              </div>
              <div className="polaroid-text">
                bodyjewel.tatt
              </div>
            </div>
          </div>
          <div className="about-content fade-in delay-1">
            <h2 className="about-title" dangerouslySetInnerHTML={{ __html: t('about', 'title') }}></h2>
            <div className="about-body text-sans">
              <p>{t('about', 'body1')}</p>
              <p dangerouslySetInnerHTML={{ __html: t('about', 'body2') }}></p>
              <p>{t('about', 'body3')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
