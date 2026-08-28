import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';

const TextEditor = () => {
  const [translations, setTranslations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lang, setLang] = useState('en'); // default to english editing

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    const { data } = await supabase.from('site_content').select('data').eq('id', 'translations').single();
    if (data) setTranslations(data.data);
    setLoading(false);
  };

  const handleTextChange = (section, key, value) => {
    setTranslations(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [section]: {
          ...prev[lang][section],
          [key]: value
        }
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from('site_content').update({ data: translations }).eq('id', 'translations');
    setSaving(false);
    if (error) {
      alert('Erro ao salvar os textos.');
    } else {
      alert('Textos salvos com sucesso!');
    }
  };

  if (loading) return <p>Carregando textos...</p>;
  if (!translations) return <p>Nenhum texto encontrado no banco de dados.</p>;

  // Get sections from the chosen language
  const sections = translations[lang] || {};

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <h3>Editar Textos do Site</h3>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <label>Idioma que deseja editar: </label>
          <select value={lang} onChange={e => setLang(e.target.value)} style={{ padding: '0.5rem' }}>
            <option value="en">Inglês (English)</option>
            <option value="ru">Russo (Русский)</option>
            <option value="th">Tailandês (ไทย)</option>
          </select>
        </div>
      </div>

      <div style={{ background: '#fff', padding: '1rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
        {Object.keys(sections).map(section => (
          <div key={section} style={{ marginBottom: '2rem' }}>
            <h4 style={{ textTransform: 'capitalize', color: 'var(--color-accent)', marginBottom: '1rem' }}>{section}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {Object.keys(sections[section]).map(key => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: '0.3rem' }}>{key}</label>
                  <textarea 
                    value={sections[section][key]} 
                    onChange={(e) => handleTextChange(section, key, e.target.value)}
                    style={{ width: '100%', padding: '0.8rem', minHeight: '60px', fontFamily: 'inherit', border: '1px solid #ccc', borderRadius: '4px' }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
        
        <button onClick={handleSave} disabled={saving} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
          {saving ? 'Salvando...' : 'Salvar Todas as Alterações'}
        </button>
      </div>
    </div>
  );
};

export default TextEditor;
