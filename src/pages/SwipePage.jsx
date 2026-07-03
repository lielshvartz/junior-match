import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function SwipePage() {
  const [jobs, setJobs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadSwipeData() {
      // 1. בדיקת המשתמש המחובר
      const { data: { user }, authError } = await supabase.auth.getUser();
      if (authError || !user) {
        navigate('/login');
        return;
      }
      setUserId(user.id);

      // 2. שליפת המשרות שהמשתמש עדיין לא סימן (כדי שלא יראה אותן שוב)
      const { data: alreadySwiped } = await supabase
        .from('matches')
        .select('job_id')
        .eq('user_id', user.id);

      const swipedIds = alreadySwiped ? alreadySwiped.map(m => m.job_id) : [];

      let query = supabase.from('jobs').select('*');
      if (swipedIds.length > 0) {
        query = query.not('id', 'in', `(${swipedIds.join(',')})`);
      }

      const { data: availableJobs, error } = await query;

      if (!error) {
        setJobs(availableJobs || []);
      }
      setLoading(false);
    }

    loadSwipeData();
  }, [navigate]);

  async function handleSwipe(isLiked) {
    if (jobs.length === 0 || currentIndex >= jobs.length) return;

    const currentJob = jobs[currentIndex];

    // 3. שמירת הבחירה בטבלת החיבור בענן
    const { error } = await supabase
      .from('matches')
      .insert({
        user_id: userId,
        job_id: currentJob.id,
        is_liked: isLiked
      });

    if (error) {
      console.error('שגיאה בשמירת הבחירה:', error);
      alert('שגיאה בתקשורת עם השרת');
    } else {
      if (isLiked) {
        alert(`נשמר! סימנת לייק למשרת: ${currentJob.title} ב-${currentJob.company} 🎉`);
      }
      // מעבר למשרה הבאה בתור
      setCurrentIndex(prev => prev + 1);
    }
  }

  if (loading) return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>טוען משרות להתאמה... ⏳</h2>;

  const currentJob = jobs[currentIndex];

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', padding: '20px', direction: 'rtl', textAlign: 'center' }}>
      <h1 style={{ color: '#1e293b', marginBottom: '30px' }}>🔥 מצא את המשרה הבאה שלך</h1>

      {!currentJob || currentIndex >= jobs.length ? (
        <div style={{ padding: '40px', border: '1px solid #e2e8f0', borderRadius: '12px', backgroundColor: '#ffffff' }}>
          <h3 style={{ color: '#64748b' }}>סיימת את כל המשרות הזמינות כרגע! 🎉</h3>
          <p style={{ color: '#94a3b8' }}>חזור מאוחר יותר לעדכונים חדשים.</p>
        </div>
      ) : (
        <div style={{ padding: '30px', border: '1px solid #e2e8f0', borderRadius: '16px', backgroundColor: '#ffffff', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', minHeight: '350px', display: 'flex', flexDirection: 'column', justifyContent: 'between' }}>
          <div>
            <span style={{ backgroundColor: '#eff6ff', color: '#3b82f6', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>
              {currentJob.company}
            </span>
            <h2 style={{ color: '#0f172a', margin: '14px 0 6px 0' }}>{currentJob.title}</h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>📍 {currentJob.location}</p>
            
            <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '20px', paddingTop: '15px', textAlign: 'right' }}>
              <strong style={{ color: '#475569' }}>תיאור:</strong>
              <p style={{ color: '#64748b', margin: '4px 0 14px 0', fontSize: '0.95rem', lineHeight: '1.5' }}>{currentJob.description}</p>
              
              <strong style={{ color: '#475569' }}>דרישות:</strong>
              <p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: '0.95rem', lineHeight: '1.5' }}>{currentJob.requirements}</p>
            </div>
          </div>

          {/* כפתורי ה-Swipe */}
          <div style={{ display: 'flex', gap: '20px', marginTop: '30px' }}>
            <button 
              onClick={() => handleSwipe(false)}
              style={{ flex: 1, backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '14px', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.2rem', boxShadow: '0 4px 6px -1px rgba(239,68,68,0.3)' }}
            >
              ❌ דיסלייק
            </button>
            <button 
              onClick={() => handleSwipe(true)}
              style={{ flex: 1, backgroundColor: '#22c55e', color: 'white', border: 'none', padding: '14px', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.2rem', boxShadow: '0 4px 6px -1px rgba(34,197,94,0.3)' }}
            >
              💚 לייק
            </button>
          </div>
        </div>
      )}
    </div>
  );
}