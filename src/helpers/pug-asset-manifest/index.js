// eslint-disable-next-line import/no-extraneous-dependencies
const fs = require('fs');
const path = require('path');

module.exports = function(manifestFiles, options = {}) {
  const manifest = manifestFiles.reduce((acc, manifestFilePath) => {
    let manifestFile = {};
    if (fs.existsSync(manifestFilePath)) {
      try {
        manifestFile = JSON.parse(fs.readFileSync(manifestFilePath, 'utf8'));
      } catch(e) {
        console.error(`Error parsing manifest file: ${manifestFilePath}`, e);
      }
    }
    return Object.assign(acc, manifestFile);
  }, {});

  return {
    asset: (filepath) => {
      const parts = path.parse(filepath);
      return `${parts.base in manifest ? path.join(parts.dir, manifest[parts.base]) : filepath}`;
    },
  };
}
