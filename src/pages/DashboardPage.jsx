import StatCard from '../components/StatCard';
import { useAppData } from '../data/AppDataContext';

function DashboardPage() {
  const { policies, integrations, enforcementLogs, complianceRuns } = useAppData();

  const blockedCount = enforcementLogs.filter((log) => log.decision === 'Blocked').length;
  const passCount = complianceRuns.filter((run) => run.result === 'Pass').length;

  const stats = [
    { label: 'Policy Rules', value: String(policies.length) },
    { label: 'Connected Models', value: String(integrations.length) },
    { label: 'Enforcement Events', value: String(enforcementLogs.length) },
    { label: 'Compliance Passes', value: `${passCount}/${complianceRuns.length || 0}` },
  ];

  return (
    <section>
      <div className="page-head">
        <h2>Dashboard</h2>
        <p>Live overview from data created on your project pages.</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </div>

      <div className="panel">
        <h3>Security Snapshot</h3>
        <ul className="plain-list">
          <li>Blocked requests: {blockedCount}</li>
          <li>Allowed requests: {enforcementLogs.length - blockedCount}</li>
          <li>Online integrations: {integrations.filter((item) => item.status === 'Online').length}</li>
          <li>Active policies: {policies.filter((policy) => policy.status === 'Active').length}</li>
        </ul>
      </div>
    </section>
  );
}

export default DashboardPage;
