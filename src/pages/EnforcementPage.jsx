import { useState } from 'react';
import { useAppData } from '../data/AppDataContext';

function EnforcementPage() {
  const { enforcementLogs, evaluatePrompt } = useAppData();
  const [user, setUser] = useState('');
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const evaluation = evaluatePrompt({ user, prompt });
    setResult(evaluation);
    setPrompt('');
  };

  return (
    <section>
      <div className="page-head">
        <h2>Policy Enforcement</h2>
        <p>Test prompt decisions against your configured policy keywords.</p>
      </div>

      <div className="two-col">
        <article className="panel">
          <h3>Run Prompt Check</h3>
          <form className="stack-form" onSubmit={handleSubmit}>
            <label>User Email</label>
            <input
              type="email"
              value={user}
              onChange={(event) => setUser(event.target.value)}
              placeholder="analyst@company.com"
              required
            />
            <label>Prompt</label>
            <input
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Write report with account details"
              required
            />
            <button type="submit" className="primary">Evaluate</button>
          </form>

          {result ? (
            <div className="auth-msg" style={{ marginTop: '0.9rem', background: '#eef6ff', border: '1px solid #d3e5ff' }}>
              Decision: <strong>{result.decision}</strong> | Reason: {result.reason}
            </div>
          ) : null}
        </article>

        <article className="panel">
          <h3>Latest Decisions</h3>
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>User</th>
                <th>Decision</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {enforcementLogs.map((log) => (
                <tr key={log.id}>
                  <td>{log.time}</td>
                  <td>{log.user}</td>
                  <td>{log.decision}</td>
                  <td>{log.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
      </div>
    </section>
  );
}

export default EnforcementPage;
