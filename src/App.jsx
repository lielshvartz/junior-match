import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// ייבוא רכיבים משותפים
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// ייבוא העמודים החדשים
import LandingPage from './pages/LandingPage';
import JobsFeedPage from './pages/JobsFeedPage';
import ProfilePage from './pages/ProfilePage';
import ProfileEditPage from './pages/ProfileEditPage';
import SwipePage from './pages/SwipePage';
import Chat from './components/Chat';
import MatchesPage from './pages/MatchesPage';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', direction: 'rtl' }}>
        <Navbar />
        
        <main style={{ flex: 1, padding: '40px', textAlign: 'center', backgroundColor: '#f1f5f9' }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/jobs" element={<JobsFeedPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/edit" element={<ProfileEditPage />} />
            <Route path="/swipe" element={<SwipePage />} />
            <Route path="/matches" element={<MatchesPage />} />
            <Route path="/chat/:matchId" element={<Chat />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;