import { createContext, useContext, useMemo, useState } from 'react';

const USERS_KEY = 'llm_secure_users';
const CURRENT_USER_KEY = 'llm_secure_current_user';

const AuthContext = createContext(null);

function readUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    const users = raw ? JSON.parse(raw) : [];
    return Array.isArray(users)
      ? users.filter((user) => typeof user?.email === 'string' && typeof user.password === 'string')
      : [];
  } catch {
    return [];
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function readCurrentUser() {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    const user = raw ? JSON.parse(raw) : null;
    return typeof user?.id === 'string' && typeof user.email === 'string' ? user : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(readCurrentUser);

  const rememberUser = (user) => {
    try {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } catch {
      // The user can still sign in for the current page session.
    }
    setCurrentUser(user);
  };

  const signup = ({ name, email, company, password }) => {
    if (!name.trim() || !company.trim()) {
      return { ok: false, error: 'Enter your name and organization.' };
    }

    const users = readUsers();
    const normalizedEmail = email.trim().toLowerCase();

    if (users.some((user) => user.email === normalizedEmail)) {
      return { ok: false, error: 'Account already exists for this email.' };
    }

    const newUser = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: normalizedEmail,
      company: company.trim(),
      password,
    };

    const safeUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      company: newUser.company,
    };

    try {
      writeUsers([...users, newUser]);
    } catch {
      return { ok: false, error: 'Unable to save this account in browser storage.' };
    }

    rememberUser(safeUser);
    return { ok: true };
  };

  const login = ({ email, password }) => {
    const users = readUsers();
    const normalizedEmail = email.trim().toLowerCase();

    const matched = users.find(
      (user) => user.email === normalizedEmail && user.password === password
    );

    if (!matched) {
      return { ok: false, error: 'Invalid email or password.' };
    }

    const safeUser = {
      id: matched.id,
      name: matched.name,
      email: matched.email,
      company: matched.company,
    };

    rememberUser(safeUser);
    return { ok: true };
  };

  const logout = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    setCurrentUser(null);
  };

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated: Boolean(currentUser),
      signup,
      login,
      logout,
    }),
    [currentUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
