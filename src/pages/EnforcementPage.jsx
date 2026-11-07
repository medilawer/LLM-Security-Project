import { useState } from 'react';
import { useAppData } from '../data/AppDataContext';

function EnforcementPage() {
  const { enforcementLogs, evaluatePrompt } = useAppData();
  const [user, setUser] = useState('');
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    try {
      const evaluation = evaluatePrompt({ user, prompt });
      setResult(evaluation);
      setPrompt('');
    } catch (err) {
      setError(err.message);
      setResult(null);
    }
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
            <label htmlFor="enforcement-email">User Email</label>
            <input id="enforcement-email"
              type="email"
              value={user}
              onChange={(event) => setUser(event.target.value)}
              placeholder="analyst@example.com"
              required
            />
            <label htmlFor="enforcement-prompt">Prompt</label>
            <textarea id="enforcement-prompt"
              rows={4}
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Summarize a public weather report"
              required
            />
            <button type="submit" className="primary">Evaluate</button>
          </form>

          {error ? <p role="alert">{error}</p> : null}
          <div role="status">
            {result ? (
              <div className="auth-msg prompt-result">
                Decision: <strong>{result.decision}</strong> | Reason: {result.reason}
              </div>
            ) : null}
          </div>
        </article>

        <article className="panel">
          <h3 id="enforcement-records">Latest Decisions</h3>
          <div className="table-scroll" tabIndex={0} role="region" aria-labelledby="enforcement-records">
            <table>
              <thead>
                <tr>
                  <th scope="col">Time</th>
                  <th scope="col">User</th>
                  <th scope="col">Decision</th>
                  <th scope="col">Reason</th>
                </tr>
              </thead>
              <tbody>
                {enforcementLogs.length === 0 ? (
                  <tr><td colSpan={4}>No prompt checks yet.</td></tr>
                ) : null}
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
          </div>
        </article>
      </div>
    </section>
  );
}

export default EnforcementPage;
