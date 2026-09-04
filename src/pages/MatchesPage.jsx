import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';

export default function MatchesPage() {
  const [mutuals, setMutuals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMatches() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;
        if (!user) return;

        // שליפת כל ההתאמות שסומנו בלייק עבור המשתמש המחובר ישירות מ-Supabase
        const { data, error } = await supabase
          .from('matches')
          .select(`
            id,
            job_id,
            is_liked,
            jobs (
              id,
              title,
              company
            )
          `)
          .eq('user_id', user.id)
          .eq('is_liked', true);

        if (error) throw error;
        setMutuals(data || []);
      } catch (err) {
        console.error('Error loading matches:', err.message);
      } finally {
        setLoading(false);
      }
    }

    loadMatches();
  }, []);

  if (loading) {
    return <div style={{ maxWidth: 900, margin: '40px auto', textAlign: 'center' }}>טוען התאמות...</div>;
  }

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', textAlign: 'right', padding: '0 20px' }}>
      <h1>התאמות</h1>
      {mutuals.length === 0 ? (
        <div>אין התאמות עדיין</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {mutuals.map(m => (
            <li 
              key={m.id} 
              style={{ 
                marginBottom: 12, 
                padding: '16px', 
                border: '1px solid var(--border, #e2e8f0)', 
                borderRadius: 'var(--radius, 8px)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span>
                <strong>{m.jobs?.title || 'משרה ללא כותרת'}</strong> - {m.jobs?.company || 'חברה לא צוינה'}
              </span>
              <Link 
                to={`/chat/${m.id}`} 
                style={{
                  background: 'var(--primary, #2563eb)',
                  color: '#fff',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontWeight: 500
                }}
              >
                פתח צ'אט
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}