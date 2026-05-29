import { useState, useEffect } from 'react';

export default function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem('jm_user');
    if (raw) setUser(JSON.parse(raw));
  }, []);

  function login(profile) {
    localStorage.setItem('jm_user', JSON.stringify(profile));
    setUser(profile);
  }

  function logout() {
    localStorage.removeItem('jm_user');
    setUser(null);
  }

  return { user, login, logout };
}
