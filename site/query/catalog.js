export const fields = Object.freeze({
  'metadata.event_type': 'event', 'security_result.action': 'action',
  'principal.user.userid': 'user', 'target.user.userid': 'user',
  'principal.hostname': 'host', 'target.hostname': 'host',
  'principal.ip': 'ip', 'target.ip': 'ip',
  'target.process.file.full_path': 'process', 'target.port': 'number',
  'network.sent_bytes': 'number', 'metadata.id': 'id',
});
export const aliases = Object.freeze(['$user', '$account', '$u', '$port', '$events', '$total', '$failures', '$n', '$bytes', '$volume']);
export const patterns = Object.freeze([String.raw`\\powershell\.exe$`, String.raw`\\pwsh\.exe$`, String.raw`\\(powershell|pwsh)\.exe$`]);
export const literals = Object.freeze(['USER_LOGIN', 'PROCESS_LAUNCH', 'NETWORK_CONNECTION', 'FAIL', 'ALLOW', 'BLOCK', '__USER__', '__HOST__', '', '192.0.2.17', '192.0.2.0/24']);
export const numbers = Object.freeze([...Array.from({ length: 21 }, (_, i) => i), 80, 443]);
export const durations = Object.freeze({ '1m': 60, '5m': 300, '10m': 600, '1h': 3600 });
const groups = {
  Field: Object.keys(fields), Alias: aliases,
  Operator: ['=', '!=', '<', '<=', '>', '>=', 'AND', 'OR', 'NOT', 'nocase'],
  Constant: [...literals.map(x => JSON.stringify(x)), ...numbers.map(String)],
  Structure: ['(', ')', ',', 'events:', 'match:', 'outcome:', 'condition:', 'order:', 'limit:', 'by', ...Object.keys(durations), 'asc', 'desc', '\n'],
  Function: ['count', 'count_distinct', 'sum', 're.regex', 'net.ip_in_range_cidr'],
  Pattern: [...patterns.map(x => '/' + x + '/'), ...patterns.map(x => JSON.stringify(x))],
};
export const tokens = Object.freeze(Object.entries(groups).flatMap(([group, values]) => values.map((lexeme, i) => Object.freeze({ id: group + ':' + i, group, lexeme, label: lexeme === '\n' ? 'New line' : lexeme === '"__USER__"' ? '[USER]' : lexeme === '"__HOST__"' ? '[HOST]' : lexeme === '"192.0.2.17"' ? '[IP] — documentation address' : lexeme === '"192.0.2.0/24"' ? '[CIDR] — documentation subnet' : lexeme }))));
export const tokenMap = new Map(tokens.map(t => [t.id, t]));
