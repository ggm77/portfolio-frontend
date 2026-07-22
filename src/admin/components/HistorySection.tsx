import { useEffect, useState, type FormEvent } from 'react';
import { ApiError, createHistory, deleteHistory, getHistory, updateHistory } from '../../api/client';
import type { HistoryResponse } from '../../api/types';
import { datetimeLocalToIso, isoToDatetimeLocal } from '../format';

interface Props {
  token: string;
  onAuthError: (err: unknown) => boolean;
}

interface FormState {
  club_name: string;
  project_name: string;
  content: string;
  startAt: string;
  endAt: string;
}

const EMPTY: FormState = { club_name: '', project_name: '', content: '', startAt: '', endAt: '' };

function toForm(h: HistoryResponse): FormState {
  return {
    club_name: h.club_name,
    project_name: h.project_name,
    content: h.content,
    startAt: isoToDatetimeLocal(h.startAt),
    endAt: isoToDatetimeLocal(h.endAt),
  };
}

function HistorySection({ token, onAuthError }: Props) {
  const [items, setItems] = useState<HistoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const fetchItems = () => {
    getHistory()
      .then(setItems)
      .catch(() => setMessage({ type: 'error', text: '목록을 불러오지 못했습니다.' }))
      .finally(() => setLoading(false));
  };

  useEffect(fetchItems, []);

  const load = () => {
    setLoading(true);
    fetchItems();
  };

  const startEdit = (h: HistoryResponse) => {
    setEditingId(h.id);
    setForm(toForm(h));
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
      club_name: form.club_name,
      project_name: form.project_name,
      content: form.content,
      startAt: datetimeLocalToIso(form.startAt),
      ...(form.endAt ? { endAt: datetimeLocalToIso(form.endAt) } : {}),
    };
    try {
      if (editingId != null) {
        await updateHistory(token, editingId, payload);
      } else {
        await createHistory(token, payload);
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
      await deleteHistory(token, id);
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
        <h2>{editingId != null ? '이력 수정' : '이력 등록'}</h2>
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-field-row">
            <div className="admin-field">
              <label htmlFor="history-club">단체명 (최대 100자)</label>
              <input
                id="history-club"
                value={form.club_name}
                maxLength={100}
                onChange={(e) => setForm({ ...form, club_name: e.target.value })}
                required
              />
            </div>
            <div className="admin-field">
              <label htmlFor="history-project">프로젝트명 (최대 100자)</label>
              <input
                id="history-project"
                value={form.project_name}
                maxLength={100}
                onChange={(e) => setForm({ ...form, project_name: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="admin-field">
            <label htmlFor="history-content">내용 (최대 500자)</label>
            <textarea
              id="history-content"
              value={form.content}
              maxLength={500}
              rows={4}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              required
            />
          </div>
          <div className="admin-field-row">
            <div className="admin-field">
              <label htmlFor="history-start">시작일</label>
              <input
                id="history-start"
                type="datetime-local"
                value={form.startAt}
                onChange={(e) => setForm({ ...form, startAt: e.target.value })}
                required
              />
            </div>
            <div className="admin-field">
              <label htmlFor="history-end">종료일 (진행중이면 비워두기)</label>
              <input
                id="history-end"
                type="datetime-local"
                value={form.endAt}
                onChange={(e) => setForm({ ...form, endAt: e.target.value })}
              />
            </div>
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
          <div className="admin-message">등록된 이력이 없습니다.</div>
        )}
        <ul className="admin-list">
          {items.map((h) => (
            <li key={h.id} className="admin-list-item">
              <div>
                <strong>
                  {h.club_name} · {h.project_name}
                </strong>
                <div className="admin-list-sub">
                  {h.startAt.slice(0, 10)} ~ {h.endAt ? h.endAt.slice(0, 10) : '진행중'}
                </div>
              </div>
              <div className="admin-actions">
                <button type="button" className="admin-btn" onClick={() => startEdit(h)}>
                  수정
                </button>
                <button type="button" className="admin-btn danger" onClick={() => handleDelete(h.id)}>
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

export default HistorySection;
