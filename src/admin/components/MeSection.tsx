import { useEffect, useState, type FormEvent } from 'react';
import { ApiError, createMe, deleteMe, getMe, updateMe } from '../../api/client';
import type { MeResponse } from '../../api/types';

interface Props {
  token: string;
  onAuthError: (err: unknown) => boolean;
}

interface FormState {
  headline: string;
  subheadline: string;
  tags: string;
  content: string;
}

const EMPTY: FormState = { headline: '', subheadline: '', tags: '', content: '' };

function toForm(me: MeResponse): FormState {
  return {
    headline: me.headline,
    subheadline: me.subheadline,
    tags: me.tags.join(', '),
    content: me.content,
  };
}

function MeSection({ token, onAuthError }: Props) {
  const [existing, setExisting] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  useEffect(() => {
    getMe()
      .then((data) => {
        setExisting(data);
        setForm(toForm(data));
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) {
          setExisting(null);
          setForm(EMPTY);
        } else {
          setMessage({ type: 'error', text: '정보를 불러오지 못했습니다.' });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    const payload = {
      headline: form.headline,
      subheadline: form.subheadline,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      content: form.content,
    };
    try {
      const result = existing ? await updateMe(token, payload) : await createMe(token, payload);
      setExisting(result);
      setForm(toForm(result));
      setMessage({ type: 'success', text: '저장했습니다.' });
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

  const handleDelete = async () => {
    if (!existing) return;
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await deleteMe(token);
      setExisting(null);
      setForm(EMPTY);
      setMessage({ type: 'success', text: '삭제했습니다.' });
    } catch (err) {
      if (!onAuthError(err)) {
        setMessage({
          type: 'error',
          text: err instanceof ApiError ? err.message : '삭제에 실패했습니다.',
        });
      }
    }
  };

  if (loading) return <div className="admin-message">불러오는 중…</div>;

  return (
    <div className="admin-card">
      <h2>{existing ? '소개 정보 수정' : '소개 정보 등록'}</h2>
      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-field">
          <label htmlFor="headline">헤드라인 (최대 300자)</label>
          <input
            id="headline"
            value={form.headline}
            maxLength={300}
            onChange={(e) => setForm({ ...form, headline: e.target.value })}
            required
          />
        </div>
        <div className="admin-field">
          <label htmlFor="subheadline">서브 헤드라인 (최대 500자)</label>
          <input
            id="subheadline"
            value={form.subheadline}
            maxLength={500}
            onChange={(e) => setForm({ ...form, subheadline: e.target.value })}
            required
          />
        </div>
        <div className="admin-field">
          <label htmlFor="tags">태그 (쉼표로 구분)</label>
          <input
            id="tags"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
          />
        </div>
        <div className="admin-field">
          <label htmlFor="content">본문 (최대 2048자)</label>
          <textarea
            id="content"
            value={form.content}
            maxLength={2048}
            rows={8}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            required
          />
        </div>
        {message && <div className={`admin-message ${message.type}`}>{message.text}</div>}
        <div className="admin-actions">
          <button type="submit" className="admin-btn primary" disabled={saving}>
            {saving ? '저장 중…' : '저장'}
          </button>
          {existing && (
            <button type="button" className="admin-btn danger" onClick={handleDelete}>
              삭제
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default MeSection;
