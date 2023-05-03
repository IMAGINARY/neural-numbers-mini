const fs = require('fs');
const path = require('path');
const shell = require('shelljs');

module.exports = function copyStatic(config) {
  config.copy.forEach(([src, dest]) => {
    const srcPath = path.resolve(src);
    const destPath = path.resolve(dest);

    if (fs.existsSync(srcPath) || fs.existsSync(path.dirname(srcPath))) {
      shell.mkdir('-p', dest.endsWith('/') ? destPath : path.dirname(destPath));
      shell.cp('-R', srcPath, destPath);
    }
  });
};
