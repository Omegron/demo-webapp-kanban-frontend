import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/CardCreateForm.css';

export default function CardCreateForm({ onSubmit, columnId }) {
  const [isNewCard, setIsNewCard] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState(null);
  const [isDeadline, setIsDeadline] = useState(false);
  const [t] = useTranslation('global');

  const handleCardCreate = (e) => {
    const cardData = {
      title,
      description,
      deadline: isDeadline ? deadline : null,
      columnId,
    };

    onSubmit(e, cardData);
    setIsNewCard(false);
    setTitle('');
    setDescription('');
    setDeadline(null);
    setIsDeadline(false);
  };

  return (
    <>
      {!isNewCard ? (
        <div className="new-card" onClick={() => setIsNewCard(true)}>
          {t('card-new-button')}
        </div>
      ) : (
        <form onSubmit={handleCardCreate} style={{ display: 'flex', flexDirection: 'column' }}>
          <input
            className="new-card-title"
            type="title"
            placeholder={t('card-title-placeholder')}
            value={title}
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            className="new-card-description"
            type="description"
            placeholder={t('card-description-placeholder')}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <input
              type="checkbox"
              onChange={() => setIsDeadline(!isDeadline)}
              style={{ position: 'absolute', marginTop: '15px', marginLeft: '20px' }}
            />
            <div className="new-card-deadline">
              {!isDeadline ? (
                <span className="empty-value">{t('card-deadline')}</span>
              ) : (
                <input
                  className="new-card-deadline-input"
                  type="date"
                  value={deadline ?? ''}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              )}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <button className="new-card-create-button" type="submit">
              {t('card-create-button')}
            </button>
            <button
              className="new-card-cancel-button"
              type="cancel"
              onClick={() => {
                setIsNewCard(false);
                setTitle('');
                setDescription('');
                setDeadline(null);
                setIsDeadline(false);
              }}
            >
              {t('card-cancel-button')}
            </button>
          </div>
        </form>
      )}
    </>
  );
}
