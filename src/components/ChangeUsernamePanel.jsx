import { useEffect, useState } from 'react';
import api from '../utils/api';
import { useTranslation } from 'react-i18next';

export default function ChangeUsernamePanel() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [isUsername, setIsUsername] = useState(false);
  const [error, setError] = useState('');
  const [t] = useTranslation('global');

  const fetchUser = async () => {
    const response = await api.get('/api/user/me');
    setUser(response.data);
  };
  useEffect(() => {
    fetchUser();
  }, []);

  const handleUsernameUpdate = async (e) => {
    e.preventDefault();
    setIsUsername(false);
    setError('');

    const url = '/api/user/update-username';
    const payload = { username };

    try {
      await api.patch(url, payload);
      setIsUsername(true);
      await fetchUser();
      setUsername('');
    } catch (err) {
      const errorMessage = { USERNAME_TAKEN: t('error-username') };
      const message =
        errorMessage[err.response?.data?.error] ||
        err.response?.data?.message ||
        err.response?.data ||
        err.message;
      setError(message);
    }
  };

  return (
    <div className="home-padding">
      <p className="home-text">
        {t('username-change-header')}: {user?.username}
      </p>
      <form className="home-form" onSubmit={handleUsernameUpdate}>
        <input
          className="home-input"
          type="text"
          placeholder={t('username-change-placeholder')}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <button className="home-button" type="submit">
          {t('username-change-button')}
        </button>
      </form>
      <p>{isUsername ? t('username-change-success') : ''}</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
