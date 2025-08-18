import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import api from '../utils/api';
import CardCreateForm from '../components/CardCreateForm';
import CardUI from '../components/CardUI';
import { CardChangeLocation } from '../components/CardChangeLocation';
import '../styles/WorkPage.css';

export default function WorkPage() {
  const { boardId } = useParams();
  const [error, setError] = useState('');

  const [unassignedCards, setUnassignedCards] = useState([]);

  const [board, setBoard] = useState({ columns: [] });
  const [isNewColumn, setIsNewColumn] = useState(false);
  const [name, setName] = useState('');
  const [columnId, setColumnId] = useState(null);
  const [newColumnName, setNewColumnName] = useState('');

  const [user, setUser] = useState(null);

  const [isMenu, setIsMenu] = useState(false);

  const [isLangChange, setIsLangChange] = useState(false);
  const [t, i18n] = useTranslation('global');
  const changeLang = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('lang', lang);
  };

  const navigate = useNavigate();

  const fetchUser = async () => {
    const response = await api.get('/api/user/me');
    setUser(response.data);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUnassignedCards = async () => {
    setError('');

    try {
      const response = await api.get('/api/card/board/unassigned-cards', { params: { boardId } });
      setUnassignedCards(response.data);
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data || err.message;
      setError(message);
    }
  };

  const fetchBoard = async () => {
    setError('');

    try {
      const response = await api.get(`/api/board/${boardId}`);
      setBoard(response.data);
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data || err.message;
      setError(message);
    }
  };

  useEffect(() => {
    fetchUnassignedCards();
    fetchBoard();
  }, [boardId]);

  const handleCardCreate = async (e, cardData) => {
    e.preventDefault();
    setError('');

    const url = '/api/card/create';
    const { title, description, deadline, columnId } = cardData;
    const payload = { title, description, deadline, columnId, boardId };

    try {
      await api.post(url, payload);

      {
        columnId ? await fetchBoard() : await fetchUnassignedCards();
      }
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data || err.message;
      setError(message);
    }
  };

  const handleCardDelete = async (e, deleteData) => {
    e.preventDefault();
    setError('');

    const { currentCard } = deleteData;
    const url = `/api/card/delete?id=${currentCard.id}`;

    try {
      await api.delete(url);

      {
        currentCard?.columnId ? await fetchBoard() : await fetchUnassignedCards();
      }
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data || err.message;
      setError(message);
    }
  };

  const handleTitleUpdate = async (titleUpdateData) => {
    setError('');

    const url = '/api/card/update-title';
    const { id, newCardTitle, currentCard } = titleUpdateData;
    const payload = { id, newCardTitle };

    try {
      await api.patch(url, payload);

      {
        currentCard?.columnId ? await fetchBoard() : await fetchUnassignedCards();
      }
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data || err.message;
      setError(message);
    }
  };

  const handleDescriptionUpdate = async (descriptionUpdateData) => {
    setError('');

    const url = '/api/card/update-description';
    const { id, newCardDescription, currentCard } = descriptionUpdateData;
    const payload = { id, newCardDescription };

    try {
      await api.patch(url, payload);

      {
        currentCard?.columnId ? await fetchBoard() : await fetchUnassignedCards();
      }
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data || err.message;
      setError(message);
    }
  };

  const handleDeadlineUpdate = async (updateDeadlineData) => {
    setError('');

    const url = '/api/card/update-deadline';
    const { id, newCardDeadline, columnId } = updateDeadlineData;
    const payload = { id, newCardDeadline };

    try {
      await api.patch(url, payload);
      if (columnId !== null) {
        await fetchBoard();
      } else {
        await fetchUnassignedCards();
      }
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data || err.message;
      setError(message);
    }
  };

  const handleStatusUpdate = async (statusUpdateData) => {
    setError('');

    const url = '/api/card/update-status';
    const { id, newCardStatus, columnId } = statusUpdateData;
    const payload = { id, newCardStatus };
    try {
      await api.patch(url, payload);

      {
        columnId ? await fetchBoard() : await fetchUnassignedCards();
      }
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data || err.message;
      setError(message);
    }
  };

  const handleLocationUpdate = async (operationInfo) => {
    const result = CardChangeLocation({ operationInfo, unassignedCards, board });
    if (!result) return;
    let newCardColumnId, url, payload;
    const movedCard = result.movedCard;
    const newCardPosition = result.destinationIndex;
    if (result.destinationId === 'unassigned-cards') {
      newCardColumnId = null;
    } else {
      newCardColumnId = result.destinationId;
    }

    if (operationInfo.source.droppableId === operationInfo.destination.droppableId) {
      url = '/api/card/update-position';
      payload = { id: movedCard.id, newCardPosition };
    } else {
      url = '/api/card/update-location';
      payload = { id: movedCard.id, newCardPosition, newCardColumnId };
    }

    try {
      await api.patch(url, payload);

      if (operationInfo.source.droppableId === operationInfo.destination.droppableId) {
        {
          movedCard.columnId ? await fetchBoard() : await fetchUnassignedCards();
        }
      } else if (
        operationInfo.source.droppableId === 'unassigned-cards' ||
        operationInfo.destination.droppableId === 'unassigned-cards'
      ) {
        await fetchBoard();
        await fetchUnassignedCards();
      } else {
        await fetchBoard();
      }
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data || err.message;
      setError(message);
    }
  };

  const handleColumnCreate = async (e) => {
    e.preventDefault();
    setError('');

    const url = '/api/column/create';
    const payload = { name, boardId };

    try {
      await api.post(url, payload);

      await fetchBoard();

      setIsNewColumn(false);
      setName('');
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data || err.message;
      setError(message);
    }
  };

  const handleColumnDelete = async (e, column) => {
    e.preventDefault();
    setError('');

    const url = `/api/column/delete?id=${column.id}`;

    try {
      await api.delete(url);

      await fetchBoard();
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data || err.message;
      setError(message);
    }
  };

  const handleNameUpdate = async () => {
    setError('');

    const url = '/api/column/update-name';
    const payload = { id: columnId, name: newColumnName, boardId };
    try {
      await api.patch(url, payload);
      await fetchBoard();
      setColumnId(null);
      setNewColumnName('');
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data || err.message;
      setError(message);
    }
  };

  return (
    <>
      <header className="work-header">
        <span>Demo webapp kanban</span>
        <div style={{ position: 'relative' }}>
          <span>{user?.username}</span>
          <button className="work-menu-button" onClick={() => setIsMenu(!isMenu)}></button>
          {isMenu ? (
            <div className="work-menu">
              <p onClick={() => navigate(`/user/${user.id}`)}>{t('work-menu-home')}</p>
              <p
                onClick={() => {
                  localStorage.removeItem('activeTab');
                  localStorage.removeItem('token');
                  navigate('/auth');
                }}
              >
                {t('work-menu-loguot')}
              </p>
            </div>
          ) : (
            ''
          )}
        </div>
      </header>
      <main style={{ position: 'relative' }}>
        <div className="work-area">
          <DragDropContext onDragEnd={handleLocationUpdate}>
            <div className="unassigned-cards-area">
              <p style={{ fontSize: '30px', paddingLeft: '80px' }}>{t('unassigned-cards')}</p>
              <CardCreateForm onSubmit={handleCardCreate} columnId={null} />
              <Droppable droppableId="unassigned-cards">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{ display: 'flex', flexDirection: 'column' }}
                  >
                    {unassignedCards
                      .slice()
                      .reverse()
                      .map((card, index) => (
                        <Draggable key={card.id} draggableId={String(card.id)} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <CardUI
                                onSubmitDelete={handleCardDelete}
                                onSubmitTitleUpdate={handleTitleUpdate}
                                onSubmitDescriptionUpdate={handleDescriptionUpdate}
                                onSubmitDeadlineUpdate={handleDeadlineUpdate}
                                onSubmitStatusUpdate={handleStatusUpdate}
                                card={card}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
            <div className="board-area">
              <p style={{ fontSize: '30px', paddingLeft: '20px' }}>{board.boardName}</p>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ display: 'flex' }}>
                  {board.columns.map((column) => (
                    <div key={column.id} className="column">
                      {columnId === column.id ? (
                        <input
                          className="column-new-name"
                          type="text"
                          value={newColumnName}
                          onChange={(e) => setNewColumnName(e.target.value)}
                          required
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                          onBlur={() => handleNameUpdate(column.id)}
                        />
                      ) : (
                        <p
                          className="column-name"
                          onClick={(e) => {
                            e.stopPropagation();
                            setColumnId(column.id);
                            setNewColumnName(column.name);
                          }}
                        >
                          {column.name}
                        </p>
                      )}
                      <form
                        onSubmit={(e) => {
                          handleColumnDelete(e, column);
                        }}
                      >
                        <button className="delete-button"></button>
                      </form>
                      <CardCreateForm onSubmit={handleCardCreate} columnId={column.id} />
                      <Droppable droppableId={String(column.id)}>
                        {(provided) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={{ display: 'flex', flexDirection: 'column' }}
                          >
                            {column.cards.map((card, index) => (
                              <Draggable key={card.id} draggableId={String(card.id)} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <CardUI
                                      onSubmitDelete={handleCardDelete}
                                      onSubmitTitleUpdate={handleTitleUpdate}
                                      onSubmitDescriptionUpdate={handleDescriptionUpdate}
                                      onSubmitDeadlineUpdate={handleDeadlineUpdate}
                                      onSubmitStatusUpdate={handleStatusUpdate}
                                      card={card}
                                    />
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  ))}
                </div>
                {!isNewColumn ? (
                  <div className="new-column" onClick={() => setIsNewColumn(true)}>
                    {t('column-new-button')}
                  </div>
                ) : (
                  <form
                    onSubmit={handleColumnCreate}
                    style={{ display: 'flex', flexDirection: 'column' }}
                  >
                    <input
                      className="new-column-name"
                      type="name"
                      placeholder={t('column-name-placeholder')}
                      value={name}
                      autoFocus
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <button className="new-column-create-button" type="submit">
                        {t('column-create-button')}
                      </button>
                      <button
                        className="new-column-cancel-button"
                        type="cancel"
                        onClick={() => setIsNewColumn(false)}
                      >
                        {t('column-cancel-button')}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </DragDropContext>
        </div>
        <button className="work-lang-button" onClick={() => setIsLangChange(!isLangChange)}>
          {i18n.language.toUpperCase()}
        </button>
        {isLangChange ? (
          <div className="work-lang-select">
            <p onClick={() => changeLang('en')}>EN</p>
            <p onClick={() => changeLang('ua')}>UA</p>
            <p onClick={() => changeLang('ru')}>RU</p>
          </div>
        ) : (
          ''
        )}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </main>
    </>
  );
}
