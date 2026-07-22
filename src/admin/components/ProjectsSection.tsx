import { useEffect, useState, type FormEvent } from 'react';
import { ApiError, createProject, deleteProject, getProjects, updateProject } from '../../api/client';
import type { ProjectLink, ProjectResponse } from '../../api/types';
import { datetimeLocalToIso, isoToDatetimeLocal, parseLines } from '../format';

interface Props {
  token: string;
  onAuthError: (err: unknown) => boolean;
}

interface FormState {
  name: string;
  tagline: string;
  content: string;
  highlights: string;
  tags: string;
  startAt: string;
  endAt: string;
}

const EMPTY: FormState = {
  name: '',
  tagline: '',
  content: '',
  highlights: '',
  tags: '',
  startAt: '',
  endAt: '',
};

function toForm(p: ProjectResponse): FormState {
  return {
    name: p.name,
    tagline: p.tagline,
    content: p.content,
    highlights: p.highlights.join('\n'),
    tags: p.tags.join(', '),
    startAt: isoToDatetimeLocal(p.startAt),
    endAt: isoToDatetimeLocal(p.endAt),
  };
}

function ProjectsSection({ token, onAuthError }: Props) {
  const [items, setItems] = useState<ProjectResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [links, setLinks] = useState<ProjectLink[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const fetchItems = () => {
    getProjects()
      .then(setItems)
      .catch(() => setMessage({ type: 'error', text: '목록을 불러오지 못했습니다.' }))
      .finally(() => setLoading(false));
  };

  useEffect(fetchItems, []);

  const load = () => {
    setLoading(true);
    fetchItems();
  };

  const startEdit = (p: ProjectResponse) => {
    setEditingId(p.id);
    setForm(toForm(p));
    setLinks(p.links);
    setMessage(null);
  };

  const startCreate = () => {
    setEditingId(null);
    setForm(EMPTY);
    setLinks([]);
    setMessage(null);
  };

  const updateLink = (index: number, field: keyof ProjectLink, value: string) => {
    setLinks(links.map((l, i) => (i === index ? { ...l, [field]: value } : l)));
  };

  const addLink = () => setLinks([...links, { label: '', url: '' }]);
  const removeLink = (index: number) => setLinks(links.filter((_, i) => i !== index));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    const payload = {
      name: form.name,
      tagline: form.tagline,
      content: form.content,
      highlights: parseLines(form.highlights),
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      links: links.filter((l) => l.label.trim() && l.url.trim()),
      startAt: datetimeLocalToIso(form.startAt),
      endAt: form.endAt ? datetimeLocalToIso(form.endAt) : null,
    };
    try {
      if (editingId != null) {
        await updateProject(token, editingId, payload);
      } else {
        await createProject(token, payload);
      }
      setForm(EMPTY);
      setLinks([]);
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
      await deleteProject(token, id);
      if (editingId === id) {
        setEditingId(null);
        setForm(EMPTY);
        setLinks([]);
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
        <h2>{editingId != null ? '프로젝트 수정' : '프로젝트 등록'}</h2>
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-field">
            <label htmlFor="project-name">이름 (최대 100자)</label>
            <input
              id="project-name"
              value={form.name}
              maxLength={100}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="admin-field">
            <label htmlFor="project-tagline">한 줄 소개 (최대 200자)</label>
            <input
              id="project-tagline"
              value={form.tagline}
              maxLength={200}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              required
            />
          </div>
          <div className="admin-field">
            <label htmlFor="project-content">내용 (최대 4096자)</label>
            <textarea
              id="project-content"
              value={form.content}
              maxLength={4096}
              rows={6}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              required
            />
          </div>
          <div className="admin-field">
            <label htmlFor="project-highlights">하이라이트 (한 줄에 하나씩)</label>
            <textarea
              id="project-highlights"
              value={form.highlights}
              rows={3}
              onChange={(e) => setForm({ ...form, highlights: e.target.value })}
            />
          </div>
          <div className="admin-field">
            <label htmlFor="project-tags">태그 (쉼표로 구분)</label>
            <input
              id="project-tags"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
            />
          </div>
          <div className="admin-field">
            <label>링크</label>
            <div className="admin-link-rows">
              {links.map((link, i) => (
                <div key={i} className="admin-link-row">
                  <input
                    placeholder="라벨 (예: GitHub)"
                    value={link.label}
                    maxLength={50}
                    onChange={(e) => updateLink(i, 'label', e.target.value)}
                  />
                  <input
                    placeholder="URL"
                    value={link.url}
                    maxLength={500}
                    onChange={(e) => updateLink(i, 'url', e.target.value)}
                  />
                  <button type="button" className="admin-btn danger" onClick={() => removeLink(i)}>
                    삭제
                  </button>
                </div>
              ))}
            </div>
            <button type="button" className="admin-btn" onClick={addLink}>
              링크 추가
            </button>
          </div>
          <div className="admin-field-row">
            <div className="admin-field">
              <label htmlFor="project-start">시작일</label>
              <input
                id="project-start"
                type="datetime-local"
                value={form.startAt}
                onChange={(e) => setForm({ ...form, startAt: e.target.value })}
                required
              />
            </div>
            <div className="admin-field">
              <label htmlFor="project-end">종료일 (진행중이면 비워두기)</label>
              <input
                id="project-end"
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
          <div className="admin-message">등록된 프로젝트가 없습니다.</div>
        )}
        <ul className="admin-list">
          {items.map((p) => (
            <li key={p.id} className="admin-list-item">
              <div>
                <strong>{p.name}</strong>
                <div className="admin-list-sub">
                  {p.tagline} · {p.startAt.slice(0, 10)} ~ {p.endAt ? p.endAt.slice(0, 10) : '진행중'}
                </div>
              </div>
              <div className="admin-actions">
                <button type="button" className="admin-btn" onClick={() => startEdit(p)}>
                  수정
                </button>
                <button type="button" className="admin-btn danger" onClick={() => handleDelete(p.id)}>
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

export default ProjectsSection;
