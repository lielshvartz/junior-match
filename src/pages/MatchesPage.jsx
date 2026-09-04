import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';

export default function MatchesPage() {
  const [mutuals, setMutuals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMatches() {
      try {
        // שליפת כל ההתאמות הפעילות ללא תלות ב-User ID
        const { data: matchesData, error: matchesError } = await supabase
          .from('matches')
          .select('*')
          .eq('is_liked', true);

        if (matchesError) throw matchesError;

        if (matchesData && matchesData.length > 0) {
          const jobIds = matchesData.map(m => m.job_id).filter(Boolean);
          
          let jobsMap = {};
          if (jobIds.length > 0) {
            const { data: jobsData } = await supabase
              .from('jobs')
              .select('id, title, company')
              .in('id', jobIds);

            if (jobsData) {
              jobsData.forEach(job => {
                jobsMap[job.id] = job;
              });
            }
          }

          const combined = matchesData.map(m => ({
            ...m,
            jobs: jobsMap[m.job_id] || { title: `משרה #${m.job_id}`, company: 'חברה' }
          }));

          setMutuals(combined);
        } else {
          setMutuals([]);
        }
      } catch (err) {
        console.error('Error loading matches:', err);
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
                border: '1px solid #cbd5e1', 
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#fff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}
            >
              <span>
                <strong>{m.jobs?.title}</strong> - {m.jobs?.company}
              </span>
              <Link 
                to={`/chat/${m.id}`} 
                style={{
                  background: '#2563eb',
                  color: '#fff',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontWeight: 600
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