import React, { useEffect, useState } from 'react';
import useApi from '../hooks/useApi';
import useAuth from '../hooks/useAuth';

export default function JobsFeedPage() {
  const api = useApi();
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({ tech: '', location: '', type: '' });
  const [creating, setCreating] = useState(false);
  const [jobForm, setJobForm] = useState({ title: '', company: '', description: '', tech: '', location: '', type: 'fulltime' });

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const qs = new URLSearchParams(filters);
    const res = await api.get('/api/jobs' + (qs.toString() ? ('?' + qs.toString()) : ''));
    setJobs(res);
  }

  async function createJob() {
    setCreating(true);
    try {
      await api.post('/api/jobs', { ...jobForm, tech: jobForm.tech ? jobForm.tech.split(',').map(s => s.trim()) : [] });
      setJobForm({ title: '', company: '', description: '', tech: '', location: '', type: 'fulltime' });
      load();
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  }

  function handleFilterChange(e) {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'right' }}>
      <h1>פיד משרות 💼</h1>
      <div style={{ display: 'flex', gap: 12, marginTop: 12, marginBottom: 12 }}>
        <input name="tech" placeholder="טכנולוגיה" value={filters.tech} onChange={handleFilterChange} />
        <input name="location" placeholder="מיקום" value={filters.location} onChange={handleFilterChange} />
        <select name="type" value={filters.type} onChange={handleFilterChange}>
          <option value="">כל סוגי המשרות</option>
          <option value="fulltime">מלאה</option>
          <option value="parttime">חלקית</option>
          <option value="contract">פרילנס</option>
        </select>
        <button onClick={load}>סנן</button>
      </div>

      {user?.role === 'employer' && (
        <div style={{ marginBottom: 12, textAlign: 'right' }}>
          <h3>פרסם משרה חדשה</h3>
          <input placeholder="כותרת" value={jobForm.title} onChange={e => setJobForm(prev => ({ ...prev, title: e.target.value }))} />
          <input placeholder="חברה" value={jobForm.company} onChange={e => setJobForm(prev => ({ ...prev, company: e.target.value }))} />
          <input placeholder="מיקום" value={jobForm.location} onChange={e => setJobForm(prev => ({ ...prev, location: e.target.value }))} />
          <input placeholder="טכנולוגיות (קומה): React,Node" value={jobForm.tech} onChange={e => setJobForm(prev => ({ ...prev, tech: e.target.value }))} />
          <textarea placeholder="תיאור" value={jobForm.description} onChange={e => setJobForm(prev => ({ ...prev, description: e.target.value }))} />
          <div style={{ marginTop: 8 }}>
            <button onClick={createJob} disabled={creating} style={{ background: 'var(--primary)', color: 'white', padding: '8px 12px', borderRadius: 8 }}>{creating ? 'מפרסם...' : 'פרסם'}</button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
        {jobs.map(job => (
          <div key={job.id} style={{ background: 'var(--card-bg)', padding: 12, borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', textAlign: 'right' }}>
            <h3 style={{ color: 'var(--primary)' }}>{job.title}</h3>
            <div style={{ color: 'var(--text-muted)' }}>{job.company} • {job.location}</div>
            <p style={{ marginTop: 8 }}>{job.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}