import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function BoardCreateButton({ onSubmit }) {
  const [isBoard, setIsBoard] = useState(false);
  const [boardName, setBoardName] = useState('');
  const [t] = useTranslation('global');

  const handleBoardCreate = (e) => {
    const boardData = {
      boardName,
    };

    onSubmit(e, boardData);
    setBoardName('');
    setIsBoard(false);
  };
  return (
    <div>
      {!isBoard ? (
        <button
          className="inactive-board-create-button"
          type="button"
          onClick={() => setIsBoard(!isBoard)}
        >
          +
        </button>
      ) : (
        <div>
          <button
            className="active-board-create-button"
            type="button"
            onClick={() => setIsBoard(!isBoard)}
          >
            +
          </button>
          <form className="board-form" onSubmit={handleBoardCreate}>
            <input
              className="new-board-name"
              type="name"
              placeholder={t('boards-name-placeholder')}
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              required
            />
            <div className="board-buttons-placeholder">
              <button className="board-button" type="submit">
                {t('boards-create-button')}
              </button>
              <button className="board-button" type="cancel" onClick={() => setIsBoard(false)}>
                {t('boards-cancel-button')}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
