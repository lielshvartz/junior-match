import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

function MockLogin() {
  const { user, login, logout } = useAuth();
  if (user) return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <div>{user.name} ({user.role})</div>
      <button onClick={logout} style={{ padding: '6px 8px' }}>יציאה</button>
    </div>
  );
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <button onClick={() => login({ id: 'u1', name: 'Yonatan', role: 'junior' })} style={{ padding: '6px 8px' }}>כניסה Junior</button>
      <button onClick={() => login({ id: 'e1', name: 'Startup', role: 'employer' })} style={{ padding: '6px 8px' }}>כניסה Employer</button>
    </div>
  );
}

export default function Navbar() {
  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      padding: '1rem 2rem', 
      background: '#1e293b', 
      color: 'white' 
    }}>
      <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
        JuniorMatch 🎯
      </div>
      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>בית</Link>
          <Link to="/jobs" style={{ color: 'white', textDecoration: 'none' }}>משרות</Link>
          <Link to="/swipe" style={{ color: 'white', textDecoration: 'none' }}>Swipe</Link>
          <Link to="/profile" style={{ color: 'white', textDecoration: 'none' }}>פרופיל</Link>
          <Link to="/profile/edit" style={{ color: 'white', textDecoration: 'none' }}>ערוך פרופיל</Link>
          <Link to="/matches" style={{ color: 'white', textDecoration: 'none' }}>התאמות</Link>
        </div>
        <MockLogin />
      </div>
    </nav>
  );
}
