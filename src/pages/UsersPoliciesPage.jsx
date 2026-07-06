import { useState } from 'react';
import { useAppData } from '../data/AppDataContext';

function UsersPoliciesPage() {
  const { policies, addPolicy, removePolicy } = useAppData();
  const [group, setGroup] = useState('');
  const [name, setName] = useState('');
  const [restrictedCategory, setRestrictedCategory] = useState('');
  const [rateLimit, setRateLimit] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    addPolicy({ group, name, restrictedCategory, rateLimit });
    setGroup('');
    setName('');
    setRestrictedCategory('');
    setRateLimit('');
  };

  return (
    <section>
      <div className="page-head">
        <h2>Users & Policies</h2>
        <p>Create and manage policy rules with working form actions.</p>
      </div>

      <div className="two-col">
        <article className="panel">
          <h3>Create Policy</h3>
          <form className="stack-form" onSubmit={handleSubmit}>
            <label htmlFor="policy-group">User Group</label>
            <input id="policy-group" value={group} onChange={(event) => setGroup(event.target.value)} placeholder="Finance Team" required />
            <label htmlFor="policy-name">Policy Name</label>
            <input id="policy-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Finance Prompt Guard" required />
            <label htmlFor="policy-keywords">Restricted Keywords (comma-separated)</label>
            <input id="policy-keywords"
              value={restrictedCategory}
              onChange={(event) => setRestrictedCategory(event.target.value)}
              placeholder="account, card, iban"
              required
            />
            <label htmlFor="policy-rate">Rate Limit (per day)</label>
            <input id="policy-rate"
              type="number"
              min="1"
              value={rateLimit}
              onChange={(event) => setRateLimit(event.target.value)}
              placeholder="500"
              required
            />
            <button type="submit" className="primary">Save Policy</button>
          </form>
        </article>

        <article className="panel">
          <h3>Assigned Policies</h3>
          <table>
            <thead>
              <tr>
                <th>User Group</th>
                <th>Policy</th>
                <th>Restricted</th>
                <th>Rate</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {policies.map((policy) => (
                <tr key={policy.id}>
                  <td>{policy.group}</td>
                  <td>{policy.name}</td>
                  <td>{policy.restrictedCategory}</td>
                  <td>{policy.rateLimit}</td>
                  <td>
                    <button type="button" className="mini-btn" onClick={() => removePolicy(policy.id)}>
                      Delete
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

export default UsersPoliciesPage;
