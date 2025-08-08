import React, { useEffect, useState } from 'react';
import HomePage from './pages/HomePage';
import QueuePage from './pages/QueuePage';
import AdminDashboard from './pages/AdminDashboard';
import SuperAdminPanel from './pages/SuperAdminPanel';
import VenuePage from './pages/VenuePage';

const App = () => {
  // check for token in URL (from Google redirect)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      window.history.replaceState({}, document.title, '/'); // remove query
    }
  }, []);

  const [route, setRoute] = useState('home');
  const token = localStorage.getItem('token');

  return (
    <div className="app">
      <header className="topbar">
        <h1 className="logo">QueueIt</h1>
        <nav>
          <button onClick={() => setRoute('home')}>Home</button>
          <button onClick={() => setRoute('queue')}>Queues</button>
          <button onClick={() => setRoute('venue')}>Venues</button>
          {token && <button onClick={() => setRoute('admin')}>Admin</button>}
          <a className="auth" href={`${import.meta.env.VITE_API || 'http://localhost:5000'}/auth/google`}>Sign in with Google</a>
        </nav>
      </header>

      <main>
        {route === 'home' && <HomePage />}
        {route === 'queue' && <QueuePage />}
        {route === 'venue' && <VenuePage />}
        {route === 'admin' && <AdminDashboard />}
        {route === 'super' && <SuperAdminPanel />}
      </main>
    </div>
  );
};

export default App;
