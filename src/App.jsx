import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import { AppDataProvider } from './data/AppDataContext';
import AppLayout from './layout/AppLayout';
import AnalyticsPage from './pages/AnalyticsPage';
import CompliancePage from './pages/CompliancePage';
import DashboardPage from './pages/DashboardPage';
import EnforcementPage from './pages/EnforcementPage';
import IntegrationsPage from './pages/IntegrationsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import UsersPoliciesPage from './pages/UsersPoliciesPage';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <AppDataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<AppLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="users-policies" element={<UsersPoliciesPage />} />
                <Route path="integrations" element={<IntegrationsPage />} />
                <Route path="enforcement" element={<EnforcementPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="compliance" element={<CompliancePage />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AppDataProvider>
    </AuthProvider>
  );
}

export default App;
