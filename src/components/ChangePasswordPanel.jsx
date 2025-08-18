import { useState } from 'react';
import api from '../utils/api';
import { useTranslation } from 'react-i18next';

export default function ChangePasswordPanel() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPassword, setIsPassword] = useState(false);
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const [isConfirmShow, setIsConfirmShow] = useState(false);
  const [error, setError] = useState('');
  const [t] = useTranslation('global');

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setIsPassword(false);
    setError('');

    const url = '/api/user/update-password';
    const payload = { password, confirmPassword };

    try {
      await api.patch(url, payload);
      setIsPassword(true);
    } catch (err) {
      const errorMessage = { PASSWORD_NOT_CONFIRMED: t('error-passwords') };
      const message =
        errorMessage[err.response?.data?.error] ||
        err.response?.data?.message ||
        err.response?.data ||
        err.message;
      setError(message);
    }
    setPassword('');
    setConfirmPassword('');
    setIsPasswordShow(false);
    setIsConfirmShow(false);
  };

  return (
    <div className="home-padding">
      <p className="home-text">{t('password-change-header')}</p>
      <form className="home-form" onSubmit={handlePasswordUpdate}>
        <div>
          <input
            className="home-input"
            type={isPasswordShow ? 'text' : 'password'}
            placeholder={t('password-change-placeholder-password')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            className="password-show-button"
            type="button"
            onClick={() => setIsPasswordShow(!isPasswordShow)}
          >
            {t('password-change-show')}
          </button>
        </div>
        <div>
          <input
            className="home-input"
            type={isConfirmShow ? 'text' : 'password'}
            placeholder={t('password-change-placeholder-confirm-password')}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            className="password-show-button"
            type="button"
            onClick={() => setIsConfirmShow(!isConfirmShow)}
          >
            {t('password-change-show')}
          </button>
        </div>

        <button className="home-button" type="submit">
          {t('password-change-button')}
        </button>
      </form>
      <p>{isPassword ? t('password-change-success') : ''}</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
