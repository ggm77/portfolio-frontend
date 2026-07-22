import { useState } from 'react';
import { ApiError } from '../api/client';
import { clearToken, getToken, setToken } from './auth';
import LoginForm from './components/LoginForm';
import MeSection from './components/MeSection';
import StacksSection from './components/StacksSection';
import ProjectsSection from './components/ProjectsSection';
import HistorySection from './components/HistorySection';
import ImagesSection from './components/ImagesSection';

type Tab = 'me' | 'stacks' | 'projects' | 'history' | 'images';

const TABS: { key: Tab; label: string }[] = [
  { key: 'me', label: '소개' },
  { key: 'stacks', label: '스택' },
  { key: 'projects', label: '프로젝트' },
  { key: 'history', label: '이력' },
  { key: 'images', label: '이미지' },
];

function AdminApp() {
  const [token, setTokenState] = useState<string | null>(() => getToken());
  const [tab, setTab] = useState<Tab>('me');

  const handleLogin = (accessToken: string) => {
    setToken(accessToken);
    setTokenState(accessToken);
  };

  const handleLogout = () => {
    clearToken();
    setTokenState(null);
  };

  // Returns true if the error was an expired/invalid-token 401 and was handled.
  const handleAuthError = (err: unknown): boolean => {
    if (err instanceof ApiError && err.status === 401) {
      handleLogout();
      return true;
    }
    return false;
  };

  if (!token) {
    return (
      <div className="admin-shell">
        <LoginForm onSuccess={handleLogin} />
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <h1>Admin</h1>
        <button type="button" className="admin-btn" onClick={handleLogout}>
          로그아웃
        </button>
      </header>
      <nav className="admin-tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            className={`admin-tab${tab === t.key ? ' active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </nav>
      <main>
        {tab === 'me' && <MeSection token={token} onAuthError={handleAuthError} />}
        {tab === 'stacks' && <StacksSection token={token} onAuthError={handleAuthError} />}
        {tab === 'projects' && <ProjectsSection token={token} onAuthError={handleAuthError} />}
        {tab === 'history' && <HistorySection token={token} onAuthError={handleAuthError} />}
        {tab === 'images' && <ImagesSection token={token} onAuthError={handleAuthError} />}
      </main>
    </div>
  );
}

export default AdminApp;
