import { Link } from 'react-router-dom';

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
      <div style={{ display: 'flex', gap: '15px' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>בית</Link>
        <Link to="/jobs" style={{ color: 'white', textDecoration: 'none' }}>משרות</Link>
        <Link to="/profile" style={{ color: 'white', textDecoration: 'none' }}>פרופיל</Link>
      </div>
    </nav>
  );
}
