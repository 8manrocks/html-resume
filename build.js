const { spawnSync } = require('child_process');
const path = require('path');
const { getBundleName } = require('./bundle-target');

function run(script, bundleName) {
  const args = [path.join(__dirname, script)];
  if (bundleName) {
    args.push(bundleName);
  }

  const result = spawnSync(process.execPath, args, {
    cwd: __dirname,
    stdio: 'inherit',
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

try {
  const bundleName = getBundleName(process.argv.slice(2));
  run('generate-resume.js', bundleName);
  run('generate-pdf.js', bundleName);
} catch (error) {
  console.error('Error building resumes:', error.message);
  process.exit(1);
}
