import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import WorkPage from './pages/WorkPage';
import getUserIdFromToken from './utils/getUserId';
import getExpFromToken from './utils/getExp';
import api from './utils/api';
import ProtectedRoutes from './utils/routeProtection';

export default function App() {
  const [id, setId] = useState('');
  const [loading, setLoading] = useState(true);
  const intervalTime = 30000;
  const navigate = useNavigate();

  const resetToken = async () => {
    const timer = setInterval(async () => {
      const exp = getExpFromToken();
      if (exp) {
        const nowDate = Date.now();
        const expDate = exp * 1000;
        if (expDate - nowDate < 2 * intervalTime) {
          const response = await api.post('/api/user/token-update');
          const token = response.data;
          localStorage.setItem('token', token);
        }
      }
    }, intervalTime);
    return timer;
  };

  const autoLogout = async () => {
    const exp = getExpFromToken();
    if (exp) {
      const expDate = new Date(exp * 1000);
      if (Date.now() > expDate) {
        localStorage.removeItem('token');
        navigate('/auth');
      }
    }
  };

  useEffect(() => {
    autoLogout();
    resetToken().then((timerId) => {
      return () => clearInterval(timerId);
    });

    setId(getUserIdFromToken());
    setLoading(false);
  }, []);

  if (loading) return null;

  return (
    <Routes>
      <Route path="/" element={<Navigate to={id ? `/user/${id}` : '/auth'} />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route
        path="/user/:userId"
        element={
          <ProtectedRoutes>
            <HomePage />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/board/:boardId"
        element={
          <ProtectedRoutes>
            <WorkPage />
          </ProtectedRoutes>
        }
      />
    </Routes>
  );
}
