import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import './BookingForm.css';
import { supabase } from '../supabase';

const BookingForm = () => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const name = e.target.name.value;
    const story = e.target.story.value;

    try {
      const { error } = await supabase
        .from('messages')
        .insert([{ name, story, created_at: new Date().toISOString() }]);

      if (error) throw error;
      setSuccess(true);
      e.target.reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Houve um erro ao enviar sua mensagem. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="booking-form" className="section booking-section">
      <div className="container">
        <div className="booking-container">
          <div className="booking-header">
            <h2 className="booking-title text-serif">{t('booking', 'title')}</h2>
            <p className="booking-subtitle text-sans">
              {t('booking', 'subtitle')}
            </p>
          </div>
          
          <form className="booking-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">{t('booking', 'form_name')}</label>
              <input type="text" id="name" className="form-input" required placeholder={t('booking', 'form_name_ph')} />
            </div>



            <div className="form-group">
              <label htmlFor="story" className="form-label">{t('booking', 'form_story')}</label>
              <textarea id="story" className="form-textarea" required placeholder={t('booking', 'form_story_ph')}></textarea>
            </div>

            <div className="form-submit text-center">
              {success ? (
                <div className="success-message" style={{ color: 'var(--color-accent)', marginBottom: '1rem' }}>
                  {t('booking', 'success')}
                </div>
              ) : null}
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Enviando...' : t('booking', 'form_submit')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default BookingForm;
