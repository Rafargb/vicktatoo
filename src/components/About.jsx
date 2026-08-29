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
              <div className="paperclip">
                <svg viewBox="0 0 40 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 78.5C21 82.0899 18.0899 85 14.5 85C10.9101 85 8 82.0899 8 78.5V28.5C8 22.1487 13.1487 17 19.5 17C25.8513 17 31 22.1487 31 28.5V70.5C31 74.6421 27.6421 78 23.5 78C19.3579 78 16 74.6421 16 70.5V32.5" stroke="#D1D5DB" strokeWidth="3" strokeLinecap="round"/>
                  <path d="M21 78.5C21 82.0899 18.0899 85 14.5 85C10.9101 85 8 82.0899 8 78.5V28.5C8 22.1487 13.1487 17 19.5 17C25.8513 17 31 22.1487 31 28.5V70.5C31 74.6421 27.6421 78 23.5 78C19.3579 78 16 74.6421 16 70.5V32.5" stroke="#9CA3AF" strokeWidth="1" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="polaroid-image-container">
                <img src="/IMG_6802.jpg" alt="Viktoria - Specialist" className="about-image" loading="lazy" />
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
