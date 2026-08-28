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

  useEffect(() => {
    checkContent();
    fetchMessages();
    fetchPortfolio();
  }, []);

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
      const fileName = `${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage.from('portfolio').upload(fileName, file);
      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage.from('portfolio').getPublicUrl(fileName);
      
      const updatedPortfolio = portfolio.map(cat => {
        if (cat.id === selectedCategory) {
          // Se for a primeira foto da galeria, defina como capa também (image)
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
      alert('Erro ao fazer upload da foto.');
    } finally {
      setLoadingUpload(false);
    }
  };

  const handleDeletePhoto = async (catId, photoUrl) => {
    if (!window.confirm('Tem certeza que deseja remover esta foto da galeria?')) return;
    
    const updatedPortfolio = portfolio.map(cat => {
      if (cat.id === catId) {
        return { ...cat, gallery: cat.gallery.filter(img => img !== photoUrl) };
      }
      return cat;
    });

    const { error } = await supabase.from('site_content').update({ data: updatedPortfolio }).eq('id', 'portfolio');
    if (error) {
      alert('Erro ao remover foto.');
    } else {
      setPortfolio(updatedPortfolio);
    }
  };

  const handleCreateGallery = async () => {
    if (!newGalleryName.trim()) return;
    
    const newId = newGalleryName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newCat = {
      id: newId,
      titleKey: newGalleryName, // Since it won't match a translation key, the translator will just output this string!
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
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1rem' }}>
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
