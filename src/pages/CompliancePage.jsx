import { useState } from 'react';
import { useAppData } from '../data/AppDataContext';
import { complianceSuites } from '../data/compliance.js';

function CompliancePage() {
  const { integrations, complianceRuns, runComplianceTest } = useAppData();
  const [report, setReport] = useState(null);
  const [suite, setSuite] = useState('Safety Baseline');
  const [model, setModel] = useState(integrations[0]?.model || '');

  const [formError, setFormError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!model.trim()) {
      setFormError('Enter a model label.');
      return;
    }
    setFormError('');
    setReport(runComplianceTest({ suite, model: model.trim() }));
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
            <label htmlFor="compliance-suite">Test Suite</label>
            <select id="compliance-suite" value={suite} onChange={(event) => setSuite(event.target.value)}>
              {Object.keys(complianceSuites).map((name) => <option key={name}>{name}</option>)}
            </select>
            <label htmlFor="compliance-model">Model</label>
            <input id="compliance-model" list="compliance-models" value={model} onChange={(event) => setModel(event.target.value)} required />
            <datalist id="compliance-models">
              {[...new Set(integrations.map((integration) => integration.model).filter(Boolean))].map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist>
            <button type="submit" className="primary">Run Compliance Test</button>
          </form>
          {formError ? <p className="auth-msg error" role="alert">{formError}</p> : null}
          <div aria-live="polite">
            {report ? (
              <div className="compliance-report">
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
          </div>
        </article>

        <article className="panel">
          <h3 id="compliance-records">Recent Test Runs</h3>
          <div className="table-scroll" tabIndex={0} role="region" aria-labelledby="compliance-records">
            <table>
              <thead>
                <tr>
                  <th scope="col">Test Suite</th>
                  <th scope="col">Model</th>
                  <th scope="col">Score</th>
                  <th scope="col">Result</th>
                </tr>
              </thead>
              <tbody>
                {complianceRuns.length === 0 ? (
                  <tr><td colSpan={4}>No compliance runs yet.</td></tr>
                ) : null}
                {complianceRuns.map((run) => (
                  <tr key={run.id}>
                    <td>{run.suite}</td>
                    <td>{run.model}</td>
                    <td>{Array.isArray(run.cases) ? `${run.score}% (${run.passed}/${run.total})` : 'Legacy demo'}</td>
                    <td>{Array.isArray(run.cases) ? run.result : 'Not measured'}</td>
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

export default CompliancePage;
