const jailbreakPatterns = [
  /\bignore\s+(?:(?:all|the|previous)\s+)*(?:polic(?:y|ies)|instructions?|rules?)\b/i,
  /\bjailbreak\b/i,
  /\bbypass\s+(?:(?:the|all)\s+)*(?:safety|security|polic(?:y|ies)|rules?)\b/i,
];

// Literal keyword matching with word boundaries avoids blocking "cardboard"
// when a policy restricts "card". This is a prototype, not a semantic classifier.
export function checkPrompt(prompt, policies = []) {
  if (typeof prompt !== 'string' || !prompt.trim()) {
    throw new Error('Enter a non-empty prompt.');
  }
  const normalized = prompt.normalize('NFKC');
  if (jailbreakPatterns.some((pattern) => pattern.test(normalized))) {
    return { decision: 'Blocked', reason: 'Jailbreak phrase risk' };
  }
  for (const policy of policies) {
    if (policy.status !== 'Active') continue;
    const terms = policy.restrictedCategory.split(',').map((term) => term.trim()).filter(Boolean);
    for (const term of terms) {
      const escaped = term.normalize('NFKC').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = new RegExp(`(?<![\\p{L}\\p{N}_])${escaped}(?![\\p{L}\\p{N}_])`, 'iu');
      if (pattern.test(normalized)) {
        return { decision: 'Blocked', reason: `Matched restricted category in ${policy.name}`, policyId: policy.id };
      }
    }
  }
  return { decision: 'Allowed', reason: 'No configured restriction matched' };
}
