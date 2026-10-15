export const total = r => r.queryPoints + r.methodPoints + r.completionPoints;
export function newAttempt(challengeId) {
  return { challengeId, tokenIds: [], queryResult: null, methodChoices: { M1: null, M2: null }, methodPoints: null, executedAcknowledged: false, reviewedAcknowledged: false, highestHint: 0 };
}
export function changeTokens(attempt, tokenIds) {
  return { ...newAttempt(attempt.challengeId), tokenIds: [...tokenIds], highestHint: attempt.highestHint };
}
export function gradeMethod(attempt, challenge) {
  return challenge.methodQuestions.reduce((points, q) => points + (attempt.methodChoices[q.id] === q.correctOption ? 10 : 0), 0);
}
export function reduceAttempt(attempt, contentVersion) {
  const q = attempt.queryResult?.queryPoints ?? 0;
  const completion = q === 70 && attempt.executedAcknowledged && attempt.reviewedAcknowledged ? 10 : 0;
  return { challengeId: attempt.challengeId, contentVersion, queryPoints: q, methodPoints: attempt.methodPoints ?? 0, completionPoints: completion, practiced: completion === 10, highestHint: attempt.highestHint };
}
export function bestAttempt(saved, current) {
  if (!saved) return { ...current };
  const a = [total(current), current.queryPoints, current.methodPoints, current.completionPoints];
  const b = [total(saved), saved.queryPoints, saved.methodPoints, saved.completionPoints];
  let winner = saved;
  for (let i = 0; i < a.length; i++) { if (a[i] !== b[i]) { if (a[i] > b[i]) winner = current; break; } }
  return { ...winner, highestHint: Math.max(saved.highestHint, current.highestHint) };
}
export function statusLabel(record) {
  if (!record || record.queryPoints !== 70 || record.methodPoints !== 20) return 'In progress';
  return record.practiced ? 'Practiced — self-attested' : 'Symbolic mastery';
}
