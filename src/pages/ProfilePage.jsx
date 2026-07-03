import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfile() {
      // 1. נשלוף את המשתמש הנוכחי שמחובר למערכת
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        navigate('/login');
        return;
      }

      // 2. נשלוף את השורה המתאימה לו מטבלת הפרופילים
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error.message);
      } else {
        setProfile(data);
      }
      setLoading(false);
    }

    fetchProfile();
  }, [navigate]);

  if (loading) return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>טוען נתוני פרופיל... ⏳</h2>;

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', border: '1px solid #e2e8f0', borderRadius: '12px', backgroundColor: '#ffffff', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', direction: 'rtl' }}>
      <h1 style={{ color: '#1e293b', marginBottom: '20px', borderBottom: '2px solid #38bdf8', paddingBottom: '10px' }}>הפרופיל שלי 👤</h1>
      
      {profile ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '1.1rem' }}>
          <div>
            <strong>שם מלא:</strong> <span style={{ color: '#334155' }}>{profile.full_name || 'טרם עודכן'}</span>
          </div>
          <div>
            <strong>ביוגרפיה:</strong> 
            <p style={{ color: '#475569', backgroundColor: '#f8fafc', padding: '10px', borderRadius: '6px', marginTop: '5px', border: '1px solid #f1f5f9' }}>
              {profile.bio || 'אין ביוגרפיה זמינה. לחץ על עריכה כדי להוסיף!'}
            </p>
          </div>
          
          <button 
            onClick={() => navigate('/profile-edit')} 
            style={{ marginTop: '20px', backgroundColor: '#38bdf8', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}
          >
            עריכת פרופיל ✏️
          </button>
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <p>לא נמצאו נתוני פרופיל במסד הנתונים.</p>
          <button onClick={() => navigate('/profile-edit')} style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', marginTop: '10px' }}>
            השלם את הפרופיל שלך עכשיו
          </button>
        </div>
      )}
    </div>
  );
}