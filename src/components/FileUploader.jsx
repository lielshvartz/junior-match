import React, { useState } from 'react';
import useApi from '../hooks/useApi';

export default function FileUploader({ onUploaded, accept = '.png,.jpg,.jpeg,.pdf' }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const api = useApi();

  async function handle(e) {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.uploadFile(file);
      onUploaded(res);
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <input type="file" accept={accept} onChange={handle} />
      {loading && <div>מעלה קובץ...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
}
