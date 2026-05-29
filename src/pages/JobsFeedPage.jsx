import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function JobsFeedPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*');

        if (error) throw error;
        setJobs(data);
      } catch (error) {
        console.error('Error fetching jobs:', error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, []);

  if (loading) return <h1 style={{ textAlign: 'center', marginTop: '5px' }}>טוען משרות מתוך Supabase... ⏳</h1>;

  return (
    <div>
      <h1>פיד משרות מה-Backend 💼</h1>
      <p style={{ color: '#64748b' }}>נמצאו {jobs.length} משרות פתוחות במסד הנתונים</p>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center', marginTop: '25px' }}>
        {jobs.map((job) => (
          <div key={job.id} style={{ 
            border: '1px solid #e2e8f0', 
            padding: '24px', 
            borderRadius: '12px', 
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            maxWidth: '350px',
            textAlign: 'right'
          }}>
            <h3 style={{ color: 'var(--primary)', marginBottom: '5px' }}>{job.title}</h3>
            <h4 style={{ color: '#475569', marginBottom: '15px' }}>{job.company_name} 📍 {job.location}</h4>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>{job.description}</p>
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button style={{ backgroundColor: '#10b981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>לייק ❤️</button>
              <button style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>דיסלייק ❌</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}