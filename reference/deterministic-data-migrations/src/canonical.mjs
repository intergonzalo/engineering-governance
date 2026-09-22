import { createHash } from 'node:crypto';

export function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]));
  }
  return value;
}

export function stableStringify(value) {
  return JSON.stringify(canonicalize(value));
}

export function hash(value) {
  return createHash('sha256').update(stableStringify(value)).digest('hex');
}

export function indexById(records) {
  return new Map(records.map((record) => [record.id, structuredClone(record)]));
}

export function digestRecords(records) {
  return hash([...records].sort((a, b) => String(a.id).localeCompare(String(b.id))));
}
