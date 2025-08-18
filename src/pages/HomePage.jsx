import api from '../utils/api';
import Sidebar from '../components/Sidebar';
import BoardsPanel from '../components/BoardsPanel';
import ChangeUsernamePanel from '../components/ChangeUsernamePanel';
import ChangePasswordPanel from '../components/ChangePasswordPanel';
import ChangeEmailPanel from '../components/ChangeEmailPanel';
import DeleteUserPanel from '../components/DeleteUserPanel.jsx';
import '../styles/HomePage.css';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState(localStorage.getItem('activeTab') || 'boards');

  const fetchUser = async () => {
    const response = await api.get('/api/user/me');
    setUser(response.data);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  const renderTab = () => {
    switch (activeTab) {
      case 'boards':
        return <BoardsPanel />;
      case 'changeUsername':
        return <ChangeUsernamePanel />;
      case 'changePassword':
        return <ChangePasswordPanel />;
      case 'changeEmail':
        return <ChangeEmailPanel />;
      case 'deleteUser':
        return <DeleteUserPanel />;
      default:
        return <div>Tab</div>;
    }
  };

  return (
    <>
      <header className="home-header">
        <span>Demo webapp kanban</span>
        <span style={{ right: '0px' }}>{user?.username}</span>
      </header>
      <main style={{ display: 'flex', minHeight: 'calc(100vh - 60px)' }}>
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div style={{ flex: 1 }}>{renderTab()}</div>
      </main>
    </>
  );
}
