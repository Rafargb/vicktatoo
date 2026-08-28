import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import './Hero.css';

const Hero = () => {
  const [heroSettings, setHeroSettings] = useState({
    logoText: 'VIKTORIA • TATTOO PHUKET',
    desktopImage: '/hero-upscaled.jpg',
    mobileImage: '/hero-upscaled.jpg'
  });

  useEffect(() => {
    const fetchHeroSettings = async () => {
      const { data } = await supabase.from('site_content').select('data').eq('id', 'hero_settings').single();
      if (data && data.data) {
        setHeroSettings(data.data);
      }
    };
    fetchHeroSettings();
  }, []);

  return (
    <>
      <header 
        className="hero-section"
        style={{ 
          '--desktop-bg': `url(${heroSettings.desktopImage})`,
          '--mobile-bg': `url(${heroSettings.mobileImage})`
        }}
      >
        <div className="container hero-container">
          <nav className="hero-nav fade-in">
            <span className="logo text-sans">{heroSettings.logoText}</span>
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
