import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Navbar({ session }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 30px', backgroundColor: '#1e293b', color: 'white', direction: 'rtl' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Link to="/" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.2rem' }}>🎯 JuniorMatch</Link>
        
        {/* דפים שפתוחים תמיד */}
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>בית</Link>
        <Link to="/jobs" style={{ color: 'white', textDecoration: 'none' }}>פיד משרות</Link>
        
        {/* דפים שיופיעו רק כשהמשתמש מחובר באמת */}
        {session && (
          <>
            <Link to="/swipe-test" style={{ color: 'white', textDecoration: 'none' }}>Swipe</Link>
            <Link to="/profile" style={{ color: 'white', textDecoration: 'none' }}>פרופיל</Link>
            <Link to="/profile-edit" style={{ color: 'white', textDecoration: 'none' }}>ערוך פרופיל</Link>
            <Link to="/matches" style={{ color: 'white', textDecoration: 'none' }}>התאמות</Link>
          </>
        )}
      </div>

      <div>
        {session ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ color: '#38bdf8', fontSize: '0.9rem' }}>{session.user.email}</span>
            <button onClick={handleLogout} style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>יציאה 🚪</button>
          </div>
        ) : (
          <Link to="/login" style={{ backgroundColor: '#2563eb', color: 'white', textDecoration: 'none', padding: '8px 18px', borderRadius: '6px', fontWeight: 'bold' }}>כניסה / הרשמה 🔐</Link>
        )}
      </div>
    </nav>
  );
}