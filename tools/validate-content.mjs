import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { assertSchema } from './schema.mjs';
import { evaluateText } from '../site/query/evaluate.js';
import { tokens } from '../site/query/catalog.js';
import { lex, parseSearch } from '../site/query/parser.js';
export const root = fileURLToPath(new URL('../', import.meta.url));
const read = name => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'));
export function contentBundle() {
  const lessons = Array.from({ length: 6 }, (_, i) => read('content/lessons/L0' + (i + 1) + '.json'));
  const symbols = read('content/symbols.json'), sources = read('content/sources.json');
  assertSchema(symbols, read('schemas/symbols.schema.json')); assertSchema(sources, read('schemas/sources.schema.json'));
  return validateContent({ lessons, symbols: symbols.symbols, sources: sources.sources }, read('qa/query-cases.json').cases);
}
export function validateContent(input, cases) {
  const lessons = input.lessons, symbols = { schemaVersion: 1, symbols: input.symbols }, sources = { schemaVersion: 1, sources: input.sources };
  if (!Array.isArray(lessons) || lessons.length !== 6) throw new Error('LESSON_COUNT');
  for (const lesson of lessons) assertSchema(lesson, read('schemas/lesson.schema.json'));
  assertSchema(symbols, read('schemas/symbols.schema.json')); assertSchema(sources, read('schemas/sources.schema.json'));
  const unique = xs => { if (new Set(xs).size !== xs.length) throw new Error('DUPLICATE_ID'); };
  unique(lessons.map(x => x.id)); unique(symbols.symbols.map(x => x.id)); unique(sources.sources.map(x => x.id));
  const sourceMap = new Map(sources.sources.map(x => [x.id, x]));
  const symbolMap = new Map(symbols.symbols.map(x => [x.id, x]));
  const visited = new Set(), active = new Set();
  const visit = id => { if (active.has(id)) throw new Error('PREREQUISITE_CYCLE'); if (visited.has(id)) return; const l = lessons.find(x => x.id === id); if (!l) throw new Error('PREREQUISITE_ID'); active.add(id); unique(l.prerequisites); l.prerequisites.forEach(visit); active.delete(id); visited.add(id); };
  const matrix = fs.readFileSync(path.join(root, 'docs/research/SOURCE_MATRIX.md'), 'utf8');
  for (const source of sourceMap.values()) { const u = new URL(source.url); if (u.protocol !== 'https:' || u.username || u.password || u.hash || !matrix.includes(source.id)) throw new Error('SOURCE_INVALID'); }
  for (const l of lessons) {
    visit(l.id);
    if (l.challenges.length !== (l.id === 'L01' ? 6 : 2)) throw new Error('MISSION_COUNT');
    if (l.sourceIds.some(id => !sourceMap.has(id))) throw new Error('SOURCE_ID');
    for (const [i, c] of l.challenges.entries()) {
      if (c.id !== l.id + '-C0' + (i + 1) || c.symbolIds.some(id => !symbolMap.has(id))) throw new Error('CHALLENGE_ID');
      if (c.methodQuestions.map(q => q.id).join() !== 'M1,M2') throw new Error('METHOD_ID');
      for (const q of c.methodQuestions) if (q.options.map(x => x.id).sort().join() !== 'A,B,C' || !q.options.some(x => x.id === q.correctOption)) throw new Error('METHOD_OPTION');
      const m = c.mission;
      if (m.support === 'independent') {
        if (m.example || m.starter || m.gaps.length) throw new Error('INDEPENDENT_STARTER');
      } else {
        parseSearch(m.example);
        if (m.support === 'shown' && (m.gaps.length || evaluateText(m.example, c.referenceQuery).queryPoints !== 70 || evaluateText(m.starter, c.referenceQuery).queryPoints !== 70)) throw new Error('SHOWN_INTENT');
        if (m.support === 'guided') {
          if (!m.gaps.length) throw new Error('GUIDED_GAPS');
          unique(m.gaps.map(g => g.marker));
          let solution = m.starter;
          for (const g of m.gaps) {
            unique(g.options);
            if (!g.options.includes(g.answer) || solution.split(g.marker).length !== 2) throw new Error('GAP_ANSWER');
            solution = solution.replace(g.marker, g.answer);
          }
          if (/___[0-9]+___/.test(solution) || evaluateText(solution, c.referenceQuery).queryPoints !== 70) throw new Error('STARTER_INTENT ' + c.id);
        }
      }
      for (const query of [c.referenceQuery, ...c.acceptedVariants, c.hints[2]]) {
        if (evaluateText(query, c.referenceQuery).queryPoints !== 70) throw new Error('QUERY_INTENT ' + c.id);
        // Every authored solution must be constructible with the actual closed palette.
        const palette = new Set(tokens.filter(t => t.lexeme !== '\n').flatMap(t => lex(t.lexeme).map(v => JSON.stringify([v.kind, v.value]))));
        if (lex(query).some(v => !palette.has(JSON.stringify([v.kind, v.value])))) throw new Error('PALETTE_GAP ' + c.id);
      }
    }
  }
  const challenges = lessons.flatMap(l => l.challenges); unique(challenges.map(c => c.id));
  if (challenges.length !== 16) throw new Error('CHALLENGE_COUNT');
  unique(cases.map(c => c.id));
  for (const c of cases) { const challenge = challenges.find(x => x.id === c.challengeId); if (!challenge) throw new Error('FIXTURE_ID'); const result = evaluateText(c.query, challenge.referenceQuery); if (result.status !== c.expectedStatus || result.queryPoints !== c.expectedQueryPoints) throw new Error('FIXTURE_FAILED ' + c.id); }
  return { courseVersion: 1, lessons, symbols: symbols.symbols, sources: sources.sources };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) { const b = contentBundle(); console.log('Validated ' + b.lessons.length + ' lessons, ' + b.lessons.flatMap(l => l.challenges).length + ' missions, ' + b.sources.length + ' sources and ' + read('qa/query-cases.json').cases.length + ' query fixtures.'); }
