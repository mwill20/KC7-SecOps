import { fields, aliases, patterns, literals, numbers, durations } from './catalog.js';

export class QueryError extends Error {
  constructor(code, status = 'invalid', index = null) { super(code); this.code = code; this.status = status; this.index = index; }
}
const fail = (code, status, index) => { throw new QueryError(code, status, index); };
const unsupported = code => fail(code, 'unsupported');

export function lex(text) {
  if (typeof text !== 'string' || new TextEncoder().encode(text).length > 8192) fail('BYTE_LIMIT', 'limit-exceeded');
  const out = [];
  let i = 0;
  const add = (kind, value, index) => { out.push({ kind, value, index }); if (out.length > 512) fail('TOKEN_LIMIT', 'limit-exceeded'); };
  while (i < text.length) {
    const start = i, c = text[i];
    if (/\s/.test(c)) { i++; continue; }
    if (text.slice(i, i + 2) === '//') { while (i < text.length && text[i] !== '\n') i++; continue; }
    if (c === '"' || c === '`') {
      const quote = c; let decoded = ''; i++;
      while (i < text.length && text[i] !== quote) {
        if (quote === '"' && text[i] === '\\') {
          i++; if (!['\\', '"'].includes(text[i])) fail('STRING_ESCAPE', 'invalid', out.length);
        }
        if (text[i] === '\n' || text[i] === '\r') fail('STRING_NEWLINE');
        decoded += text[i++];
      }
      if (text[i] !== quote) fail('UNCLOSED_STRING'); i++;
      add('string', decoded, start); continue;
    }
    if (c === '/') {
      let body = ''; i++; let closed = false;
      while (i < text.length) {
        if (text[i] === '\n') fail('UNCLOSED_REGEX');
        if (text[i] === '/') { i++; closed = true; break; }
        if (text[i] === '\\') { body += text[i++]; if (i >= text.length) break; }
        body += text[i++];
      }
      if (!closed) fail('UNCLOSED_REGEX'); add('regex', body, start); continue;
    }
    if ('(),:'.includes(c)) { add(c, c, start); i++; continue; }
    if ('=!<>'.includes(c)) {
      let value = text[i++]; if (text[i] === '=' && value !== '=') value += text[i++];
      if (!['=', '!=', '<', '<=', '>', '>='].includes(value)) fail('COMPARISON');
      add('op', value, start); continue;
    }
    if (/\d/.test(c)) {
      let value = ''; while (i < text.length && /[0-9]/.test(text[i])) value += text[i++];
      if (/[mh]/.test(text[i] ?? '') && text[i]) { value += text[i++]; add('duration', value, start); }
      else add('number', Number(value), start);
      continue;
    }
    if (/[A-Za-z_$]/.test(c)) {
      let value = ''; while (i < text.length && /[A-Za-z0-9_.$]/.test(text[i])) value += text[i++];
      add(value.startsWith('$') ? 'var' : 'word', value, start); continue;
    }
    unsupported('UNSUPPORTED_SYNTAX');
  }
  return out;
}

