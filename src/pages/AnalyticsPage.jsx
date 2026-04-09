import { useMemo } from 'react';
import { useAppData } from '../data/AppDataContext';

function AnalyticsPage() {
  const { enforcementLogs } = useAppData();

  const topUsers = useMemo(() => {
    const map = {};
    for (const log of enforcementLogs) {
      map[log.user] = (map[log.user] || 0) + 1;
    }
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [enforcementLogs]);

  const violationBreakdown = useMemo(() => {
    const blocked = enforcementLogs.filter((log) => log.decision === 'Blocked');
    const total = blocked.length || 1;

    const labels = {
      jailbreak: 0,
      pii: 0,
      other: 0,
    };

    blocked.forEach((log) => {
      const reason = log.reason.toLowerCase();
      if (reason.includes('jailbreak')) labels.jailbreak += 1;
      else if (reason.includes('category') || reason.includes('pii')) labels.pii += 1;
      else labels.other += 1;
    });

    return [
      { label: 'Jailbreak Related', value: `${Math.round((labels.jailbreak / total) * 100)}%` },
      { label: 'Restricted Category / PII', value: `${Math.round((labels.pii / total) * 100)}%` },
      { label: 'Other', value: `${Math.round((labels.other / total) * 100)}%` },
    ];
  }, [enforcementLogs]);

  return (
    <section>
      <div className="page-head">
        <h2>Analytics</h2>
        <p>Automatically calculated from enforcement events.</p>
      </div>

      <div className="two-col">
        <article className="panel">
          <h3>Top Active Users</h3>
          <ul className="plain-list">
            {topUsers.map(([user, count]) => (
              <li key={user}>{user} - {count} requests</li>
            ))}
            {topUsers.length === 0 ? <li>No activity yet.</li> : null}
          </ul>
        </article>

        <article className="panel">
          <h3>Violation Breakdown</h3>
          <ul className="plain-list">
            {violationBreakdown.map((item) => (
              <li key={item.label}>{item.label}: {item.value}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}

export default AnalyticsPage;
