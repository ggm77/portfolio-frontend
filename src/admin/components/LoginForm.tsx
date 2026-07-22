import { useState, type FormEvent } from 'react';
import { ApiError, login } from '../../api/client';

interface Props {
  onSuccess: (accessToken: string) => void;
}

function LoginForm({ onSuccess }: Props) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await login(password);
      onSuccess(res.accessToken);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="admin-login" onSubmit={handleSubmit}>
      <h1>Admin Login</h1>
      <div className="admin-field">
        <label htmlFor="password">비밀번호</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          required
        />
      </div>
      {error && <div className="admin-message error">{error}</div>}
      <button type="submit" className="admin-btn primary" disabled={loading}>
        {loading ? '로그인 중…' : '로그인'}
      </button>
    </form>
  );
}

export default LoginForm;
