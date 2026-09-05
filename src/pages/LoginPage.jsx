import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isRegistering) {
        // הרשמה של משתמש חדש
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage('נרשמת בהצלחה! בדוק את תיבת המייל שלך לאישור החשבון ✉️');
      } else {
        // התחברות משתמש קיים
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setMessage('התחברת בהצלחה! 🎉');
        navigate('/jobs'); // ניווט פנימי חלק ללא ריענון דפדפן וללא 404
      }
    } catch (error) {
      setMessage(`שגיאה: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '30px', border: '1px solid #e2e8f0', borderRadius: '12px', backgroundColor: '#fff', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', textAlign: 'right' }}>
      <h2 style={{ textAlign: 'center', color: 'var(--primary)' }}>
        {isRegistering ? 'יצירת חשבון חדש 🚀' : 'התחברות ל-JuniorMatch 🔐'}
      </h2>
      
      <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        <label>אימייל:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
        
        <label>סיסמה:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
        
        <button type="submit" disabled={loading} style={{ backgroundColor: 'var(--primary, #2563eb)', color: 'white', padding: '12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
          {loading ? 'מבצע פעולה...' : isRegistering ? 'הירשם' : 'התחבר'}
        </button>
      </form>

      {message && <p style={{ marginTop: '15px', textAlign: 'center', fontWeight: 'bold', color: message.includes('שגיאה') ? '#ef4444' : '#10b981' }}>{message}</p>}

      <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem', color: '#64748b' }}>
        {isRegistering ? 'כבר יש לך חשבון?' : 'אין לך חשבון עדיין?'} {' '}
        <span onClick={() => setIsRegistering(!isRegistering)} style={{ color: '#2563eb', cursor: 'pointer', textDecoration: 'underline' }}>
          {isRegistering ? 'התחבר כאן' : 'הירשם כאן'}
        </span>
      </p>
    </div>
  );
}