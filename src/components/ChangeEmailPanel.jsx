import { useEffect, useState } from 'react';
import api from '../utils/api';
import { useTranslation } from 'react-i18next';

export default function ChangeEmailPanel() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [isEmail, setIsEmail] = useState(false);
  const [error, setError] = useState('');
  const [t] = useTranslation('global');

  const fetchUser = async () => {
    const response = await api.get('/api/user/me');
    setUser(response.data);
  };
  useEffect(() => {
    fetchUser();
  }, []);

  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    setIsEmail(false);
    setError('');

    const url = '/api/user/update-email';
    const payload = { email };

    try {
      await api.patch(url, payload);
      setIsEmail(true);
      await fetchUser();
      setEmail('');
    } catch (err) {
      const errorMessage = { EMAIL_TAKEN: t('error-email') };
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
        {t('email-change-header')}: {user?.email}
      </p>
      <form className="home-form" onSubmit={handleEmailUpdate}>
        <input
          className="home-input"
          type="text"
          placeholder={t('email-change-placeholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="home-button" type="submit">
          {t('email-change-button')}
        </button>
      </form>
      <p>{isEmail ? t('email-change-success') : ''}</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
