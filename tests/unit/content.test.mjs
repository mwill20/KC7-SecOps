import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { contentBundle, validateContent } from '../../tools/validate-content.mjs';
const original = contentBundle();
const cases = JSON.parse(fs.readFileSync(new URL('../../qa/query-cases.json', import.meta.url))).cases;
const mutations = {
  'wrong mission distribution': b => b.lessons[0].challenges.pop(),
  'missing teaching mission': b => { delete b.lessons[0].challenges[0].mission; },
  'wrong shown example': b => { b.lessons[0].challenges[0].mission.example = 'target.port = 443'; },
  'unsafe example': b => { b.lessons[0].challenges[0].mission.example = 'principal.user.userid = "SYNTHETIC_PRIVATE"'; },
  'missing gap marker': b => { b.lessons[0].challenges[2].mission.starter = 'metadata.event_type = "USER_LOGIN"'; },
  'wrong gap answer': b => { b.lessons[0].challenges[2].mission.gaps[0].answer = 'sum'; },
  'unknown gap option': b => { b.lessons[0].challenges[2].mission.gaps[0].answer = 'arbitrary'; },
  'unknown mission property': b => { b.lessons[0].challenges[0].mission.actualResult = 'private'; },
  'missing lesson': b => b.lessons.pop(),
  'unknown lesson': b => { b.lessons[0].id = 'L99'; },
  'duplicate lesson': b => { b.lessons[1].id = 'L01'; },
  'cycle': b => { b.lessons[0].prerequisites = ['L06']; },
  'self dependency': b => { b.lessons[0].prerequisites = ['L01']; },
  'duplicate prerequisites': b => { b.lessons[1].prerequisites = ['L01', 'L01']; },
  'unknown source': b => { b.lessons[0].sourceIds = ['G99']; },
  'unsafe source scheme': b => { b.sources[0].url = 'javascript:alert(1)'; },
  'URL credentials': b => { b.sources[0].url = 'https://user:secret@example.org/'; },
  'duplicate source': b => { b.sources[1].id = b.sources[0].id; },
  'duplicate symbol': b => { b.symbols[1].id = b.symbols[0].id; },
  'unknown symbol': b => { b.lessons[0].challenges[0].symbolIds = ['REAL_USER']; },
  'wrong challenge parent': b => { b.lessons[1].challenges[0].id = 'L01-C01'; },
  'duplicate method': b => { b.lessons[0].challenges[0].methodQuestions[1].id = 'M1'; },
  'duplicate option': b => { b.lessons[0].challenges[0].methodQuestions[0].options[1].id = 'A'; },
  'bad answer key': b => { b.lessons[0].challenges[0].methodQuestions[0].correctOption = 'D'; },
  'bad query reference': b => { b.lessons[0].challenges[0].referenceQuery = 'target.port = "443"'; },
  'wrong alternate intent': b => { b.lessons[0].challenges[0].acceptedVariants[0] = 'target.port = 443'; },
  'unknown content property': b => { b.lessons[0].customInput = true; },
};
for (const [label, mutate] of Object.entries(mutations)) test('T02 invalid content stops build: ' + label, () => { const b = structuredClone(original); mutate(b); assert.throws(() => validateContent(b, cases)); });
test('T02 invalid or duplicate fixture references stop build', () => {
  assert.throws(() => validateContent(original, [...cases, cases[0]]));
  assert.throws(() => validateContent(original, [{ ...cases[0], challengeId: 'L99-C01' }]));
  assert.throws(() => validateContent(original, [{ ...cases[0], expectedQueryPoints: 0 }]));
});
