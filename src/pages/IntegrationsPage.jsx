import { useState } from 'react';
import { useAppData } from '../data/AppDataContext';

function IntegrationsPage() {
  const { integrations, addIntegration, toggleIntegrationStatus } = useAppData();
  const [provider, setProvider] = useState('');
  const [model, setModel] = useState('');
  const [mode, setMode] = useState('Token Auth');

  const handleSubmit = (event) => {
    event.preventDefault();
    addIntegration({ provider, model, mode, status: 'Online' });
    setProvider('');
    setModel('');
    setMode('Token Auth');
  };

  return (
    <section>
      <div className="page-head">
        <h2>Integrations</h2>
        <p>Add providers and toggle model availability.</p>
      </div>

      <div className="two-col">
        <article className="panel">
          <h3>Add Integration</h3>
          <form className="stack-form" onSubmit={handleSubmit}>
            <label>Provider</label>
            <input value={provider} onChange={(event) => setProvider(event.target.value)} placeholder="Secure API" required />
            <label>Model</label>
            <input value={model} onChange={(event) => setModel(event.target.value)} placeholder="secure-api-v3" required />
            <label>Connection Mode</label>
            <input value={mode} onChange={(event) => setMode(event.target.value)} placeholder="Token Auth" required />
            <button type="submit" className="primary">Add Integration</button>
          </form>
        </article>

        <article className="panel">
          <h3>Connected Providers</h3>
          <table>
            <thead>
              <tr>
                <th>Provider</th>
                <th>Model</th>
                <th>Mode</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {integrations.map((integration) => (
                <tr key={integration.id}>
                  <td>{integration.provider}</td>
                  <td>{integration.model}</td>
                  <td>{integration.mode}</td>
                  <td>{integration.status}</td>
                  <td>
                    <button
                      type="button"
                      className="mini-btn"
                      onClick={() => toggleIntegrationStatus(integration.id)}
                    >
                      Toggle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
      </div>
    </section>
  );
}

export default IntegrationsPage;
