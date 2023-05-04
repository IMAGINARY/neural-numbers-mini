const fs = require('fs');
const config = require('../../config.json');
const localizedStrings = require('./strings.json');

const data = {};

let lang = config.defaultLanguage;

function str(id) {
  if (localizedStrings[id] !== undefined) {
    if(localizedStrings[id][lang] !== undefined) {
      return localizedStrings[id][lang];
    }
    return localizedStrings[id];
  }
  return id;
}

function getLang() {
  return lang;
}

function setLang(langCode) {
  lang = langCode;
}

function fileLang(filepath) {
  const parts = filepath.split('/');
  if (parts.length > 1 && parts[0] in config.languages) {
    return parts[0];
  }
  return config.defaultLanguage;
}

function pageTitle(title) {
  if (title === undefined) {
    return config.siteName;
  }
  return `${title} - ${config.siteName}`;
}

function getAlternates(fileStem, absolute = true) {
  const alternates = {};
  Object.keys(config.languages).forEach((code) => {
    alternates[code] = url(
      `${code !== config.defaultLanguage ? `${code}/` : ''}${fileStem}.html`,
      absolute
    );
  });
  alternates['x-default'] = url(`${fileStem}.html`, absolute);

  return alternates;
}


function localImage(name) {
  return `assets/img/${lang}/${name}`;
}

function cachebust() {
  return String(Date.now());
}

function url(aPath, absolute = false) {
  return `${absolute ? config.siteURL : ''}${config.basePath}${aPath}`;
}

function lUrl(aPath, absolute = false) {
  return url(
    `${getLang() !== config.defaultLanguage ? getLang() : ''}/${aPath}`,
    absolute
  );
}

function staticFile(path) {
  return `${process.env.STATIC_FILE_BASEPATH || ''}/${path}`;
}

module.exports = {
  str,
  setLang,
  getLang,
  fileLang,
  getAlternates,
  pageTitle,
  localImage,
  cachebust,
  url,
  lUrl,
  staticFile,
  config,
  data,
};
