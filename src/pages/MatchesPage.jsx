import React, { useEffect, useState } from 'react';
import useApi from '../hooks/useApi';
import useAuth from '../hooks/useAuth';
import { Link } from 'react-router-dom';

export default function MatchesPage() {
  const api = useApi();
  const { user } = useAuth();
  const [mutuals, setMutuals] = useState([]);

  useEffect(() => {
    if (!user) return;
    async function load() {
      const res = await api.get('/api/matches/mutual/' + user.id);
      setMutuals(res);
    }
    load();
  }, [user]);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'right' }}>
      <h1>התאמות</h1>
      {mutuals.length === 0 && <div>אין התאמות עדיין</div>}
      <ul>
        {mutuals.map(m => (
          <li key={m.id} style={{ marginBottom: 8 }}>
            התאמה עם {m.a === user.id ? m.b : m.a} • <Link to={`/chat/${m.id}`}>פתח צ'אט</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
