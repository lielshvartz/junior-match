import React, { useEffect, useState } from 'react';
import useApi from '../hooks/useApi';
import SwipeDeck from '../components/SwipeDeck';
import useAuth from '../hooks/useAuth';

export default function SwipePage() {
  const api = useApi();
  const { user } = useAuth();
  const [cards, setCards] = useState([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    async function load() {
      try {
        if (user?.role === 'employer') {
          const profiles = await api.get('/api/profiles');
          setCards(profiles);
        } else {
          const jobs = await api.get('/api/jobs');
          setCards(jobs);
        }
      } catch (err) {
        setStatus('שגיאה בטעינה');
      }
    }
    load();
  }, [user]);

  async function record(action, item) {
    if (!user) return setStatus('אנא היכנס');
    try {
      await api.post('/api/matches/swipe', { fromId: user.id, toId: item.id, type: action, target: user?.role === 'employer' ? 'profile' : 'job' });
      setStatus(action === 'like' ? 'התאהבתם!' : 'נדחה');
    } catch (err) {
      setStatus('שגיאה');
    }
  }

  return (
    <div style={{ padding: 20, textAlign: 'center' }}>
      <h1>Swipe</h1>
      <SwipeDeck items={cards} onSwipe={(action, item) => record(action, item)} />
      {status && <div style={{ marginTop: 12 }}>{status}</div>}
    </div>
  );
}
