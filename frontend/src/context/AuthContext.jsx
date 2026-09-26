import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const ROLE_DEFINITIONS = {
  admin: {
    id: 'admin',
    name: 'Administrator',
    badgeColor: '#ec4899', // pink/rose
    bgBadge: 'rgba(236, 72, 153, 0.15)',
    description: 'Full system CRUD, Spark job execution, system config & telemetry'
  },
  regional_manager: {
    id: 'regional_manager',
    name: 'Regional Manager',
    badgeColor: '#a855f7', // purple
    bgBadge: 'rgba(168, 85, 247, 0.15)',
    description: 'Multi-location operations, regional intelligence & campaign approvals'
  },
  manager: {
    id: 'manager',
    name: 'Store Manager',
    badgeColor: '#0ea5e9', // sky blue
    bgBadge: 'rgba(14, 165, 233, 0.15)',
    description: 'Shift operations, order lifecycle, live inventory & wastage recording'
  },
  analyst: {
    id: 'analyst',
    name: 'Data Analyst',
    badgeColor: '#10b981', // emerald green
    bgBadge: 'rgba(16, 185, 129, 0.15)',
    description: 'What-If simulation sandbox, ML dual pipelines & custom report exports'
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Restore session from localStorage on initialization
  useEffect(() => {
    async function restoreSession() {
      try {
        const storedToken = localStorage.getItem('dineiq_token');
        const storedUserStr = localStorage.getItem('dineiq_user');

        if (storedToken && storedUserStr) {
          const parsedUser = JSON.parse(storedUserStr);
          setToken(storedToken);
          setUser(parsedUser);

          // Validate token with backend /api/v1/auth/me
          try {
            const res = await fetch('/api/v1/auth/me', {
              headers: {
                Authorization: `Bearer ${storedToken}`
              }
            });
            if (res.ok) {
              const data = await res.json();
              if (data.user) {
                setUser(data.user);
                localStorage.setItem('dineiq_user', JSON.stringify(data.user));
              }
            } else if (res.status === 401) {
              // Session expired or token invalidated
              localStorage.removeItem('dineiq_token');
              localStorage.removeItem('dineiq_user');
              setToken(null);
              setUser(null);
            }
          } catch (netErr) {
            // If offline, preserve cached user credentials for seamless offline testing
            console.warn('Auth validation network check skipped (offline/dev):', netErr);
          }
        }
      } catch (e) {
        console.error('Failed to restore session from localStorage:', e);
        localStorage.removeItem('dineiq_token');
        localStorage.removeItem('dineiq_user');
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, []);

  const login = async (username, password) => {
    setAuthError(null);
    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.detail || 'Authentication failed. Please check your credentials.';
        setAuthError(errorMsg);
        return { success: false, error: errorMsg };
      }

      // Successful authentication
      const accessToken = data.access_token;
      const authenticatedUser = data.user;

      localStorage.setItem('dineiq_token', accessToken);
      localStorage.setItem('dineiq_user', JSON.stringify(authenticatedUser));

      setToken(accessToken);
      setUser(authenticatedUser);
      setAuthError(null);

      return { success: true, user: authenticatedUser };
    } catch (err) {
      const msg = err.message || 'Network error while attempting to log in';
      setAuthError(msg);
      return { success: false, error: msg };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch('/api/v1/auth/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    } catch (e) {
      console.warn('Backend logout notification skipped:', e);
    } finally {
      localStorage.removeItem('dineiq_token');
      localStorage.removeItem('dineiq_user');
      setToken(null);
      setUser(null);
      setAuthError(null);
    }
  };

  const hasRole = (allowedRoles) => {
    if (!allowedRoles || allowedRoles.length === 0 || allowedRoles.includes('*')) {
      return true;
    }
    if (!user || !user.role_id) {
      return false;
    }
    return allowedRoles.includes(user.role_id);
  };

  const roleMeta = user && user.role_id && ROLE_DEFINITIONS[user.role_id]
    ? ROLE_DEFINITIONS[user.role_id]
    : {
        id: user?.role_id || 'unknown',
        name: user?.role_id ? user.role_id.replace('_', ' ').toUpperCase() : 'Guest',
        badgeColor: '#94a3b8',
        bgBadge: 'rgba(148, 163, 184, 0.15)'
      };

  const value = {
    user,
    token,
    role: user?.role_id || null,
    roleMeta,
    loading,
    authError,
    setAuthError,
    login,
    logout,
    hasRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
