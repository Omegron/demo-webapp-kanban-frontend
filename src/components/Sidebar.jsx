import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/Sidebar.css';

export default function Sidebar({ activeTab, setActiveTab }) {
  const [isLangChange, setIsLangChange] = useState(false);
  const [t, i18n] = useTranslation('global');
  const changeLang = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('lang', lang);
  };

  const navigate = useNavigate();

  return (
    <>
      <div className="sidebar-area">
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}
        >
          <button
            className={activeTab === 'boards' ? 'activeTab' : 'passiveTab'}
            onClick={() => setActiveTab('boards')}
          >
            {t('sidebar-boards')}
          </button>
          <button
            className={activeTab === 'changeUsername' ? 'activeTab' : 'passiveTab'}
            onClick={() => setActiveTab('changeUsername')}
          >
            {t('sidebar-change-username')}
          </button>
          <button
            className={activeTab === 'changePassword' ? 'activeTab' : 'passiveTab'}
            onClick={() => setActiveTab('changePassword')}
          >
            {t('sidebar-change-password')}
          </button>
          <button
            className={activeTab === 'changeEmail' ? 'activeTab' : 'passiveTab'}
            onClick={() => setActiveTab('changeEmail')}
          >
            {t('sidebar-change-email')}
          </button>
          <button
            className={activeTab === 'deleteUser' ? 'activeTab' : 'passiveTab'}
            onClick={() => setActiveTab('deleteUser')}
          >
            {t('sidebar-delete-user')}
          </button>
          <button
            className="passiveTab"
            onClick={() => {
              localStorage.removeItem('activeTab');
              localStorage.removeItem('token');
              navigate('/auth');
            }}
          >
            {t('sidebar-exit')}
          </button>
        </div>
        <button className="sidebar-lang-button" onClick={() => setIsLangChange(!isLangChange)}>
          {i18n.language.toUpperCase()}
        </button>
        {isLangChange ? (
          <div className="sidebar-lang-select">
            <p onClick={() => changeLang('en')}>EN</p>
            <p onClick={() => changeLang('ua')}>UA</p>
            <p onClick={() => changeLang('ru')}>RU</p>
          </div>
        ) : (
          ''
        )}
      </div>
    </>
  );
}
