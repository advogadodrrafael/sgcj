import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/auth.js';
import { useEffect } from 'react';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ClientsPage from './pages/ClientsPage.jsx';
import ClientDetailPage from './pages/ClientDetailPage.jsx';
import { initializeSync } from './lib/sync.js';

export default function App() {
  const { token, restoreSession } = useAuthStore();

  useEffect(() => {
    // Restaurar sessão do localStorage
    restoreSession();

    // Inicializar sincronização
    if (token) {
      initializeSync(token);
    }
  }, [token, restoreSession]);

  return (
    <Router>
      {!token ? (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/clients/:id" element={<ClientDetailPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </Router>
  );
}
