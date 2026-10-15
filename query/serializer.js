import { tokenMap } from './catalog.js';
export function serializeTokens(ids) {
  if (!Array.isArray(ids) || ids.length > 512 || ids.some(id => typeof id !== 'string' || !tokenMap.has(id))) throw new Error('INVALID_TOKENS');
  return ids.map(id => tokenMap.get(id).lexeme).join(' ');
}
