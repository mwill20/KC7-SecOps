import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { contentBundle } from '../../tools/validate-content.mjs';
import { evaluateText, evaluateChallenge } from '../../site/query/evaluate.js';
import { lex, parseSearch } from '../../site/query/parser.js';
import { serializeTokens } from '../../site/query/serializer.js';
const bundle = contentBundle(), challenges = bundle.lessons.flatMap(l => l.challenges);
const cases = JSON.parse(fs.readFileSync(new URL('../../qa/query-cases.json', import.meta.url))).cases;
for (const fixture of cases) test('T03/T06–T09 ' + fixture.id, () => {
  const result = evaluateText(fixture.query, challenges.find(c => c.id === fixture.challengeId).referenceQuery);
  assert.equal(result.status, fixture.expectedStatus); assert.equal(result.queryPoints, fixture.expectedQueryPoints);
});
test('T07 Boolean factoring and De Morgan are structural, not textual', () => {
  const a = 'metadata.event_type = "USER_LOGIN"', b = 'principal.user.userid = "__USER__"', c = 'target.port = 443';
  assert.equal(evaluateText(`(${a} AND ${b}) OR (${a} AND ${c})`, `${a} AND (${b} OR ${c})`).queryPoints, 70);
  assert.equal(evaluateText(`NOT (NOT (${a}) OR NOT (${b}))`, `${a} AND ${b}`).queryPoints, 70);
  assert.notEqual(evaluateText(`${a} AND ${b} OR ${c}`, `${a} AND (${b} OR ${c})`).queryPoints, 70);
});
test('T05/T09 malicious token IDs fail without echo or construction', () => {
  for (const tokens of [['__proto__'], ['<script>'], ['"PRIVATE_SENTINEL"'], Array(513).fill('Field:0'), null]) {
    const r = evaluateChallenge({ challengeId: 'L01-C01', tokens }, challenges);
    assert.equal(r.queryPoints, 0); assert.ok(!JSON.stringify(r).includes('PRIVATE_SENTINEL'));
  }
  assert.throws(() => serializeTokens(['not-a-token']));
});
test('T06 comments and escaped delimiters are lexed in context', () => {
  assert.equal(lex('"// literal" // comment\n"a\\\"b"')[0].value, '// literal');
  assert.equal(lex('"// literal" // comment\n"a\\\"b"')[1].value, 'a"b');
  assert.equal(evaluateText('target.port = 80 // metadata.event_type = "USER_LOGIN"', challenges[0].referenceQuery).queryPoints, 35);
  assert.equal(evaluateText('principal.user.userid = "PRIVATE_SENTINEL"', challenges[0].referenceQuery).queryPoints, 0);
});
test('T09 size, token, depth, node, atom and section bounds fail safely', () => {
  const ref = challenges[0].referenceQuery;
  const status = text => evaluateText(text, ref).status;
  assert.equal(status(' '.repeat(8192)), 'invalid'); assert.equal(status(' '.repeat(8193)), 'limit-exceeded');
  assert.equal(lex('= '.repeat(512)).length, 512); assert.throws(() => lex('= '.repeat(513)), /TOKEN_LIMIT/);
  assert.doesNotThrow(() => parseSearch('('.repeat(7) + ref + ')'.repeat(7)));
  assert.equal(status('('.repeat(8) + ref + ')'.repeat(8)), 'limit-exceeded');
  assert.equal(status(Array(128).fill('NOT ' + ref).join(' OR ')), 'limit-exceeded');
  assert.equal(status(Array.from({ length: 13 }, (_, i) => 'target.port = ' + i).join(' OR ')), 'limit-exceeded');
  assert.equal(status(ref + ' limit: 2 limit: 3'), 'invalid');
  assert.equal(status(ref + ' outcome: $n = count(metadata.id) match: target.port'), 'invalid');
});
test('T08 alias context and defined numeric outcomes are mandatory', () => {
  const ref = challenges[0].referenceQuery;
  for (const query of ['$u = principal.user.userid OR ' + ref, '$u = principal.user.userid AND $u = target.user.userid', '$u = $user', '$u = "__USER__"', ref + ' match: $u', ref + ' condition: $n > 3', ref + ' outcome: $n = sum(metadata.id)']) assert.equal(evaluateText(query, ref).queryPoints, 0);
});
test('T06 function keyword case and T09 exact byte/node bounds', () => {
  const ref = challenges[0].referenceQuery;
  assert.equal(evaluateText(ref + ' '.repeat(8192 - ref.length), ref).queryPoints, 70);
  const atNodeLimit = Array(85).fill('NOT NOT ' + ref).join(' OR ');
  assert.doesNotThrow(() => parseSearch(atNodeLimit));
  assert.equal(evaluateText('NOT ' + atNodeLimit, ref).status, 'limit-exceeded');
  const process = bundle.lessons[2].challenges[0];
  const alternate = process.acceptedVariants.find(q => q.includes('re.regex'));
  assert.ok(alternate); assert.equal(evaluateText(alternate.replaceAll('re.regex', 'RE.REGEX'), process.referenceQuery).queryPoints, 70);
});
