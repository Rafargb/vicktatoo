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
      // Sanitize file name to avoid errors on mobile (accents, spaces, emojis)
      const ext = file.name.split('.').pop() || 'jpg';
      const safeName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
      
      const { error } = await supabase.storage.from('portfolio').upload(safeName, file);
      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage.from('portfolio').getPublicUrl(safeName);
      
      // Delete old image from storage if it was in Supabase
      if (heroSettings[type]) {
        await deleteFromStorage(heroSettings[type]);
      }
      
      const updatedSettings = { ...heroSettings, [type]: publicUrl };
      const { error: updateError } = await supabase.from('site_content').update({ data: updatedSettings }).eq('id', 'hero_settings');
      if (updateError) throw updateError;
      
      setHeroSettings(updatedSettings);
      alert('Capa atualizada com sucesso!');
    } catch (error) {
      console.error(error);
      alert('Erro ao fazer upload da capa. Tente novamente.');
    } finally {
      setLoadingHeroUpload(false);
      // Reset input
      e.target.value = null;
    }
  };

  const handleDeleteHeroImage = async (type) => {
    if (!window.confirm('Tem certeza que deseja remover esta imagem de capa?')) return;
    
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
      alert('Erro ao remover a imagem.');
    } finally {
      setLoadingHeroUpload(false);
    }
  };

  const handleSaveHeroText = async () => {
    const { error } = await supabase.from('site_content').update({ data: heroSettings }).eq('id', 'hero_settings');
    if (error) {
      alert('Erro ao salvar texto da capa.');
    } else {
      alert('Texto da capa salvo!');
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
      alert('Foto adicionada com sucesso!');
    } catch (error) {
      console.error(error);
      alert('Erro ao fazer upload da foto. Tente novamente.');
    } finally {
      setLoadingUpload(false);
      e.target.value = null;
    }
  };

  const handleDeletePhoto = async (catId, photoUrl) => {
    if (!window.confirm('Tem certeza que deseja remover esta foto da galeria? Ela será excluída do servidor.')) return;
    
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
      alert('Erro ao remover foto do servidor.');
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
      alert('Erro ao criar galeria.');
    } else {
      setPortfolio(updatedPortfolio);
      setNewGalleryName('');
      setSelectedCategory(newId);
      alert('Galeria criada! Agora adicione fotos nela.');
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
    alert('Banco de dados inicializado com sucesso!');
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
        <h2>Painel de Controle</h2>
        <button onClick={handleLogout} className="btn btn-outline">Sair</button>
      </header>

      {needsSeed && (
        <div style={{ background: '#ffeb3b', padding: '1rem', textAlign: 'center', color: '#000' }}>
          <p>O site precisa ser inicializado com os textos base.</p>
          <button onClick={handleSeed} disabled={seeding} className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
            {seeding ? 'Carregando...' : 'Inicializar Banco de Dados'}
          </button>
        </div>
      )}

      <div className="admin-tabs">
        <button className={activeTab === 'messages' ? 'active' : ''} onClick={() => setActiveTab('messages')}>Mensagens</button>
        <button className={activeTab === 'hero' ? 'active' : ''} onClick={() => setActiveTab('hero')}>Capa do Site</button>
        <button className={activeTab === 'texts' ? 'active' : ''} onClick={() => setActiveTab('texts')}>Textos do Site</button>
        <button className={activeTab === 'portfolio' ? 'active' : ''} onClick={() => setActiveTab('portfolio')}>Portfólio</button>
      </div>

      <div className="admin-content">
        {activeTab === 'messages' && (
          <div>
            <h3>Mensagens Recebidas</h3>
            {loadingMsgs ? <p>Carregando...</p> : messages.length === 0 ? <p>Nenhuma mensagem.</p> : (
              <div className="messages-grid">
                {messages.map(msg => (
                  <div key={msg.id} className="message-card">
                    <p><strong>Nome:</strong> {msg.name}</p>
                    <p><strong>Data:</strong> {new Date(msg.created_at).toLocaleString('pt-BR')}</p>
                    <p className="message-story"><strong>Ideia:</strong> {msg.story}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'hero' && (
          <div>
            <h3>Gerenciar Capa do Site</h3>
            
            <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#fff', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
              <h4>Texto do Logo (Topo)</h4>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <input 
                  type="text" 
                  value={heroSettings.logoText}
                  onChange={(e) => setHeroSettings({...heroSettings, logoText: e.target.value})}
                  style={{ padding: '0.5rem', fontSize: '1rem', flex: 1 }}
                />
                <button onClick={handleSaveHeroText} className="btn btn-primary">Salvar Texto</button>
              </div>
            </div>

            <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#fff', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
              <h4>Imagem de Fundo - Computador</h4>
              <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>Recomendado: Imagem horizontal (paisagem).</p>
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
                {loadingHeroUpload && <span>Processando...</span>}
              </div>
            </div>

            <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#fff', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
              <h4>Imagem de Fundo - Celular</h4>
              <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>Recomendado: Imagem vertical (formato Stories, 9:16).</p>
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
                {loadingHeroUpload && <span>Processando...</span>}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'texts' && (
          <TextEditor />
        )}

        {activeTab === 'portfolio' && (
          <div>
            <h3>Gerenciar Portfólio</h3>
            
            <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#fff', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
              <h4>Criar Nova Galeria</h4>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <input 
                  type="text" 
                  placeholder="Nome da Categoria (Ex: Fine Line)" 
                  value={newGalleryName}
                  onChange={(e) => setNewGalleryName(e.target.value)}
                  style={{ padding: '0.5rem', fontSize: '1rem', flex: 1 }}
                />
                <button onClick={handleCreateGallery} className="btn btn-primary">Criar Galeria</button>
              </div>
            </div>

            <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#fff', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
              <h4>Adicionar Foto à Galeria Existente</h4>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1rem', flexWrap: 'wrap' }}>
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{ padding: '0.5rem', fontSize: '1rem' }}
                >
                  {portfolio.map(cat => (
                    <option key={cat.id} value={cat.id}>Galeria: {cat.titleKey || cat.id}</option>
                  ))}
                </select>
                <input type="file" accept="image/*" onChange={handleUpload} disabled={loadingUpload} />
                {loadingUpload && <span>Fazendo upload...</span>}
              </div>
            </div>

            {portfolio.map(cat => (
              <div key={cat.id} style={{ marginBottom: '3rem' }}>
                <h4 style={{ textTransform: 'capitalize', marginBottom: '1rem' }}>Galeria: {cat.titleKey || cat.id}</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {cat.gallery.length === 0 && <p style={{ fontSize: '0.9rem', color: '#666' }}>Nenhuma foto nesta galeria ainda.</p>}
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
