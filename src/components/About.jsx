import React, { useEffect, useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { supabase } from '../supabase';
import './About.css';

const About = () => {
  const { t } = useLanguage();
  const [aboutImage, setAboutImage] = useState('/IMG_6802.jpg');

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const { data } = await supabase.from('site_content').select('data').eq('id', 'hero_settings').single();
        if (data && data.data && data.data.aboutImage) {
          setAboutImage(data.data.aboutImage);
        }
      } catch (e) {
        console.error('Error fetching about image:', e);
      }
    };
    fetchImage();
  }, []);

  return (
    <section className="section about-section">
      <div className="container">
        <div className="about-grid">
          <div className="about-image-wrapper fade-in">
            <div className="polaroid-frame">
              <div className="polaroid-image-container">
                <img src={aboutImage} alt="Viktoria - Specialist" className="about-image" loading="lazy" />
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
