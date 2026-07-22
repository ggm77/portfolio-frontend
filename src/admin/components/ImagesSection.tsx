import { useEffect, useRef, useState, type FormEvent } from 'react';
import { API_ORIGIN, ApiError, deleteImage, getImages, uploadImage } from '../../api/client';
import type { ImageResponse } from '../../api/types';

interface Props {
  token: string;
  onAuthError: (err: unknown) => boolean;
}

function ImagesSection({ token, onAuthError }: Props) {
  const [items, setItems] = useState<ImageResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchItems = () => {
    getImages()
      .then(setItems)
      .catch(() => setMessage({ type: 'error', text: '목록을 불러오지 못했습니다.' }))
      .finally(() => setLoading(false));
  };

  useEffect(fetchItems, []);

  const load = () => {
    setLoading(true);
    fetchItems();
  };

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;
    setUploading(true);
    setMessage(null);
    try {
      await uploadImage(token, file);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setMessage({ type: 'success', text: '업로드했습니다.' });
      load();
    } catch (err) {
      if (!onAuthError(err)) {
        setMessage({
          type: 'error',
          text: err instanceof ApiError ? err.message : '업로드에 실패했습니다.',
        });
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await deleteImage(token, id);
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
        <h2>이미지 업로드</h2>
        <form className="admin-form" onSubmit={handleUpload}>
          <div className="admin-field">
            <label htmlFor="image-file">파일 (png, jpeg, webp, gif)</label>
            <input
              id="image-file"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              ref={fileInputRef}
              required
            />
          </div>
          {message && <div className={`admin-message ${message.type}`}>{message.text}</div>}
          <div className="admin-actions">
            <button type="submit" className="admin-btn primary" disabled={uploading}>
              {uploading ? '업로드 중…' : '업로드'}
            </button>
          </div>
        </form>
      </div>

      <div className="admin-card">
        <h2>목록</h2>
        {loading && <div className="admin-message">불러오는 중…</div>}
        {!loading && items.length === 0 && (
          <div className="admin-message">등록된 이미지가 없습니다.</div>
        )}
        <ul className="admin-image-grid">
          {items.map((img) => (
            <li key={img.id} className="admin-image-item">
              <img src={`${API_ORIGIN}${img.path}`} alt={img.path} />
              <div className="admin-list-sub">{img.path}</div>
              <button type="button" className="admin-btn danger" onClick={() => handleDelete(img.id)}>
                삭제
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ImagesSection;
