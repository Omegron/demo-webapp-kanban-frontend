import { useState } from 'react';
import api from '../utils/api';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function DeleteUserPanel() {
  const navigate = useNavigate();
  const [isDelete, setIsDelete] = useState(false);
  const [error, setError] = useState('');
  const [t] = useTranslation('global');

  const handleUserDelete = async (e) => {
    e.preventDefault();
    setError('');

    const url = `/api/user/delete`;

    try {
      await api.delete(url);
      localStorage.clear('token');
      localStorage.removeItem('activeTab');
      navigate('/auth');
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data || err.message;
      setError(message);
    }
  };

  return (
    <div className="home-padding">
      <p className="home-text">{t('user-delete-ask')}</p>
      <button className="home-button" onClick={() => setIsDelete(true)}>
        {t('user-delete-confirm')}
      </button>
      {isDelete ? (
        <form onSubmit={handleUserDelete}>
          <p className="home-text">{t('user-delete-ask-confirm')}</p>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '100px' }}>
            <button className="home-button-2" type="submit">
              {t('user-delete-confirm')}
            </button>
            <button className="home-button-2" type="button" onClick={() => setIsDelete(false)}>
              {t('user-delete-cancel')}
            </button>
          </div>
        </form>
      ) : (
        ''
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
