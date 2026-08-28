import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import './Portfolio.css';
import { supabase } from '../supabase';

const fallbackCategories = [
  {
    id: 'works',
    titleKey: 'works_title',
    subtitleKey: 'works_sub',
    image: '/works-cover-2.png',
    gallery: [
      '/works/work-1.jpg', '/works/work-2.jpg', '/works/work-3.jpg', '/works/work-4.jpg', '/works/work-5.png',
      '/works/work-6.jpg', '/works/work-7.jpg', '/works/work-8.jpg', '/works/work-9.png', '/works/work-10.jpg',
      '/works/work-11.jpg', '/works/work-12.png'
    ]
  },
  {
    id: 'available',
    titleKey: 'avail_title',
    subtitleKey: 'avail_sub',
    image: '/IMG_4115.JPEG',
    gallery: [
      '/IMG_4115.JPEG', '/available/avail-1.jpg', '/available/avail-2.jpg', '/available/avail-3.jpg',
      '/available/avail-4.jpg', '/available/avail-5.jpg', '/available/avail-6.jpg', '/available/avail-7.jpg',
      '/available/avail-8.jpg', '/available/avail-9.jpg', '/available/avail-10.jpg'
    ]
  }
];

const Portfolio = () => {
  const { t } = useLanguage();
  const [activeGallery, setActiveGallery] = useState(null);
  const [categories, setCategories] = useState(fallbackCategories);

  useEffect(() => {
    const fetchPortfolio = async () => {
      const { data } = await supabase
        .from('site_content')
        .select('data')
        .eq('id', 'portfolio')
        .single();
      
      if (data && data.data) {
        setCategories(data.data);
      }
    };
    fetchPortfolio();
  }, []);

  return (
    <section className="section portfolio-section">
      <div className="container">
        <h2 className="portfolio-heading text-serif text-center fade-in">{t('portfolio', 'title')}</h2>
        <div className="portfolio-grid">
          {categories.map((cat, index) => (
            <div 
              key={cat.id} 
              className={`portfolio-item fade-in delay-${index % 3 + 1}`}
              onClick={() => cat.gallery && setActiveGallery(cat.gallery)}
            >
              <div className="portfolio-image-wrapper">
                <img src={cat.image} alt={t('portfolio', cat.titleKey)} className="portfolio-image" loading="lazy" />
              </div>
              <div className="portfolio-info">
                <h3 className="portfolio-title text-serif">{t('portfolio', cat.titleKey)}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeGallery && (
        <div className="gallery-modal" onClick={() => setActiveGallery(null)}>
          <button className="gallery-modal-close" onClick={() => setActiveGallery(null)}>&times;</button>
          <div className="gallery-modal-content" onClick={(e) => e.stopPropagation()}>
            {activeGallery.map((imgSrc, idx) => (
              <img key={idx} src={imgSrc} alt={`Gallery image ${idx + 1}`} className="gallery-modal-img" loading="lazy" />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default Portfolio;
