import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import './Admin.css';
import { translations as defaultTranslations } from '../../translations';
import TextEditor from './TextEditor';

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

const AdminDashboard = ({ session, onLogout }) => {
  const [activeTab, setActiveTab] = useState('messages');
  const [messages, setMessages] = useState([]);
  const [loadingMsgs, setLoadingMsgs] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [needsSeed, setNeedsSeed] = useState(false);

  const [portfolio, setPortfolio] = useState([]);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('works');
  
  // New gallery state
  const [newGalleryName, setNewGalleryName] = useState('');

  const [heroSettings, setHeroSettings] = useState({ logoText: '', desktopImage: '', mobileImage: '' });
  const [loadingHeroUpload, setLoadingHeroUpload] = useState(false);

  useEffect(() => {
    checkContent();
    fetchMessages();
    fetchPortfolio();
    fetchHeroSettings();
  }, []);

  const deleteFromStorage = async (url) => {
    // Only attempt to delete if it's a Supabase storage URL
    if (!url || !url.includes('supabase.co/storage/v1/object/public/portfolio/')) return;
    try {
      // Decode URI component to handle spaces/special chars just in case
      const fileName = decodeURIComponent(url.split('/').pop());
      if (fileName) {
        await supabase.storage.from('portfolio').remove([fileName]);
      }
    } catch (e) {
      console.error('Error deleting old image from storage', e);
    }
  };

  const fetchHeroSettings = async () => {
    const { data } = await supabase.from('site_content').select('data').eq('id', 'hero_settings').single();
    if (data) {
      setHeroSettings(data.data);
    } else {
      const defaultHero = {
        logoText: 'VIKTORIA • TATTOO PHUKET',
        desktopImage: '/hero-upscaled.jpg',
        mobileImage: '/hero-upscaled.jpg'
      };
      await supabase.from('site_content').upsert({ id: 'hero_settings', data: defaultHero });
      setHeroSettings(defaultHero);
    }
  };

  const handleHeroUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoadingHeroUpload(true);
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const safeName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
      
      const { error } = await supabase.storage.from('portfolio').upload(safeName, file);
      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage.from('portfolio').getPublicUrl(safeName);
      
      if (heroSettings[type]) {
        await deleteFromStorage(heroSettings[type]);
      }
      
      const updatedSettings = { ...heroSettings, [type]: publicUrl };
      const { error: updateError } = await supabase.from('site_content').update({ data: updatedSettings }).eq('id', 'hero_settings');
      if (updateError) throw updateError;
      
      setHeroSettings(updatedSettings);
      alert('Обложка успешно обновлена!');
    } catch (error) {
      console.error(error);
      alert('Ошибка загрузки обложки. Попробуйте еще раз.');
    } finally {
      setLoadingHeroUpload(false);
      e.target.value = null;
    }
  };

  const handleDeleteHeroImage = async (type) => {
    if (!window.confirm('Вы уверены, что хотите удалить это изображение обложки?')) return;
    
    setLoadingHeroUpload(true);
    try {
      if (heroSettings[type]) {
        await deleteFromStorage(heroSettings[type]);
      }
      
      const updatedSettings = { ...heroSettings, [type]: '' };
      const { error } = await supabase.from('site_content').update({ data: updatedSettings }).eq('id', 'hero_settings');
      if (error) throw error;
      
      setHeroSettings(updatedSettings);
    } catch (error) {
      console.error(error);
      alert('Ошибка при удалении изображения.');
    } finally {
      setLoadingHeroUpload(false);
    }
  };

  const handleSaveHeroText = async () => {
    const { error } = await supabase.from('site_content').update({ data: heroSettings }).eq('id', 'hero_settings');
    if (error) {
      alert('Ошибка при сохранении текста обложки.');
    } else {
      alert('Текст обложки сохранен!');
    }
  };

  const fetchPortfolio = async () => {
    const { data } = await supabase.from('site_content').select('data').eq('id', 'portfolio').single();
    if (data) {
      setPortfolio(data.data);
      if (data.data.length > 0) setSelectedCategory(data.data[0].id);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoadingUpload(true);
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const safeName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
      
      const { data, error } = await supabase.storage.from('portfolio').upload(safeName, file);
      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage.from('portfolio').getPublicUrl(safeName);
      
      const updatedPortfolio = portfolio.map(cat => {
        if (cat.id === selectedCategory) {
          const newImage = cat.gallery.length === 0 ? publicUrl : cat.image;
          return { ...cat, image: newImage, gallery: [...cat.gallery, publicUrl] };
        }
        return cat;
      });
      
      const { error: updateError } = await supabase.from('site_content').update({ data: updatedPortfolio }).eq('id', 'portfolio');
      if (updateError) throw updateError;
      
      setPortfolio(updatedPortfolio);
      alert('Фото успешно добавлено!');
    } catch (error) {
      console.error(error);
      alert('Ошибка загрузки фото. Попробуйте еще раз.');
    } finally {
      setLoadingUpload(false);
      e.target.value = null;
    }
  };

  const handleDeletePhoto = async (catId, photoUrl) => {
    if (!window.confirm('Вы уверены, что хотите удалить это фото из галереи? Оно будет удалено с сервера.')) return;
    
    try {
      await deleteFromStorage(photoUrl);
      
      const updatedPortfolio = portfolio.map(cat => {
        if (cat.id === catId) {
          return { ...cat, gallery: cat.gallery.filter(img => img !== photoUrl) };
        }
        return cat;
      });

      const { error } = await supabase.from('site_content').update({ data: updatedPortfolio }).eq('id', 'portfolio');
      if (error) throw error;
      
      setPortfolio(updatedPortfolio);
    } catch (error) {
      console.error(error);
      alert('Ошибка при удалении фото с сервера.');
    }
  };

  const handleCreateGallery = async () => {
    if (!newGalleryName.trim()) return;
    
    const newId = newGalleryName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newCat = {
      id: newId,
      titleKey: newGalleryName,
      subtitleKey: '',
      image: '',
      gallery: []
    };
    
    const updatedPortfolio = [...portfolio, newCat];
    
    const { error } = await supabase.from('site_content').update({ data: updatedPortfolio }).eq('id', 'portfolio');
    if (error) {
      alert('Ошибка при создании галереи.');
    } else {
      setPortfolio(updatedPortfolio);
      setNewGalleryName('');
      setSelectedCategory(newId);
      alert('Галерея создана! Теперь добавьте в нее фото.');
    }
  };

  const checkContent = async () => {
    const { data } = await supabase.from('site_content').select('id').eq('id', 'translations').single();
    if (!data) setNeedsSeed(true);
  };

  const handleSeed = async () => {
    setSeeding(true);
    await supabase.from('site_content').upsert({ id: 'translations', data: defaultTranslations });
    await supabase.from('site_content').upsert({ id: 'portfolio', data: fallbackCategories });
    const defaultHero = {
      logoText: 'VIKTORIA • TATTOO PHUKET',
      desktopImage: '/hero-upscaled.jpg',
      mobileImage: '/hero-upscaled.jpg'
    };
    await supabase.from('site_content').upsert({ id: 'hero_settings', data: defaultHero });
    setNeedsSeed(false);
    setSeeding(false);
    alert('База данных успешно инициализирована!');
    window.location.reload();
  };

  const fetchMessages = async () => {
    const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
    if (data) setMessages(data);
    setLoadingMsgs(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  return (
    <div className="admin-dashboard-container">
      <header className="admin-header">
        <h2>Панель управления</h2>
        <button onClick={handleLogout} className="btn btn-outline">Выйти</button>
      </header>

      {needsSeed && (
        <div style={{ background: '#ffeb3b', padding: '1rem', textAlign: 'center', color: '#000' }}>
          <p>Сайт должен быть инициализирован с базовыми текстами.</p>
          <button onClick={handleSeed} disabled={seeding} className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
            {seeding ? 'Загрузка...' : 'Инициализировать базу данных'}
          </button>
        </div>
      )}

      <div className="admin-tabs">
        <button className={activeTab === 'messages' ? 'active' : ''} onClick={() => setActiveTab('messages')}>Сообщения</button>
        <button className={activeTab === 'hero' ? 'active' : ''} onClick={() => setActiveTab('hero')}>Обложка сайта</button>
        <button className={activeTab === 'texts' ? 'active' : ''} onClick={() => setActiveTab('texts')}>Тексты сайта</button>
        <button className={activeTab === 'portfolio' ? 'active' : ''} onClick={() => setActiveTab('portfolio')}>Портфолио</button>
      </div>

      <div className="admin-content">
        {activeTab === 'messages' && (
          <div>
            <h3>Полученные сообщения</h3>
            {loadingMsgs ? <p>Загрузка...</p> : messages.length === 0 ? <p>Нет сообщений.</p> : (
              <div className="messages-grid">
                {messages.map(msg => (
                  <div key={msg.id} className="message-card">
                    <p><strong>Имя:</strong> {msg.name}</p>
                    <p><strong>Дата:</strong> {new Date(msg.created_at).toLocaleString('ru-RU')}</p>
                    <p className="message-story"><strong>Идея:</strong> {msg.story}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'hero' && (
          <div>
            <h3>Управление обложкой сайта</h3>
            
            <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#fff', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
              <h4>Текст логотипа (Вверху)</h4>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <input 
                  type="text" 
                  value={heroSettings.logoText}
                  onChange={(e) => setHeroSettings({...heroSettings, logoText: e.target.value})}
                  style={{ padding: '0.5rem', fontSize: '1rem', flex: 1 }}
                />
                <button onClick={handleSaveHeroText} className="btn btn-primary">Сохранить текст</button>
              </div>
            </div>

            <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#fff', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
              <h4>Фоновое изображение - Компьютер</h4>
              <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>Рекомендуется: Горизонтальное изображение (пейзаж).</p>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                {heroSettings.desktopImage && (
                  <div style={{ position: 'relative' }}>
                    <img src={heroSettings.desktopImage} alt="Desktop" style={{ width: '150px', height: '100px', objectFit: 'cover', borderRadius: '4px' }} />
                    <button 
                      onClick={() => handleDeleteHeroImage('desktopImage')}
                      style={{ position: 'absolute', top: -10, right: -10, background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer' }}
                    >
                      &times;
                    </button>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={(e) => handleHeroUpload(e, 'desktopImage')} disabled={loadingHeroUpload} />
                {loadingHeroUpload && <span>Обработка...</span>}
              </div>
            </div>

            <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#fff', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
              <h4>Фоновое изображение - Телефон</h4>
              <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>Рекомендуется: Вертикальное изображение (формат Stories, 9:16).</p>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                {heroSettings.mobileImage && (
                  <div style={{ position: 'relative' }}>
                    <img src={heroSettings.mobileImage} alt="Mobile" style={{ width: '100px', height: '150px', objectFit: 'cover', borderRadius: '4px' }} />
                    <button 
                      onClick={() => handleDeleteHeroImage('mobileImage')}
                      style={{ position: 'absolute', top: -10, right: -10, background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer' }}
                    >
                      &times;
                    </button>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={(e) => handleHeroUpload(e, 'mobileImage')} disabled={loadingHeroUpload} />
                {loadingHeroUpload && <span>Обработка...</span>}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'texts' && (
          <TextEditor />
        )}

        {activeTab === 'portfolio' && (
          <div>
            <h3>Управление портфолио</h3>
            
            <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#fff', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
              <h4>Создать новую галерею</h4>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <input 
                  type="text" 
                  placeholder="Название категории (Например: Fine Line)" 
                  value={newGalleryName}
                  onChange={(e) => setNewGalleryName(e.target.value)}
                  style={{ padding: '0.5rem', fontSize: '1rem', flex: 1 }}
                />
                <button onClick={handleCreateGallery} className="btn btn-primary">Создать галерею</button>
              </div>
            </div>

            <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#fff', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
              <h4>Добавить фото в существующую галерею</h4>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1rem', flexWrap: 'wrap' }}>
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{ padding: '0.5rem', fontSize: '1rem' }}
                >
                  {portfolio.map(cat => (
                    <option key={cat.id} value={cat.id}>Галерея: {cat.titleKey || cat.id}</option>
                  ))}
                </select>
                <input type="file" accept="image/*" onChange={handleUpload} disabled={loadingUpload} />
                {loadingUpload && <span>Загрузка...</span>}
              </div>
            </div>

            {portfolio.map(cat => (
              <div key={cat.id} style={{ marginBottom: '3rem' }}>
                <h4 style={{ textTransform: 'capitalize', marginBottom: '1rem' }}>Галерея: {cat.titleKey || cat.id}</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {cat.gallery.length === 0 && <p style={{ fontSize: '0.9rem', color: '#666' }}>В этой галерее пока нет фото.</p>}
                  {cat.gallery.map((img, idx) => (
                    <div key={idx} style={{ position: 'relative', width: '150px', height: '150px' }}>
                      <img src={img} alt="Galeria" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
                      <button 
                        onClick={() => handleDeletePhoto(cat.id, img)}
                        style={{ position: 'absolute', top: 5, right: 5, background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer' }}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