export function parseSearch(text) {
  const ts = lex(text); let p = 0, depth = 0, nodes = 0;
  const q = { filter: null, bindings: [], match: null, outcomes: [], condition: null, order: [], limit: null };
  const peek = () => ts[p];
  const is = v => String(peek()?.value).toLowerCase() === v;
  const take = v => { if (!is(v)) return false; p++; return true; };
  const need = v => { if (!take(v)) fail('EXPECTED_TOKEN', 'invalid', p); };
  const node = n => { if (++nodes > 256) fail('NODE_LIMIT', 'limit-exceeded'); return n; };
  const section = () => peek()?.kind === 'word' && ts[p + 1]?.kind === ':';
  const operand = () => {
    const t = ts[p++]; if (!t || !['var', 'word'].includes(t.kind)) fail('OPERAND', 'invalid', p - 1);
    if (t.kind === 'var') { if (!aliases.includes(t.value)) unsupported('UNSUPPORTED_ALIAS'); }
    else if (!Object.hasOwn(fields, t.value)) unsupported('UNSUPPORTED_FIELD');
    return t.value;
  };
  const value = () => {
    const t = ts[p++]; if (!t || !['string', 'regex', 'number'].includes(t.kind)) fail('VALUE', 'invalid', p - 1);
    if (t.kind === 'number' && !numbers.includes(t.value)) fail('UNSAFE_LITERAL');
    if (t.kind === 'string' && !literals.includes(t.value) && !patterns.includes(t.value)) fail('UNSAFE_LITERAL');
    return t;
  };
  const expression = (condition = false) => {
    const unary = () => {
      if (++depth > 8) fail('DEPTH_LIMIT', 'limit-exceeded');
      let n;
      if (take('not')) n = node({ kind: 'not', child: unary() });
      else if (take('(')) { n = or(); need(')'); }
      else if (!condition && (is('re.regex') || is('net.ip_in_range_cidr'))) {
        const fn = ts[p++].value.toLowerCase(); need('('); const field = operand(); need(','); const v = value(); need(')');
        const nocase = take('nocase');
        n = node({ kind: 'atom', field, op: fn, value: v.value, type: v.kind, nocase });
      } else {
        const field = operand(); const op = ts[p++];
        if (op?.kind !== 'op') fail('COMPARISON', 'invalid', p - 1);
        if (!condition && ['var', 'word'].includes(peek()?.kind) && op.value === '=') {
          const rhs = operand();
          if (field.startsWith('$') === rhs.startsWith('$')) fail('BINDING');
          n = node({ kind: 'binding', name: field.startsWith('$') ? field : rhs, field: field.startsWith('$') ? rhs : field });
        } else {
          const v = value(); const nocase = !condition && take('nocase');
          n = node({ kind: 'atom', field, op: op.value, value: v.value, type: v.kind, nocase: Boolean(nocase) });
        }
      }
      depth--; return n;
    };
    const starts = () => peek() && !section() && (peek().kind === 'var' || peek().kind === '(' || (peek().kind === 'word' && !['or', 'by', 'asc', 'desc', 'nocase'].includes(String(peek().value).toLowerCase())));
    const and = () => {
      const children = [unary()];
      while (true) { if (take('and')) children.push(unary()); else if (!condition && starts()) children.push(unary()); else break; }
      return children.length === 1 ? children[0] : node({ kind: 'and', children });
    };
    const or = () => { const children = [and()]; while (take('or')) children.push(and()); return children.length === 1 ? children[0] : node({ kind: 'or', children }); };
    return or();
  };
  if (is('rule') || is('select') || is('from') || is('meta')) unsupported('CONTEXT_NOT_SEARCH');
  if (take('events')) need(':');
  if (!peek()) fail('EMPTY_QUERY');
  q.filter = expression();
  const order = ['match', 'outcome', 'condition', 'order', 'limit']; let last = -1;
  while (peek()) {
    const name = String(ts[p++].value).toLowerCase(); const rank = order.indexOf(name);
    if (rank < 0) unsupported('UNSUPPORTED_SECTION');
    if (rank <= last) fail('SECTION_ORDER'); last = rank; need(':');
    if (name === 'match') {
      const keys = [operand()]; while (take(',')) keys.push(operand());
      let seconds = null;
      if (take('by')) { const v = ts[p++]; if (!v || !Object.hasOwn(durations, v.value)) unsupported('DURATION'); seconds = durations[v.value]; }
      if (keys.length > 4) fail('GROUP_LIMIT', 'limit-exceeded'); q.match = { keys, seconds };
    } else if (name === 'outcome') {
      do {
        const name = operand(); if (!name.startsWith('$')) fail('OUTCOME_ALIAS'); need('=');
        const fn = String(ts[p++]?.value ?? '').toLowerCase(); if (!['count', 'count_distinct', 'sum'].includes(fn)) unsupported('AGGREGATE');
        need('('); const field = operand(); need(')'); q.outcomes.push({ name, fn, field });
        if (q.outcomes.length > 4) fail('OUTCOME_LIMIT', 'limit-exceeded');
      } while (peek() && !section());
    } else if (name === 'condition') q.condition = expression(true);
    else if (name === 'order') {
      do { const name = operand(); let direction = 'asc'; if (is('asc') || is('desc')) direction = String(ts[p++].value).toLowerCase(); q.order.push({ name, direction }); } while (take(','));
      if (q.order.length > 4) fail('SORT_LIMIT', 'limit-exceeded');
    } else { const v = value(); if (v.kind !== 'number' || v.value < 1 || v.value > 20) fail('LIMIT_VALUE'); q.limit = v.value; }
  }
  const bindings = new Map();
  const extract = (n, allowed = true) => {
    if (n.kind === 'binding') { if (!allowed || bindings.has(n.name)) fail('BINDING_CONTEXT'); bindings.set(n.name, n.field); if (bindings.size > 8) fail('BINDING_LIMIT', 'limit-exceeded'); return node({ kind: 'true' }); }
    if (n.children) n.children = n.children.map(c => extract(c, allowed && n.kind === 'and'));
    if (n.child) n.child = extract(n.child, false);
    return n;
  };
  q.filter = extract(q.filter);
  const resolve = x => { if (!x.startsWith('$')) return x; if (!bindings.has(x)) fail('UNBOUND_ALIAS'); return bindings.get(x); };
  const normalizeFilter = (n, negated = false) => {
    if (n.children) { n.children = n.children.map(x => normalizeFilter(x, negated)); return n; }
    if (n.child) { n.child = normalizeFilter(n.child, true); return n; }
    if (n.kind !== 'atom') return n;
    n.field = resolve(n.field); const type = fields[n.field];
    if (type === 'id') fail('ID_FILTER_UNSUPPORTED');
    if ((type === 'ip' || type === 'action') && (negated || n.op === '!=')) unsupported('REPEATED_NEGATION');
    if (n.op === 'net.ip_in_range_cidr') { if (type !== 'ip' || n.type !== 'string' || n.value !== '192.0.2.0/24' || n.nocase) fail('CIDR_TYPE'); }
    else if (n.op === 're.regex' || n.type === 'regex') {
      if (type !== 'process' || !patterns.includes(n.value)) unsupported('PATTERN_NOT_SUPPORTED');
      if (n.op !== '=' && n.op !== 're.regex') unsupported('PATTERN_OPERATOR');
      n.op = 'regex'; n.type = 'regex';
      if (n.value === patterns[2]) return node({ kind: 'or', children: patterns.slice(0, 2).map(pattern => node({ ...n, value: pattern })) });
    } else {
      const choices = { event: ['USER_LOGIN', 'PROCESS_LAUNCH', 'NETWORK_CONNECTION'], action: ['FAIL', 'ALLOW', 'BLOCK'], user: ['__USER__', ''], title: [''], host: ['__HOST__'], ip: ['192.0.2.17'] };
      if (type === 'number') { if (n.type !== 'number' || n.nocase) fail('NUMBER_TYPE'); }
      else if (!choices[type]?.includes(n.value) || n.type !== 'string' || !['=', '!='].includes(n.op) || (n.nocase && !['user', 'host'].includes(type))) fail('FIELD_VALUE_TYPE');
    }
    return n;
  };
  q.filter = normalizeFilter(q.filter);
  if (q.match) { q.match.keys = q.match.keys.map(resolve).sort(); if (new Set(q.match.keys).size !== q.match.keys.length) fail('DUPLICATE_GROUP'); }
  const outcomes = new Map(); const signatures = new Set();
  for (const o of q.outcomes) {
    o.field = resolve(o.field);
    const eventCount = ['count', 'count_distinct'].includes(o.fn) && o.field === 'metadata.id';
    const userCount = o.fn === 'count_distinct' && ['principal.user.userid', 'target.user.userid'].includes(o.field);
    if (!(eventCount || userCount || o.fn === 'sum' && o.field === 'network.sent_bytes')) fail('AGGREGATE_TYPE');
    o.signature = o.fn + ':' + o.field;
    if (outcomes.has(o.name) || signatures.has(o.signature) || bindings.has(o.name)) fail('DUPLICATE_OUTCOME');
    outcomes.set(o.name, o); signatures.add(o.signature);
  }
  const condition = n => {
    if (n.children) { n.children = n.children.map(condition); return n; }
    if (n.child) { n.child = condition(n.child); return n; }
    const outcome = outcomes.get(n.field); if (!outcome || n.type !== 'number') fail('CONDITION_ALIAS');
    n.field = outcome.signature;
    if (outcome.fn !== 'sum' && n.op === '>=') { n.op = '>'; n.value--; }
    return n;
  };
  if (q.condition) { if (!q.match) fail('CONDITION_MATCH'); q.condition = condition(q.condition); }
  for (const s of q.order) { if (!outcomes.has(s.name)) fail('SORT_ALIAS'); s.signature = outcomes.get(s.name).signature; }
  const countAtoms = n => !n ? [] : n.kind === 'atom' ? [JSON.stringify(n)] : n.children ? n.children.flatMap(countAtoms) : n.child ? countAtoms(n.child) : [];
  if (new Set([...countAtoms(q.filter), ...countAtoms(q.condition)]).size > 12) fail('ATOM_LIMIT', 'limit-exceeded');
  q.bindings = [...bindings].map(([name, field]) => ({ name, field }));
  return q;
}
