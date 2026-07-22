import { useEffect, useState, type FormEvent } from 'react';
import { ApiError, createStack, deleteStack, getStacks, updateStack } from '../../api/client';
import type { StackResponse } from '../../api/types';

interface Props {
  token: string;
  onAuthError: (err: unknown) => boolean;
}

interface FormState {
  name: string;
  content: string;
}

const EMPTY: FormState = { name: '', content: '' };

function toForm(s: StackResponse): FormState {
  return { name: s.name, content: s.content.join(', ') };
}

function StacksSection({ token, onAuthError }: Props) {
  const [items, setItems] = useState<StackResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const fetchItems = () => {
    getStacks()
      .then(setItems)
      .catch(() => setMessage({ type: 'error', text: '목록을 불러오지 못했습니다.' }))
      .finally(() => setLoading(false));
  };

  useEffect(fetchItems, []);

  const load = () => {
    setLoading(true);
    fetchItems();
  };

  const startEdit = (s: StackResponse) => {
    setEditingId(s.id);
    setForm(toForm(s));
    setMessage(null);
  };

  const startCreate = () => {
    setEditingId(null);
    setForm(EMPTY);
    setMessage(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    const payload = {
      name: form.name,
      content: form.content
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };
    try {
      if (editingId != null) {
        await updateStack(token, editingId, payload);
      } else {
        await createStack(token, payload);
      }
      setForm(EMPTY);
      setEditingId(null);
      setMessage({ type: 'success', text: '저장했습니다.' });
      load();
    } catch (err) {
      if (!onAuthError(err)) {
        setMessage({
          type: 'error',
          text: err instanceof ApiError ? err.message : '저장에 실패했습니다.',
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await deleteStack(token, id);
      if (editingId === id) {
        setEditingId(null);
        setForm(EMPTY);
      }
      load();
    } catch (err) {
      if (!onAuthError(err)) {
        setMessage({
          type: 'error',
          text: err instanceof ApiError ? err.message : '삭제에 실패했습니다.',
        });
      }
    }
  };

  return (
    <div>
      <div className="admin-card">
        <h2>{editingId != null ? '스택 수정' : '스택 등록'}</h2>
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-field">
            <label htmlFor="stack-name">이름 (최대 100자)</label>
            <input
              id="stack-name"
              value={form.name}
              maxLength={100}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="admin-field">
            <label htmlFor="stack-content">항목 (쉼표로 구분)</label>
            <input
              id="stack-content"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              required
            />
          </div>
          {message && <div className={`admin-message ${message.type}`}>{message.text}</div>}
          <div className="admin-actions">
            <button type="submit" className="admin-btn primary" disabled={saving}>
              {saving ? '저장 중…' : editingId != null ? '수정' : '등록'}
            </button>
            {editingId != null && (
              <button type="button" className="admin-btn" onClick={startCreate}>
                취소
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="admin-card">
        <h2>목록</h2>
        {loading && <div className="admin-message">불러오는 중…</div>}
        {!loading && items.length === 0 && (
          <div className="admin-message">등록된 스택이 없습니다.</div>
        )}
        <ul className="admin-list">
          {items.map((s) => (
            <li key={s.id} className="admin-list-item">
              <div>
                <strong>{s.name}</strong>
                <div className="admin-list-sub">{s.content.join(', ')}</div>
              </div>
              <div className="admin-actions">
                <button type="button" className="admin-btn" onClick={() => startEdit(s)}>
                  수정
                </button>
                <button type="button" className="admin-btn danger" onClick={() => handleDelete(s.id)}>
                  삭제
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default StacksSection;
