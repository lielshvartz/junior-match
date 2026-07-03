import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function JobsFeedPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      // שליפת המשרות מטבלת jobs בענן ממוינות לפי תאריך היצירה שלהן
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('שגיאה בטעינת משרות:', error);
      } else {
        setJobs(data || []);
      }
      setLoading(false);
    }

    fetchJobs();
  }, []);

  if (loading) return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>טוען משרות חמות... ⏳</h2>;

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px', direction: 'rtl' }}>
      <h1 style={{ color: '#1e293b', marginBottom: '30px', borderBottom: '2px solid #38bdf8', paddingBottom: '10px' }}>💡 פיד משרות לג''וניורים</h1>
      
      {jobs.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#64748b', fontSize: '1.2rem' }}>אין משרות זמינות כרגע. בדוק שוב מאוחר יותר!</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {jobs.map((job) => (
            <div 
              key={job.id} 
              style={{ padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', transition: 'transform 0.2s' }}
            >
              <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', marginBottom: '12px' }}>
                <div>
                  <h2 style={{ margin: 0, color: '#0f172a', fontSize: '1.4rem' }}>{job.title}</h2>
                  <p style={{ margin: '4px 0 0 0', color: '#38bdf8', fontWeight: 'bold' }}>{job.company}</p>
                </div>
                <span style={{ backgroundColor: '#f0fdf4', color: '#16a34a', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                  📍 {job.location}
                </span>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ margin: '0 0 6px 0', color: '#475569' }}>תיאור המשרה:</h4>
                <p style={{ margin: 0, color: '#64748b', lineHeight: '1.6' }}>{job.description}</p>
              </div>

              <div>
                <h4 style={{ margin: '0 0 6px 0', color: '#475569' }}>דרישות תפקיד:</h4>
                <p style={{ margin: 0, color: '#64748b', lineHeight: '1.6', whiteSpace: 'pre-line' }}>{job.requirements}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}