import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';

export default function MatchesPage() {
  const [mutuals, setMutuals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMatches() {
      try {
        const { data, error } = await supabase
          .from('matches')
          .select('*');

        if (error) throw error;
        setMutuals(data || []);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    }

    loadMatches();
  }, []);

  if (loading) return <div style={{ maxWidth: 900, margin: '40px auto', textAlign: 'center' }}>טוען...</div>;

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', textAlign: 'right', padding: '0 20px' }}>
      <h1>התאמות פעילות ({mutuals.length})</h1>
      {mutuals.length === 0 ? (
        <div>אין התאמות כרגע</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {mutuals.map(m => (
            <li 
              key={m.id} 
              style={{ 
                marginBottom: 12, 
                padding: '16px', 
                border: '1px solid #cbd5e1', 
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#fff'
              }}
            >
              <span>
                <strong>התאמה למשרה #{m.job_id}</strong>
              </span>
              <Link 
                to={`/chat/${m.id}`} 
                style={{
                  background: '#2563eb',
                  color: '#fff',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontWeight: 'bold'
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