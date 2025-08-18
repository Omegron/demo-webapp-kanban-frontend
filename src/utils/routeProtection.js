import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProtectedRoutes({ children }) {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/auth', { replace: true });
    }
  }, [token, navigate]);

  return token ? children : null;
}
