import { credentialHash, authenticateApiKey } from './auth.mjs';
import { AgenticOperationsGateway } from './gateway.mjs';

const credentials = new Map();
credentials.set(credentialHash('demo-key'), {
  principalId: 'agent-demo',
  organizationId: 'org-demo',
  credentialId: 'cred-demo',
  scopes: ['cases:read', 'cases:write', 'changes:publish'],
});

const principal = authenticateApiKey('demo-key', credentials);
const gateway = new AgenticOperationsGateway({
  handlers: {
    read_case: async ({ caseId }) => ({ caseId, status: 'ready' }),
    update_case: async ({ caseId, status }) => ({ caseId, status }),
  },
});

console.log(await gateway.execute({
  principal,
  action: 'read_case',
  input: { caseId: 'CASE-42' },
  correlationId: 'demo-read-1',
}));

console.log(await gateway.execute({
  principal,
  action: 'publish_material_change',
  input: { changeId: 'CHANGE-7', reason: 'Synthetic demonstration' },
  correlationId: 'demo-review-1',
}));
