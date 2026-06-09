import { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS } from '@/constants';

const UserContext = createContext(null);

/**
 * Provides the current userId and email across the app.
 * The userId is persisted in localStorage.
 */
export function UserProvider({ children }) {
  const [userId, setUserIdState] = useState(
    () => localStorage.getItem(STORAGE_KEYS.USER_ID) || ''
  );
  const [userEmail, setUserEmailState] = useState(
    () => localStorage.getItem(STORAGE_KEYS.USER_EMAIL) || ''
  );

  const setUserId = (id) => {
    setUserIdState(id);
    localStorage.setItem(STORAGE_KEYS.USER_ID, id);
  };

  const setUserEmail = (email) => {
    setUserEmailState(email);
    localStorage.setItem(STORAGE_KEYS.USER_EMAIL, email);
  };

  return (
    <UserContext.Provider value={{ userId, setUserId, userEmail, setUserEmail }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
