import { useState } from 'react';
import { useAppData } from '../data/AppDataContext';
import { complianceSuites } from '../data/compliance.js';

function CompliancePage() {
  const { integrations, complianceRuns, runComplianceTest } = useAppData();
  const [report, setReport] = useState(null);
  const [suite, setSuite] = useState('Safety Baseline');
  const [model, setModel] = useState(integrations[0]?.model || '');

  const handleSubmit = (event) => {
    event.preventDefault();
    setReport(runComplianceTest({ suite, model }));
  };

  return (
    <section>
      <div className="page-head">
        <h2>Compliance Testing</h2>
        <p>Check configured prompt rules against fixed test cases. The model name is a label; no model API is called.</p>
      </div>

      <div className="two-col">
        <article className="panel">
          <h3>Run Test</h3>
          <form className="stack-form" onSubmit={handleSubmit}>
            <label>Test Suite</label>
            <select value={suite} onChange={(event) => setSuite(event.target.value)}>
              {Object.keys(complianceSuites).map((name) => <option key={name}>{name}</option>)}
            </select>
            <label>Model</label>
            <input value={model} onChange={(event) => setModel(event.target.value)} required />
            <button type="submit" className="primary">Run Compliance Test</button>
          </form>
          {report ? (
            <div aria-live="polite">
              <h3>Latest Report: {report.passed}/{report.total} checks passed</h3>
              <ul className="plain-list">
                {report.cases.map((item, index) => (
                  <li key={index}>
                    <strong>{item.passed ? 'Pass' : 'Fail'}</strong>: {item.prompt}
                    <div>Expected: {item.expected} | Actual: {item.decision}</div>
                    <div>{item.reason}</div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
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
                  <td>{run.cases ? `${run.score}%` : 'Legacy demo'}</td>
                  <td>{run.cases ? run.result : 'Not measured'}</td>
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
