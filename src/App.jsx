import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Hero from './components/Hero';
import HeroInfo from './components/HeroInfo';
import Manifesto from './components/Manifesto';
import Portfolio from './components/Portfolio';
import About from './components/About';
import BookingForm from './components/BookingForm';
import LanguageSwitcher from './components/LanguageSwitcher';
import AdminLogin from './components/Admin/AdminLogin';
import AdminDashboard from './components/Admin/AdminDashboard';
import { supabase } from './supabase';

const Home = () => (
  <>
    <LanguageSwitcher />
    <Hero />
    <HeroInfo />
    <Manifesto />
    <Portfolio />
    <About />
    <BookingForm />
  </>
);

const AdminRoute = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#faf9f7' }}>Carregando...</div>;
  }

  if (!session) {
    return <AdminLogin onLogin={setSession} />;
  }

  return <AdminDashboard session={session} onLogout={() => setSession(null)} />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminRoute />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
