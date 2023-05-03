const fs = require('fs');
const simpleGit = require('simple-git');
const packageJson = require('../package.json');

Object.keys(packageJson.vendor).forEach((key) => {
  const props = packageJson.vendor[key];
  const path = `./vendor/${key}-${props.tag}`;
  if (!fs.existsSync(path)) {
    const git = simpleGit();
    git.clone(props.repository, path, ['--depth=1', `--branch=${props.tag}`], (err) => {
      if (err) {
        console.log(`Error cloning ${key}`, err);
      }
    })
  }
});
