export default function useApi() {
  const base = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

  async function get(path) {
    const res = await fetch(base + path);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  async function post(path, body) {
    const res = await fetch(base + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  async function put(path, body) {
    const res = await fetch(base + path, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  async function del(path) {
    const res = await fetch(base + path, { method: 'DELETE' });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  async function uploadFile(file) {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch(base + '/api/uploads', { method: 'POST', body: form });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  return { get, post, put, del, uploadFile };
}
