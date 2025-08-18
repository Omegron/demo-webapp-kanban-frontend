import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import '../styles/AuthPage.css';
import { useTranslation } from 'react-i18next';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLangChange, setIsLangChange] = useState(false);
  const [t, i18n] = useTranslation('global');
  const changeLang = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('lang', lang);
  };

  const navigate = useNavigate();

  const handleLoginOrRegister = async (e) => {
    e.preventDefault();

    const url = `api/user/${isLogin ? 'login' : 'register'}`;
    const payload = isLogin ? { email, password } : { email, password, confirmPassword };

    try {
      const response = await api.post(url, payload);

      const { token, userId } = response.data;
      localStorage.setItem('token', token);

      navigate(`/user/${userId}`);
    } catch (err) {
      const errorMessages = {
        EMAIL_TAKEN: t('error-email'),
        PASSWORD_NOT_CONFIRMED: t('error-passwords'),
        INVALID_INPUTS: t('error-inputs'),
      };
      const message =
        errorMessages[err.response?.data?.error] ||
        err.response?.data?.message ||
        err.response?.data ||
        err.message;
      setError(message);
    }
  };

  return (
    <>
      <header className="auth-header">Demo webapp kanban</header>
      <main className="auth-main">
        <div className="auth-area">
          <form className="auth-form" onSubmit={handleLoginOrRegister}>
            <input
              className="auth-input"
              type="email"
              placeholder={t('auth-email-placeholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="auth-input"
              type="password"
              placeholder={t('auth-password-placeholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {!isLogin && (
              <input
                className="auth-input"
                type="password"
                placeholder={t('auth-confirm-password')}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            )}
            <button className="auth-button" type="submit">
              {isLogin ? t('auth-log-in') : t('auth-sign-up')}
            </button>
          </form>

          <p style={{ marginBottom: '0px', marginTop: '30px' }}>
            <button className="auth-button" type="button" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? t('auth-sign-up') : t('auth-log-in')}
            </button>
          </p>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>

        <button className="auth-lang-button" onClick={() => setIsLangChange(!isLangChange)}>
          {i18n.language.toUpperCase()}
        </button>
        {isLangChange ? (
          <div className="auth-lang-select">
            <p onClick={() => changeLang('en')}>EN</p>
            <p onClick={() => changeLang('ua')}>UA</p>
            <p onClick={() => changeLang('ru')}>RU</p>
          </div>
        ) : (
          ''
        )}
      </main>
    </>
  );
}
