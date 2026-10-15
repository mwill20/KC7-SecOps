import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { contentBundle, root } from './validate-content.mjs';
import { runtimeFiles, outputFiles } from './files.mjs';
const target = path.join(root, 'dist');
if (path.resolve(target) !== path.resolve(root, 'dist') || fs.existsSync(target) && fs.lstatSync(target).isSymbolicLink()) throw new Error('BUILD_PATH');
function inspect(dir, prefix = '') {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const relative = prefix + entry.name;
    if (entry.isSymbolicLink()) throw new Error('BUILD_SYMLINK');
    if (entry.isDirectory()) inspect(path.join(dir, entry.name), relative + '/');
    else if (!outputFiles.includes(relative)) throw new Error('UNEXPECTED_ARTIFACT_FILE ' + relative);
  }
}
inspect(target);
const bundle = contentBundle();
for (const file of runtimeFiles) {
  const out = path.join(target, file); fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.copyFileSync(path.join(root, 'site', file), out);
}
fs.writeFileSync(path.join(target, 'content.js'), 'export default ' + JSON.stringify(bundle) + ';\n');
fs.writeFileSync(path.join(target, '.nojekyll'), '');
inspect(target);
const digest = crypto.createHash('sha256');
for (const name of [...outputFiles].sort()) { digest.update(name + '\0'); digest.update(fs.readFileSync(path.join(target, name))); }
console.log('Static artifact: ' + outputFiles.length + ' files; SHA256 ' + digest.digest('hex'));
