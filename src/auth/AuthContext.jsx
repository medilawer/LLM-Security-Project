import { createContext, useContext, useMemo, useState } from 'react';

const USERS_KEY = 'llm_secure_users';
const CURRENT_USER_KEY = 'llm_secure_current_user';

const AuthContext = createContext(null);

function readUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
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
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(readCurrentUser);

  const signup = ({ name, email, company, password }) => {
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

    users.push(newUser);
    writeUsers(users);

    const safeUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      company: newUser.company,
    };

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
    setCurrentUser(safeUser);
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

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
    setCurrentUser(safeUser);
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
