import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function ProfileEditPage() {
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState(''); // סטייט חדש לשמירת המייל
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function getProfile() {
      // 1. נבדוק מי המשתמש המחובר ונשלוף את המייל שלו
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        navigate('/login');
        return;
      }

      setUserId(user.id);
      setEmail(user.email || ''); // שמירת המייל של המשתמש הנוכחי

      // 2. נשלוף את הנתונים הקיימים שלו מטבלת הפרופילים
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id);

      if (data && data.length > 0) {
        setFullName(data[0].full_name || '');
        setBio(data[0].bio || '');
      }
      setLoading(false);
    }

    getProfile();
  }, [navigate]);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);

    // 3. שליחת כל הנתונים הנדרשים כולל עמודת האימייל החשובה
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        full_name: fullName,
        bio: bio,
        email: email // הוספת המייל כדי לפתור את השגיאה
      }, { onConflict: 'id' });

    setSaving(false);

    if (error) {
      console.error('שגיאה מלאה:', error);
      alert('שגיאה בשמירת הנתונים: ' + error.message);
    } else {
      alert('הפרופיל עודכן בהצלחה! 🎉');
      navigate('/profile'); // החזרה לעמוד הפרופיל הראשי
    }
  }

  if (loading) return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>טוען נתונים... ⏳</h2>;

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', border: '1px solid #e2e8f0', borderRadius: '12px', backgroundColor: '#ffffff', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', direction: 'rtl' }}>
      <h1 style={{ color: '#1e293b', marginBottom: '20px', borderBottom: '2px solid #38bdf8', paddingBottom: '10px' }}>עריכת פרופיל ✏️</h1>
      
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontWeight: 'bold', color: '#475569' }}>שם מלא:</label>
          <input 
            type="text" 
            value={fullName} 
            onChange={(e) => setFullName(e.target.value)} 
            required
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontWeight: 'bold', color: '#475569' }}>ביוגרפיה / רקע מקצועי:</label>
          <textarea 
            value={bio} 
            onChange={(e) => setBio(e.target.value)} 
            rows="4"
            placeholder="ספר קצת על עצמך, ניסיון, טכנולוגיות שאתה מכיר..."
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem', resize: 'vertical' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button 
            type="submit" 
            disabled={saving}
            style={{ flex: 1, backgroundColor: '#38bdf8', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}
          >
            {saving ? 'שומר שינויים... ⏳' : 'שמור פרופיל 💾'}
          </button>
          
          <button 
            type="button" 
            onClick={() => navigate('/profile')}
            style={{ backgroundColor: '#94a3b8', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}
          >
            ביטול
          </button>
        </div>
      </form>
    </div>
  );
}