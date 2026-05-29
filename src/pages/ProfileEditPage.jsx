import React, { useEffect, useState } from 'react';
import useApi from '../hooks/useApi';
import FileUploader from '../components/FileUploader';

export default function ProfileEditPage() {
  const api = useApi();
  const [profile, setProfile] = useState({ name: '', bio: '', skills: [], portfolio: [], avatarUrl: '', resumeUrl: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    // In a real app we'd fetch the current user's profile; here we skip that step.
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  }

  function addSkill() {
    setProfile(prev => ({ ...prev, skills: [...prev.skills, ''] }));
  }

  function setSkill(i, val) {
    setProfile(prev => {
      const skills = [...prev.skills];
      skills[i] = val;
      return { ...prev, skills };
    });
  }

  function removeSkill(i) {
    setProfile(prev => ({ ...prev, skills: prev.skills.filter((s, idx) => idx !== i) }));
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    try {
      // Create profile (simple flow)
      const res = await api.post('/api/profiles', profile);
      setMessage('שמור בהצלחה');
      setProfile(res);
    } catch (err) {
      setMessage('שגיאה בשמירה: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  function handleAvatarUploaded(res) {
    setProfile(prev => ({ ...prev, avatarUrl: res.url }));
  }

  function handleResumeUploaded(res) {
    setProfile(prev => ({ ...prev, resumeUrl: res.url }));
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 20, textAlign: 'right' }}>
      <h1>עריכת פרופיל</h1>
      <div style={{ marginTop: 12 }}>
        <label>שם מלא</label>
        <input name="name" value={profile.name} onChange={handleChange} style={{ width: '100%', padding: 8, marginTop: 6 }} />
      </div>

      <div style={{ marginTop: 12 }}>
        <label>תקציר (Bio)</label>
        <textarea name="bio" value={profile.bio} onChange={handleChange} style={{ width: '100%', padding: 8, marginTop: 6 }} />
      </div>

      <div style={{ marginTop: 12 }}>
        <label>כישורים</label>
        {profile.skills.map((s, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginTop: 6 }}>
            <input value={s} onChange={e => setSkill(i, e.target.value)} style={{ flex: 1, padding: 8 }} />
            <button onClick={() => removeSkill(i)}>הסר</button>
          </div>
        ))}
        <button onClick={addSkill} style={{ marginTop: 8 }}>הוסף כישור</button>
      </div>

      <div style={{ marginTop: 12 }}>
        <label>קישורי פורטפוליו (מופרדים בפסיק)</label>
        <input value={profile.portfolio.join(',')} onChange={e => setProfile(prev => ({ ...prev, portfolio: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))} style={{ width: '100%', padding: 8, marginTop: 6 }} />
      </div>

      <div style={{ marginTop: 12 }}>
        <label>תמונת פרופיל (JPEG/PNG)</label>
        <FileUploader onUploaded={handleAvatarUploaded} accept=".png,.jpg,.jpeg" />
        {profile.avatarUrl && <div style={{ marginTop: 8 }}>תמונה: <a href={profile.avatarUrl} target="_blank">פתח</a></div>}
      </div>

      <div style={{ marginTop: 12 }}>
        <label>קורות חיים (PDF)</label>
        <FileUploader onUploaded={handleResumeUploaded} accept=".pdf" />
        {profile.resumeUrl && <div style={{ marginTop: 8 }}>קורות חיים: <a href={profile.resumeUrl} target="_blank">פתח</a></div>}
      </div>

      <div style={{ marginTop: 20 }}>
        <button onClick={handleSave} disabled={saving} style={{ background: 'var(--primary)', color: 'white', padding: '10px 16px', borderRadius: 8 }}>{saving ? 'שומר...' : 'שמור פרופיל'}</button>
        {message && <div style={{ marginTop: 8 }}>{message}</div>}
      </div>
    </div>
  );
}
