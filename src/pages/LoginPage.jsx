import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    const result = login({ email, password });
    if (!result.ok) {
      setError(result.error);
      return;
    }

    navigate('/', { replace: true });
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Login</h1>
        <p>Access your LLM security workspace.</p>

        {error ? <div className="auth-msg error">{error}</div> : null}

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="admin@company.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <button type="submit" className="primary">Sign In</button>
        <p className="auth-switch">
          No account? <Link to="/signup">Create one</Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
