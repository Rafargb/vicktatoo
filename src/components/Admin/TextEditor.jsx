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
      alert('Ошибка при сохранении текстов.');
    } else {
      alert('Тексты успешно сохранены!');
    }
  };

  if (loading) return <p>Загрузка текстов...</p>;
  if (!translations) return <p>Тексты не найдены в базе данных.</p>;

  // Get sections from the chosen language
  const sections = translations[lang] || {};

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <h3>Редактировать тексты сайта</h3>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <label>Язык для редактирования: </label>
          <select value={lang} onChange={e => setLang(e.target.value)} style={{ padding: '0.5rem' }}>
            <option value="en">Английский (English)</option>
            <option value="ru">Русский (Русский)</option>
            <option value="th">Тайский (ไทย)</option>
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
          {saving ? 'Сохранение...' : 'Сохранить все изменения'}
        </button>
      </div>
    </div>
  );
};

export default TextEditor;
