import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useApi from '../hooks/useApi';
import useAuth from '../hooks/useAuth';

export default function Chat() {
  const { matchId } = useParams();
  const { user } = useAuth();
  const api = useApi();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    if (!matchId) return;
    async function load() {
      const [msgs, match] = await Promise.all([
        api.get('/api/messages/' + matchId),
        api.get('/api/matches/' + matchId).catch(() => null)
      ]);
      setMessages(msgs);
      setMatch(match);
    }
    load();
  }, [matchId]);

  const [match, setMatch] = useState(null);

  async function send() {
    if (!text || !user || !match) return;
    const other = match.a === user.id ? match.b : match.a;
    const payload = { matchId, fromId: user.id, toId: other, text };
    const res = await api.post('/api/messages', payload);
    setMessages(prev => [...prev, res]);
    setText('');
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'right' }}>
      <h2>צ'אט</h2>
      <div style={{ minHeight: 200, border: '1px solid var(--border)', padding: 12, borderRadius: 8 }}>
        {messages.map(m => (
          <div key={m.id} style={{ marginBottom: 8, textAlign: m.fromId === user?.id ? 'left' : 'right' }}>
            <div style={{ display: 'inline-block', background: m.fromId === user?.id ? 'var(--primary)' : 'var(--card-bg)', color: m.fromId === user?.id ? 'white' : 'inherit', padding: '8px 10px', borderRadius: 8 }}>{m.text}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <input value={text} onChange={e => setText(e.target.value)} style={{ flex: 1, padding: 8 }} />
        <button onClick={send} style={{ background: 'var(--primary)', color: 'white', padding: '8px 12px', borderRadius: 8 }}>שלח</button>
      </div>
    </div>
  );
}
