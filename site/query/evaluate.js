import { parseSearch, QueryError } from './parser.js';
import { compareBooleanIntent, comparePipeline } from './equivalence.js';
import { serializeTokens } from './serializer.js';
export function evaluateText(text, reference) {
  try {
    const candidate = parseSearch(text), expected = parseSearch(reference);
    const filter = compareBooleanIntent(candidate.filter, expected.filter), pipeline = comparePipeline(candidate, expected);
    return { status: filter && pipeline ? 'supported-correct' : 'supported-incorrect', queryPoints: 10 + (filter ? 35 : 0) + (pipeline ? 25 : 0), checks: { syntax: true, filter, pipeline }, diagnostics: [!filter && 'FILTER_INTENT', !pipeline && 'PIPELINE_INTENT'].filter(Boolean).map(code => ({ code, tokenIndex: null, messageId: code })) };
  } catch (error) {
    const known = error instanceof QueryError;
    return { status: known ? error.status : 'invalid', queryPoints: 0, checks: { syntax: false, filter: false, pipeline: false }, diagnostics: [{ code: known ? error.code : 'INVALID_TOKENS', tokenIndex: known ? error.index : null, messageId: known ? error.code : 'INVALID_TOKENS' }] };
  }
}
export function evaluateChallenge({ challengeId, tokens }, challenges) {
  const challenge = challenges.find(c => c.id === challengeId);
  if (!challenge) return evaluateText('', '');
  try { return evaluateText(serializeTokens(tokens), challenge.referenceQuery); }
  catch { return { status: 'invalid', queryPoints: 0, checks: { syntax: false, filter: false, pipeline: false }, diagnostics: [{ code: 'INVALID_TOKENS', tokenIndex: null, messageId: 'INVALID_TOKENS' }] }; }
}
