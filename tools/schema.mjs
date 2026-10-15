// This validates the keyword subset used by the checked-in schemas, not arbitrary JSON Schema.
export function assertSchema(value, schema, path = '$') {
  const fail = () => { throw new Error('SCHEMA_INVALID at ' + path); };
  if (Object.hasOwn(schema, 'const') && value !== schema.const) fail();
  if (schema.enum && !schema.enum.includes(value)) fail();
  if (schema.type) {
    const valid = schema.type === 'object' ? value !== null && typeof value === 'object' && !Array.isArray(value) : schema.type === 'array' ? Array.isArray(value) : schema.type === 'integer' ? Number.isSafeInteger(value) : typeof value === schema.type;
    if (!valid) fail();
  }
  if (typeof value === 'string' && ((schema.minLength !== undefined && [...value].length < schema.minLength) || (schema.maxLength !== undefined && [...value].length > schema.maxLength) || (schema.pattern && !new RegExp(schema.pattern).test(value)))) fail();
  if (typeof value === 'number' && ((schema.minimum !== undefined && value < schema.minimum) || (schema.maximum !== undefined && value > schema.maximum))) fail();
  if (Array.isArray(value)) {
    if ((schema.minItems !== undefined && value.length < schema.minItems) || (schema.maxItems !== undefined && value.length > schema.maxItems)) fail();
    if (schema.items) value.forEach((v, i) => assertSchema(v, schema.items, path + '[' + i + ']'));
  } else if (value !== null && typeof value === 'object') {
    if (schema.required?.some(k => !Object.hasOwn(value, k))) fail();
    for (const k of Object.keys(value)) { if (schema.additionalProperties === false && !Object.hasOwn(schema.properties ?? {}, k)) fail(); if (schema.properties?.[k]) assertSchema(value[k], schema.properties[k], path + '.' + k); }
  }
  schema.allOf?.forEach(s => assertSchema(value, s, path));
  if (schema.if) { let matches = true; try { assertSchema(value, schema.if, path); } catch { matches = false; } const branch = matches ? schema.then : schema.else; if (branch) assertSchema(value, branch, path); }
}
