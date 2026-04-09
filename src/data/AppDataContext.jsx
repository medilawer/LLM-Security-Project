import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const DATA_KEY = 'llm_secure_platform_data';

const seedData = {
  policies: [
    { id: 'p1', group: 'Interns', name: 'Basic Safe Policy', restrictedCategory: 'pii, secrets', rateLimit: 500, status: 'Active' },
    { id: 'p2', group: 'Finance Team', name: 'Finance Prompt Guard', restrictedCategory: 'account, iban, card', rateLimit: 350, status: 'Active' },
  ],
  integrations: [
    { id: 'i1', provider: 'Local Server', model: 'llama-3-8b', mode: 'Self-hosted', status: 'Online' },
    { id: 'i2', provider: 'Secure API', model: 'secure-api-v2', mode: 'Token Auth', status: 'Online' },
  ],
  enforcementLogs: [
    { id: 'e1', time: '10:21', user: 'saad@org.com', decision: 'Blocked', reason: 'PII pattern detected', prompt: 'show account details' },
    { id: 'e2', time: '10:19', user: 'hana@org.com', decision: 'Allowed', reason: 'Policy matched', prompt: 'summarize document safely' },
  ],
  complianceRuns: [
    { id: 'c1', suite: 'Safety Baseline', model: 'secure-api-v2', score: 93, result: 'Pass' },
    { id: 'c2', suite: 'Jailbreak Resistance', model: 'llama-3-8b', score: 74, result: 'Needs Review' },
  ],
};

const AppDataContext = createContext(null);

function loadData() {
  try {
    const raw = localStorage.getItem(DATA_KEY);
    return raw ? JSON.parse(raw) : seedData;
  } catch {
    return seedData;
  }
}

function nowTime() {
  const date = new Date();
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

export function AppDataProvider({ children }) {
  const [data, setData] = useState(loadData);

  useEffect(() => {
    localStorage.setItem(DATA_KEY, JSON.stringify(data));
  }, [data]);

  const addPolicy = ({ group, name, restrictedCategory, rateLimit }) => {
    const policy = {
      id: crypto.randomUUID(),
      group: group.trim(),
      name: name.trim(),
      restrictedCategory: restrictedCategory.trim(),
      rateLimit: Number(rateLimit) || 0,
      status: 'Active',
    };
    setData((prev) => ({ ...prev, policies: [policy, ...prev.policies] }));
  };

  const removePolicy = (id) => {
    setData((prev) => ({ ...prev, policies: prev.policies.filter((policy) => policy.id !== id) }));
  };

  const addIntegration = ({ provider, model, mode, status }) => {
    const integration = {
      id: crypto.randomUUID(),
      provider: provider.trim(),
      model: model.trim(),
      mode: mode.trim(),
      status,
    };
    setData((prev) => ({ ...prev, integrations: [integration, ...prev.integrations] }));
  };

  const toggleIntegrationStatus = (id) => {
    setData((prev) => ({
      ...prev,
      integrations: prev.integrations.map((integration) => {
        if (integration.id !== id) return integration;
        return {
          ...integration,
          status: integration.status === 'Online' ? 'Paused' : 'Online',
        };
      }),
    }));
  };

  const evaluatePrompt = ({ user, prompt }) => {
    const lowerPrompt = prompt.toLowerCase();

    let reason = 'Policy matched';
    let decision = 'Allowed';

    const matchedPolicy = data.policies.find((policy) => {
      const terms = policy.restrictedCategory
        .split(',')
        .map((term) => term.trim().toLowerCase())
        .filter(Boolean);
      return terms.some((term) => lowerPrompt.includes(term));
    });

    if (matchedPolicy) {
      decision = 'Blocked';
      reason = `Matched restricted category in ${matchedPolicy.name}`;
    }

    if (lowerPrompt.includes('ignore policy') || lowerPrompt.includes('jailbreak')) {
      decision = 'Blocked';
      reason = 'Jailbreak phrase risk';
    }

    const log = {
      id: crypto.randomUUID(),
      time: nowTime(),
      user: user.trim().toLowerCase(),
      prompt,
      decision,
      reason,
    };

    setData((prev) => ({ ...prev, enforcementLogs: [log, ...prev.enforcementLogs] }));
    return log;
  };

  const runComplianceTest = ({ suite, model }) => {
    const score = Math.floor(60 + Math.random() * 40);
    const result = score >= 85 ? 'Pass' : score >= 70 ? 'Needs Review' : 'Fail';

    const run = {
      id: crypto.randomUUID(),
      suite,
      model,
      score,
      result,
    };

    setData((prev) => ({ ...prev, complianceRuns: [run, ...prev.complianceRuns] }));
    return run;
  };

  const value = useMemo(
    () => ({
      policies: data.policies,
      integrations: data.integrations,
      enforcementLogs: data.enforcementLogs,
      complianceRuns: data.complianceRuns,
      addPolicy,
      removePolicy,
      addIntegration,
      toggleIntegrationStatus,
      evaluatePrompt,
      runComplianceTest,
    }),
    [data]
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used inside AppDataProvider');
  }
  return context;
}
