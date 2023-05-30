const fs = require('fs');
const degit = require('degit');
const packageJson = require('../package.json');

async function fetchFromGit(repository, path) {
  return degit(repository, { cache: false, force: true }).clone(path);
}

Object.keys(packageJson.vendor).forEach(async (key) => {
  const props = packageJson.vendor[key];
  const path = `./vendor/${key}`;
  if (!fs.existsSync(path)) {
    await degit(props.repository, { cache: false, force: true }).clone(path);
  }
});
