import { sha256 } from './canonical.mjs';

export function credentialHash(rawCredential) {
  if (!rawCredential || typeof rawCredential !== 'string') {
    throw new Error('credential_required');
  }
  return sha256(rawCredential);
}

export function authenticateApiKey(rawCredential, credentialStore, now = Date.now()) {
  const hash = credentialHash(rawCredential);
  const record = credentialStore.get(hash);
  if (!record || record.revoked || (record.expiresAt && record.expiresAt <= now)) {
    throw new Error('invalid_credential');
  }
  return Object.freeze({
    principalId: record.principalId,
    organizationId: record.organizationId,
    credentialId: record.credentialId,
    scopes: Object.freeze([...record.scopes]),
    authMethod: 'api_key',
  });
}

export function delegatePrincipal(basePrincipal, grant, now = Date.now()) {
  if (!grant || grant.revoked || grant.expiresAt <= now) throw new Error('invalid_grant');
  if (grant.baseCredentialId !== basePrincipal.credentialId) throw new Error('grant_base_mismatch');
  if (grant.organizationId !== basePrincipal.organizationId) throw new Error('grant_org_mismatch');

  const baseScopes = new Set(basePrincipal.scopes);
  for (const scope of grant.scopes) {
    if (!baseScopes.has(scope)) throw new Error('scope_escalation_denied');
  }

  return Object.freeze({
    principalId: basePrincipal.principalId,
    organizationId: basePrincipal.organizationId,
    credentialId: basePrincipal.credentialId,
    grantId: grant.grantId,
    scopes: Object.freeze([...grant.scopes]),
    authMethod: 'delegated_token',
  });
}
