import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import BoardCreateButton from './BoardCreateButton';
import '../styles/BoardsPanel.css';

export default function BoardsPanel() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [boards, setBoards] = useState([]);
  const [boardId, setBoardId] = useState(null);
  const [newBoardName, setNewBoardName] = useState('');
  const [deleteBoardId, setDeleteBoardId] = useState(null);

  useEffect(() => {
    const fetchBoards = async () => {
      setError('');

      try {
        const response = await api.get('/api/board/user/boards');
        setBoards(response.data);
      } catch (err) {
        const message = err.response?.data?.message || err.response?.data || err.message;
        setError(message);
      }
    };
    fetchBoards();
  }, []);

  const handleBoardCreate = async (e, boardData) => {
    e.preventDefault();
    setError('');

    const url = '/api/board/create';
    const { boardName } = boardData;
    const payload = { boardName };

    try {
      await api.post(url, payload);

      const updatedBoards = await api.get('/api/board/user/boards');
      setBoards(updatedBoards.data);
    } catch (err) {
      const message =
        err.updatedBoards?.data?.message ||
        err.updatedBoards?.data ||
        err.message ||
        'Что-то пошло не так';
      setError(message + '. Ошибка тут');
    }
  };

  const handleBoardDelete = async (e) => {
    e.preventDefault();
    setError('');

    const url = `/api/board/delete?id=${deleteBoardId}`;

    try {
      await api.delete(url);
      setDeleteBoardId(null);

      const updatedBoards = await api.get('/api/board/user/boards');
      setBoards(updatedBoards.data);
    } catch (err) {
      const message = err.updatedBoards?.data?.message || err.updatedBoards?.data || err.message;
      setError(message);
    }
  };

  const handleBoardRename = async (id) => {
    const url = '/api/board/update-name';
    const payload = { id, newBoardName };

    try {
      await api.patch(url, payload);
      setBoardId(null);

      const updatedBoards = await api.get('/api/board/user/boards');
      setBoards(updatedBoards.data);
    } catch (err) {
      const message = err.updatedBoards?.data?.message || err.updatedBoards?.data || err.message;
      setError(message);
    }
  };

  return (
    <div style={{ padding: '2rem', paddingBottom: '0  px' }}>
      {boards.length === 0 ? (
        <BoardCreateButton onSubmit={handleBoardCreate} />
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          <BoardCreateButton onSubmit={handleBoardCreate} />
          {boards.map((board) => (
            <div
              key={board.id}
              className="board"
              onClick={() => {
                navigate(`/board/${board.id}`);
              }}
            >
              {boardId === board.id ? (
                <input
                  className="board-new-name"
                  type="text"
                  value={newBoardName}
                  onChange={(e) => setNewBoardName(e.target.value)}
                  required
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                  onBlur={() => handleBoardRename(board.id)}
                />
              ) : (
                <p
                  className="board-panel-board-name"
                  onClick={(e) => {
                    e.stopPropagation();
                    setBoardId(board.id);
                    setNewBoardName(board.name);
                  }}
                >
                  {board.name}
                </p>
              )}
              <form onSubmit={handleBoardDelete}>
                <button
                  className="board-delete-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteBoardId(board.id);
                  }}
                ></button>
              </form>
            </div>
          ))}
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
