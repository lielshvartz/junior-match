import { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

// רכיבים גלובליים
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// כל הדפים מהפרויקט שלך
import LandingPage from './pages/LandingPage';
import JobsFeedPage from './pages/JobsFeedPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import MatchesPage from './pages/MatchesPage';
import ProfileEditPage from './pages/ProfileEditPage';
import SwipePage from './pages/SwipePage';
import Chat from './components/Chat';

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // בדיקה ראשונית של המשתמש מול Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // האזנה חיה להתחברות/התנתקות ב-Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <h1 style={{ textAlign: 'center', marginTop: '50px' }}>טוען אפליקציה... ⏳</h1>;

  return (
    <Router>
      <div className="app-container" style={{ direction: 'rtl', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        
        {/* ה-Navbar המעודכן שמקבל את ה-session האמיתי */}
        <Navbar session={session} />

        <main style={{ flex: 1 }}>
          <Routes>
            {/* דף נחיתה ראשי תמיד נגיש, ומקבל את ה-session כדי להציג מידע מותאם */}
            <Route path="/" element={<LandingPage session={session} />} />
            
            {/* עמוד התחברות והרשמה */}
            <Route path="/login" element={!session ? <LoginPage /> : <Navigate to="/jobs" />} />
            
            {/* נתיבים מוגנים - רק למשתמש מחובר באמת דרך Supabase */}
            <Route path="/jobs" element={session ? <JobsFeedPage /> : <Navigate to="/login" />} />
            <Route path="/profile" element={session ? <ProfilePage /> : <Navigate to="/login" />} />
            <Route path="/profile-edit" element={session ? <ProfileEditPage /> : <Navigate to="/login" />} />
            <Route path="/matches" element={session ? <MatchesPage /> : <Navigate to="/login" />} />
            <Route path="/swipe-test" element={session ? <SwipePage /> : <Navigate to="/login" />} />
            <Route 
              path="/chat/:id" 
              element={session ? <Chat session={session} /> : <Navigate to="/login" />} 
            />
            {/* הגנה לכל כתובת שגויה */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}