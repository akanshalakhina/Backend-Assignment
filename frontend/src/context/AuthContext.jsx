import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import client from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!token) {
      setProfile(null);
      return;
    }

    client
      .get('/auth/me')
      .then((res) => setProfile(res.data.data))
      .catch(() => {
        localStorage.removeItem('token');
        setToken(null);
      });
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      profile,
      isAuthenticated: !!token,
      login: (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
      },
      logout: () => {
        localStorage.removeItem('token');
        setToken(null);
      },
    }),
    [token, profile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
