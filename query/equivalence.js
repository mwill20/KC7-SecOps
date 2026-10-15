import { QueryError } from './parser.js';
const atomKey = n => JSON.stringify([n.field, n.op, n.type, n.value, n.nocase]);
function atoms(n, out = new Set()) {
  if (n?.kind === 'atom') out.add(atomKey(n));
  if (n?.children) n.children.forEach(c => atoms(c, out));
  if (n?.child) atoms(n.child, out);
  return out;
}
function evaluate(n, assignment) {
  if (!n || n.kind === 'true') return true;
  if (n.kind === 'atom') return assignment.get(atomKey(n));
  if (n.kind === 'not') return !evaluate(n.child, assignment);
  return n.kind === 'and' ? n.children.every(c => evaluate(c, assignment)) : n.children.some(c => evaluate(c, assignment));
}
export function compareBooleanIntent(a, b) {
  if ((!a) !== (!b)) return false;
  const keys = [...new Set([...atoms(a), ...atoms(b)])];
  if (keys.length > 12) throw new QueryError('ATOM_LIMIT', 'limit-exceeded');
  for (let mask = 0; mask < 2 ** keys.length; mask++) {
    const assignment = new Map(keys.map((key, i) => [key, Boolean(mask & (1 << i))]));
    if (evaluate(a, assignment) !== evaluate(b, assignment)) return false;
  }
  return true;
}
export function comparePipeline(a, b) {
  const summary = q => ({ match: q.match, outcomes: q.outcomes.map(o => o.signature).sort(), order: q.order.map(s => [s.signature, s.direction]), limit: q.limit });
  return JSON.stringify(summary(a)) === JSON.stringify(summary(b)) && compareBooleanIntent(a.condition, b.condition);
}
