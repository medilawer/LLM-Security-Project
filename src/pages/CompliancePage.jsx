import { useState } from 'react';
import { useAppData } from '../data/AppDataContext';

function CompliancePage() {
  const { integrations, complianceRuns, runComplianceTest } = useAppData();
  const [suite, setSuite] = useState('Safety Baseline');
  const [model, setModel] = useState(integrations[0]?.model || '');

  const handleSubmit = (event) => {
    event.preventDefault();
    runComplianceTest({ suite, model });
  };

  return (
    <section>
      <div className="page-head">
        <h2>Compliance Testing</h2>
        <p>Run and store basic compliance test results.</p>
      </div>

      <div className="two-col">
        <article className="panel">
          <h3>Run Test</h3>
          <form className="stack-form" onSubmit={handleSubmit}>
            <label>Test Suite</label>
            <input value={suite} onChange={(event) => setSuite(event.target.value)} required />
            <label>Model</label>
            <input value={model} onChange={(event) => setModel(event.target.value)} required />
            <button type="submit" className="primary">Run Compliance Test</button>
          </form>
        </article>

        <article className="panel">
          <h3>Recent Test Runs</h3>
          <table>
            <thead>
              <tr>
                <th>Test Suite</th>
                <th>Model</th>
                <th>Score</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {complianceRuns.map((run) => (
                <tr key={run.id}>
                  <td>{run.suite}</td>
                  <td>{run.model}</td>
                  <td>{run.score}%</td>
                  <td>{run.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
      </div>
    </section>
  );
}

export default CompliancePage;
