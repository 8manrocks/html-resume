const fs = require('fs');
const path = require('path');

const supportedExtensions = new Set(['.json', '.html']);

function getBundleName(args) {
  if (args.length > 1) {
    throw new Error('Expected at most one bundle name.');
  }

  if (args.length === 0) {
    return null;
  }

  const target = args[0].trim();
  if (!target || path.basename(target) !== target) {
    throw new Error(`Invalid bundle name: ${args[0]}`);
  }

  const extension = path.extname(target);
  if (extension && !supportedExtensions.has(extension.toLowerCase())) {
    throw new Error('Bundle names may optionally end in .json or .html.');
  }

  const bundleName = extension ? path.basename(target, extension) : target;
  if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(bundleName)) {
    throw new Error(`Invalid bundle name: ${args[0]}`);
  }

  return bundleName;
}

function selectFiles(directory, extension, bundleName) {
  const availableFiles = fs.readdirSync(directory)
    .filter(file => path.extname(file).toLowerCase() === extension)
    .sort();

  if (!bundleName) {
    return availableFiles;
  }

  const targetFile = `${bundleName}${extension}`;
  if (!availableFiles.includes(targetFile)) {
    const availableBundles = availableFiles
      .map(file => path.basename(file, extension))
      .join(', ');
    throw new Error(
      `Bundle "${bundleName}" was not found. Available bundles: ${availableBundles}`
    );
  }

  return [targetFile];
}

module.exports = { getBundleName, selectFiles };
