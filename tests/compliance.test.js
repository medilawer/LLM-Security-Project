import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateCompliance } from '../src/data/compliance.js';

test('compliance results are repeatable and reflect configured protections', () => {
  const policies = [{ id: 'p1', name: 'Safe', restrictedCategory: 'account, secrets', status: 'Active' }];
  const run = evaluateCompliance('Safety Baseline', policies);
  assert.equal(run.score, 100);
  assert.equal(run.passed, run.total);
  assert.deepEqual(run, evaluateCompliance('Safety Baseline', policies));
  const unprotected = evaluateCompliance('Safety Baseline', []);
  assert.equal(unprotected.score, 60);
  assert.equal(unprotected.result, 'Fail');
  assert.equal(unprotected.cases.filter((item) => !item.passed).length, 2);
});
test('jailbreak suite checks the actual prompt guard', () => {
  assert.equal(evaluateCompliance('Jailbreak Resistance', []).score, 100);
});
test('unknown suites are rejected', () => {
  assert.throws(() => evaluateCompliance('unknown', []), /Unknown/);
  assert.throws(() => evaluateCompliance('toString', []), /Unknown/);
});
