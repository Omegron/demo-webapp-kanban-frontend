import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/WorkPage.css';

export default function CardUI({
  onSubmitDelete,
  onSubmitTitleUpdate,
  onSubmitDescriptionUpdate,
  onSubmitDeadlineUpdate,
  onSubmitStatusUpdate,
  card,
}) {
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [cardId, setCardId] = useState(null);
  const [currentCard, setCurrentCard] = useState([]);
  const [isRedactingTitle, setIsRedactingTitle] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [isRedactingDescription, setIsRedactingDescription] = useState(false);
  const [newCardDescription, setNewCardDescription] = useState('');
  const [isRedactingDeadline, setIsRedactingDeadline] = useState(false);
  const [newCardDeadline, setNewCardDeadline] = useState(null);
  const [isChecked, setIsChecked] = useState(!!card.deadline);
  const [ignoreNextBlur, setIgnoreNextBlur] = useState(false);
  const [t] = useTranslation('global');

  const handleCardDelete = (e) => {
    const deleteData = {
      currentCard,
    };

    onSubmitDelete(e, deleteData);
  };

  const handleTitleUpdate = (id) => {
    const titleUpdateData = {
      id,
      newCardTitle,
      currentCard,
    };
    onSubmitTitleUpdate(titleUpdateData);
    setIsRedactingTitle(false);
  };

  const handleDescriptionUpdate = (id) => {
    const descriptionUpdateData = {
      id,
      newCardDescription,
      currentCard,
    };
    onSubmitDescriptionUpdate(descriptionUpdateData);
    setIsRedactingDescription(false);
  };

  const handleDeadlineUpdate = (id, newCardDeadline, columnId) => {
    const updateDeadlineData = {
      id,
      newCardDeadline,
      columnId,
    };
    onSubmitDeadlineUpdate(updateDeadlineData);
    setIsRedactingDeadline(false);
    setIsChecked(false);
  };

  const changeDateFormat = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU');
  };

  const handleStatusUpdate = (id, newCardStatus, columnId) => {
    const statusUpdateData = {
      id,
      newCardStatus,
      columnId,
    };
    onSubmitStatusUpdate(statusUpdateData);
  };

  return (
    <>
      {!(isCardOpen && cardId === card.id) ? (
        <div
          className="closed-card"
          onClick={() => {
            setIsCardOpen(true);
            setCardId(card.id);
            setNewCardTitle('');
            setIsRedactingTitle(false);
            setNewCardDescription('');
            setIsRedactingDescription('');
            setIsChecked(false);
            setNewCardDeadline(null);
            setIsRedactingDeadline(false);
          }}
        >
          <form onSubmit={handleCardDelete}>
            <button
              className="delete-button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentCard(card);
              }}
            ></button>
          </form>
          <input
            type="checkbox"
            checked={card.status}
            onChange={() => {
              setCurrentCard(card);
              handleStatusUpdate(card.id, !card.status, card.columnId);
            }}
            onClick={(e) => e.stopPropagation()}
            className="card-status-checkbox"
          />
          <div className="card-title">
            {isRedactingTitle && cardId === card.id ? (
              <input
                className="card-new-input"
                type="text"
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                required
                autoFocus
                onClick={(e) => e.stopPropagation()}
                onBlur={() => handleTitleUpdate(card.id)}
              />
            ) : (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentCard(card);
                  setCardId(card.id);
                  setNewCardTitle(card.title);
                  setIsRedactingTitle(true);
                }}
              >
                {card.title}
              </span>
            )}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="opened-card">
            <form onSubmit={handleCardDelete}>
              <button
                className="delete-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentCard(card);
                }}
              ></button>
            </form>
            <input
              type="checkbox"
              checked={card.status}
              onChange={() => {
                setCurrentCard(card);
                handleStatusUpdate(card.id, !card.status, card.columnId);
              }}
              onClick={(e) => e.stopPropagation()}
              className="card-status-checkbox"
            />
            <div className="card-title">
              {isRedactingTitle && cardId === card.id ? (
                <input
                  className="card-new-input"
                  type="text"
                  value={newCardTitle}
                  onChange={(e) => setNewCardTitle(e.target.value)}
                  required
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                  onBlur={() => handleTitleUpdate(card.id)}
                />
              ) : (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentCard(card);
                    setCardId(card.id);
                    setNewCardTitle(card.title);
                    setIsRedactingTitle(true);
                  }}
                >
                  {card.title}
                </span>
              )}
            </div>
          </div>
          {!card.description ? (
            <div className="card-description">
              {isRedactingDescription && cardId === card.id ? (
                <input
                  className="card-new-input"
                  type="text"
                  value={newCardDescription}
                  onChange={(e) => setNewCardDescription(e.target.value)}
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                  onBlur={() => handleDescriptionUpdate(card.id)}
                />
              ) : (
                <span
                  className="empty-value"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentCard(card);
                    setCardId(card.id);
                    setNewCardDescription(card.description);
                    setIsRedactingDescription(true);
                  }}
                >
                  {t('card-description-placeholder')}
                </span>
              )}
            </div>
          ) : (
            <div className="card-description">
              {isRedactingDescription && cardId === card.id ? (
                <input
                  className="card-new-input"
                  type="text"
                  value={newCardDescription}
                  onChange={(e) => setNewCardDescription(e.target.value)}
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                  onBlur={() => handleDescriptionUpdate(card.id)}
                />
              ) : (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentCard(card);
                    setCardId(card.id);
                    setNewCardDescription(card.description);
                    setIsRedactingDescription(true);
                  }}
                >
                  {card.description}
                </span>
              )}
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <input
              type="checkbox"
              checked={isChecked || !!card.deadline}
              onMouseDown={() => {
                setIgnoreNextBlur(true);
              }}
              onChange={(e) => {
                const checked = e.target.checked;
                setIsChecked(checked);
                if (checked) {
                  setIsRedactingDeadline(true);
                } else {
                  document.activeElement.blur();
                  setIsRedactingDeadline(false);
                  setIsChecked(false);
                  setCurrentCard(card);
                  setNewCardDeadline(null);
                  handleDeadlineUpdate(card.id, null, card.columnId);
                }
              }}
              className="card-deadline-status"
            />
            <div type="date" className="card-deadline">
              {!isRedactingDeadline && !card.deadline ? (
                <span className="empty-value">{t('card-deadline')}</span>
              ) : isRedactingDeadline && isChecked && cardId === card.id ? (
                <input
                  className="card-new-input"
                  type="date"
                  value={newCardDeadline ?? ''}
                  onChange={(e) => {
                    setNewCardDeadline(e.target.value);
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  onBlur={() => {
                    if (ignoreNextBlur && newCardDeadline == null) {
                      setIgnoreNextBlur(false);
                      return;
                    }
                    if (newCardDeadline) {
                      handleDeadlineUpdate(card.id, newCardDeadline, card.columnId);
                    } else {
                      setIsChecked(false);
                      handleDeadlineUpdate(card.id, null, card.columnId);
                    }
                    setIsRedactingDeadline(false);
                  }}
                />
              ) : (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentCard(card);
                    setCardId(card.id);
                    setNewCardDeadline(card.deadline);
                    setIsRedactingDeadline(true);
                  }}
                >
                  {changeDateFormat(card.deadline)}
                </span>
              )}
            </div>
          </div>
          <button
            className="card-close-button"
            type="cancel"
            onClick={() => {
              setIsCardOpen(false);
              setCardId(null);
            }}
          >
            {t('card-close-button')}
          </button>
        </div>
      )}
    </>
  );
}
