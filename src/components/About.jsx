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
                  <g filter="drop-shadow(0px 5px 4px rgba(0,0,0,0.3))">
                    <path d="M42 20 L42 60" stroke="#D1D5DB" strokeWidth="4" strokeLinecap="round"/>
                    <path d="M32 35 C32 15, 42 15, 42 20" stroke="#D1D5DB" strokeWidth="4" strokeLinecap="round"/>
                    <path d="M32 35 L32 60" stroke="#D1D5DB" strokeWidth="4" strokeLinecap="round"/>

                    <path d="M58 20 L58 60" stroke="#D1D5DB" strokeWidth="4" strokeLinecap="round"/>
                    <path d="M68 35 C68 15, 58 15, 58 20" stroke="#D1D5DB" strokeWidth="4" strokeLinecap="round"/>
                    <path d="M68 35 L68 60" stroke="#D1D5DB" strokeWidth="4" strokeLinecap="round"/>

                    <rect x="20" y="60" width="60" height="16" rx="4" fill="none" stroke="#D1D5DB" strokeWidth="4"/>
                    <line x1="20" y1="64" x2="80" y2="64" stroke="#D1D5DB" strokeWidth="4" />
                    <line x1="20" y1="72" x2="80" y2="72" stroke="#D1D5DB" strokeWidth="4" />
                    
                    <rect x="20" y="60" width="60" height="16" rx="4" fill="none" stroke="#FFFFFF" strokeWidth="1" opacity="0.6"/>
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
