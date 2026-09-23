import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import AuthModal from './components/AuthModal';
import AdminPortal from './components/AdminPortal';
import { api } from './services/api';

// Focused Pages (Unwanted pages removed per user request)
import HomePage from './pages/HomePage';
import UserDashboard from './pages/UserDashboard';
import DownloadPage from './pages/DownloadPage';

export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('ghost_ai_theme') || 'dark';
  });

  // Client-Side Hash Router: 'home' | 'download' | 'dashboard' | 'admin'
  const [currentPage, setCurrentPage] = useState(() => {
    const hash = window.location.hash.replace('#', '').trim();
    if (hash === 'dashboard' || hash === 'admin' || hash === 'home' || hash === 'download') {
      return hash;
    }
    return 'home';
  });

  const [users, setUsers] = useState([]);

  const [activeUser, setActiveUser] = useState(() => {
    const saved = localStorage.getItem('ghost_active_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState('login');
  const [toasts, setToasts] = useState([]);

  // Fetch latest users
  const fetchUsers = async () => {
    try {
      const data = await api.getUsers();
      if (Array.isArray(data) && data.length > 0) {
        setUsers(data);
        setActiveUser((prev) => {
          if (!prev) return null;
          const match = data.find((u) => u.id === prev.id || u.email.toLowerCase() === prev.email?.toLowerCase());
          return match || prev;
        });
      }
    } catch (err) {
      // Gracefully silent when offline
    }
  };

  useEffect(() => {
    fetchUsers();
    const interval = setInterval(fetchUsers, 5000);
    return () => clearInterval(interval);
  }, []);

  // Sync hash changes with state
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').trim();
      if (hash === 'dashboard' || hash === 'admin' || hash === 'home' || hash === 'download') {
        setCurrentPage(hash);
      } else {
        setCurrentPage('home');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (pageId) => {
    window.location.hash = `#${pageId}`;
    setCurrentPage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ghost_ai_theme', theme);
  }, [theme]);

  useEffect(() => {
    if (activeUser) {
      localStorage.setItem('ghost_active_user', JSON.stringify(activeUser));
    } else {
      localStorage.removeItem('ghost_active_user');
    }
  }, [activeUser]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const addToast = (message, icon = 'zap') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => {
      const filtered = prev.filter((t) => t.message !== message);
      return [...filtered.slice(-1), { id, message, icon }];
    });
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  };

  const openAuth = (mode = 'login') => {
    setAuthInitialMode(mode);
    setIsAuthOpen(true);
  };

  const handleLogin = (user) => {
    setActiveUser(user);
    if (user.role === 'admin') {
      navigateTo('admin');
    } else {
      navigateTo('dashboard');
    }
  };

  const handleLogout = () => {
    setActiveUser(null);
    addToast('Signed out successfully', 'check');
    navigateTo('home');
  };

  // Admin updates user (e.g. toggles access or edits)
  const handleUpdateUser = (updatedUser) => {
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? { ...u, ...updatedUser } : u)));
    if (activeUser && activeUser.id === updatedUser.id) {
      setActiveUser((prev) => ({ ...prev, ...updatedUser }));
    }
    fetchUsers();
  };

  // Render current page dynamically
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'download':
        return (
          <DownloadPage
            onNavigate={navigateTo}
            onOpenAuth={openAuth}
            activeUser={activeUser}
            onTriggerToast={addToast}
          />
        );
      case 'dashboard':
        return (
          <UserDashboard
            activeUser={activeUser}
            onLogout={handleLogout}
            onTriggerToast={addToast}
            onNavigate={navigateTo}
          />
        );
      case 'admin':
        return (
          <AdminPortal
            users={users}
            activeUser={activeUser}
            onUpdateUser={handleUpdateUser}
            onTriggerToast={addToast}
            onNavigate={navigateTo}
            onClose={() => navigateTo('home')}
          />
        );
      case 'home':
      default:
        return (
          <HomePage
            onNavigate={navigateTo}
            onOpenAuth={openAuth}
            onOpenRecharge={() => {
              if (activeUser) navigateTo('dashboard');
              else openAuth('login');
            }}
            activeUser={activeUser}
            onTriggerToast={addToast}
            theme={theme}
          />
        );
    }
  };

  return (
    <div className="app-root" data-theme={theme}>
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        currentPage={currentPage}
        onNavigate={navigateTo}
        activeUser={activeUser}
        onOpenAuth={openAuth}
        onLogout={handleLogout}
      />

      <main className="main-viewport">
        {renderCurrentPage()}
      </main>

      {currentPage !== 'admin' && <Footer onNavigate={navigateTo} />}
      <Toast toasts={toasts} />

      <AuthModal
        isOpen={isAuthOpen}
        initialMode={authInitialMode}
        onClose={() => setIsAuthOpen(false)}
        onLogin={handleLogin}
        onRegister={() => {}}
        onTriggerToast={addToast}
      />
    </div>
  );
}
