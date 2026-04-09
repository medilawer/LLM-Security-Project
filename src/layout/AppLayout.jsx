import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/users-policies', label: 'Users & Policies' },
  { to: '/integrations', label: 'Integrations' },
  { to: '/enforcement', label: 'Enforcement' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/compliance', label: 'Compliance' },
];

function AppLayout() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="shell">
      <aside className="sidebar">
        <h1>LLM Secure</h1>
        <p>Policy Enforcement Platform</p>

        <div className="user-box">
          <strong>{currentUser?.name}</strong>
          <span>{currentUser?.email}</span>
        </div>

        <nav>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button type="button" className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
