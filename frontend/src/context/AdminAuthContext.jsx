import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as adminApi from '../api/adminApi.js';
import { getErrorMessage } from '../utils/apiError.js';
import { onUnauthorized } from '../utils/authEvents.js';

const SESSION_FLAG_KEY = 'floodAlert.isAdminAuthenticated';

const AdminAuthContext = createContext(null);

/**
 * The backend uses server-side sessions (JSESSIONID cookie), not a JWT, so
 * there is no token to inspect client-side. This context keeps an
 * optimistic "am I logged in" flag in sessionStorage (set on successful
 * login, cleared on logout) and relies on the Axios 401 interceptor to
 * correct it the moment the server disagrees (e.g. session expired).
 */
export function AdminAuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem(SESSION_FLAG_KEY) === 'true'
  );

  useEffect(() => {
    return onUnauthorized(() => {
      setIsAuthenticated(false);
      sessionStorage.removeItem(SESSION_FLAG_KEY);
    });
  }, []);

  const login = useCallback(async (username, password) => {
    try {
      await adminApi.login(username, password);
      setIsAuthenticated(true);
      sessionStorage.setItem(SESSION_FLAG_KEY, 'true');
      return { success: true };
    } catch (err) {
      return { success: false, message: getErrorMessage(err, 'Invalid username or password.') };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await adminApi.logout();
    } catch {
      // Best-effort: even if the network call fails, clear local state so
      // the UI reflects a logged-out session.
    }
    setIsAuthenticated(false);
    sessionStorage.removeItem(SESSION_FLAG_KEY);
  }, []);

  const value = useMemo(() => ({ isAuthenticated, login, logout }), [isAuthenticated, login, logout]);

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
