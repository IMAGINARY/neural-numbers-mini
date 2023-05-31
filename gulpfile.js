const path = require('path');
const childProcess = require('child_process');
require('dotenv').config();
const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const gulpWebpack = require('webpack-stream');
const webpack = require('webpack');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const touch = require('gulp-touch-fd');
const rev = require('gulp-rev');
const gulpIf = require('gulp-if');
const del = require('del');
const pugHelper = require('./src/helpers/pug-helper');
const pugAssetManifest = require('./src/helpers/pug-asset-manifest');
const pugData = require('./src/pug/lib');
const copyStatic = require('./src/helpers/copy-static');
const vendorFileList = require('./vendor.json');

const { series, parallel } = gulp;

const OUTPUT_DIR = './dist';
const ASSET_MANIFEST = `${OUTPUT_DIR}/assets/rev-manifest.json`;
const WEBPACK_MANIFEST = `${OUTPUT_DIR}/assets/webpack-manifest.json`;
const GIT_COMMIT_HASH = revision = childProcess.execSync('git rev-parse HEAD').toString().trim();

if (!process.env.GIT_COMMIT_HASH) {
  process.env.GIT_COMMIT_HASH = GIT_COMMIT_HASH;
}

const targets = {
  html: {
    src: ['./src/pug/**/*.pug', '!./src/pug/include/**/*.pug', '!./src/pug/tpl/**/*.pug', '!./src/pug/sections/**/*.pug'],
    watchSrc: ['./src/pug/**/*.pug', ASSET_MANIFEST, WEBPACK_MANIFEST],
    dest: `${OUTPUT_DIR}`,
  },
  styles: {
    src: './src/sass/**/*.scss',
    dest: `${OUTPUT_DIR}/assets/css`,
    clean: [
      { base: 'fonts', extensions: ['.css', '.css.map'] },
      { base: 'default', extensions: ['.css', '.css.map'] },
      { base: 'fonts-??????????', extensions: ['.css', '.css.map'] },
      { base: 'default-??????????', extensions: ['.css', '.css.map'] },
    ],
  },
  scripts: {
    watchSrc: './src/js/**/*.js',
    dest: `${OUTPUT_DIR}/assets/js`,
    entry: {
      default: {
        import: './src/js/main.js',
      },
    },
    clean: [
      { base: 'default', extensions: ['.js', '.js.map', '.js.LICENSE.txt'] },
      { base: 'default.????????????????????', extensions: ['.min.js', '.min.js.map', '.min.js.LICENSE.txt'] },
    ],
  },
};

function cleanTarget(target) {
  if (Array.isArray(target.clean)) {
    target.clean.forEach((item) => {
      if (typeof item === 'string') {
        del.sync(path.resolve(target.dest, item));
      } else if (typeof item === 'object') {
        item.extensions.forEach((ext) => {
          del.sync(path.resolve(target.dest, `${item.base}${ext}`));
        });
      }
    });
  }
}

function buildHtml() {
  return gulp.src(targets.html.src)
    .pipe(pugHelper())
    .pipe(pug({
      pretty: true,
      data: { ...pugAssetManifest([ASSET_MANIFEST, WEBPACK_MANIFEST]), ...pugData },
    }))
    .pipe(rename({ extname: '.html' }))
    .pipe(gulp.dest(targets.html.dest))
    // Touch the file, otherwise the date from the pug source is used, which is not accurate
    // and also the browser might not update the page.
    .pipe(touch());
}

function buildStylesheets() {
  const prod = (process.env.NODE_ENV !== 'development');

  cleanTarget(targets.styles);
  del.sync(ASSET_MANIFEST);

  return gulp.src(targets.styles.src, { sourcemaps: true })
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: ['./node_modules'],
      quietDeps: true,
    }).on('error', sass.logError))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(gulpIf(prod, rev()))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(targets.styles.dest))
    .pipe(gulpIf(prod, rev.manifest(ASSET_MANIFEST, { merge: true })))
    .pipe(gulpIf(prod, gulp.dest('.')));
}

function js(target) {
  const { dest, entry } = target;
  const mode = (process.env.NODE_ENV === 'development' ? 'development' : 'production');

  const src = typeof Object.values(entry)[0] === 'string'
    ? Object.values(entry)[0] : Object.values(entry)[0].import;

  return gulp.src(src)
    .pipe(gulpWebpack({
      mode,
      entry,
      module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                cacheDirectory: './.babel-cache',
                presets: [
                  // Note: to debug Babel, the cache has to be disabled or emptied
                  ['@babel/preset-env', { useBuiltIns: 'usage', corejs: 3, debug: false }],
                  '@babel/preset-react',
                ],
              },
            },
          },
        ],
      },
      resolve: {
        extensions: ['.js', '.jsx'],
      },
      plugins: [
        new WebpackAssetsManifest({
          output: WEBPACK_MANIFEST,
          writeToDisk: true,
          merge: 'customize',
          customize(anEntry, original, manifest) {
            const skippedExtensions = ['.LICENSE.txt', '.map'];
            if (!manifest.isMerging) {
              if (skippedExtensions.some((ext) => anEntry.key.endsWith(ext))) {
                return false;
              }
            }
            return anEntry;
          },
        }),
        new BundleAnalyzerPlugin({
          analyzerMode: 'disabled',
          generateStatsFile: !!process.env.WEBPACK_STATS,
          statsFilename: 'stats/webpack.stats.json',
        }),
        new webpack.DefinePlugin({
          'process.env.STATIC_FILE_BASEPATH': JSON.stringify(process.env.STATIC_FILE_BASEPATH),
          'process.env.SENTRY_DSN': JSON.stringify(process.env.SENTRY_DSN),
          'process.env.GIT_COMMIT_HASH': JSON.stringify(process.env.GIT_COMMIT_HASH),
        }),
      ],
      devtool: 'source-map',
      output: {
        filename: mode === 'development' ? '[name].js' : '[name].[fullhash].min.js',
      },
    }, webpack))
    .pipe(gulp.dest(dest));
}

function buildScripts() {
  cleanTarget(targets.scripts);
  return js(targets.scripts);
}

function copyVendorFiles(done) {
  copyStatic(vendorFileList);
  done();
}

function watch() {
  process.env.NODE_ENV = 'development';

  gulp.watch(targets.styles.watchSrc || targets.styles.src, series(buildStylesheets, buildHtml));
  gulp.watch(targets.scripts.watchSrc, series(buildScripts, buildHtml));
  gulp.watch(targets.html.watchSrc || targets.html.src, buildHtml);
}

const build = series(
  parallel(
    copyVendorFiles,
    buildStylesheets,
    buildScripts
  ),
  buildHtml
);

exports.vendorFiles = copyVendorFiles;
exports.html = buildHtml;
exports.styles = series(buildStylesheets, buildHtml);
exports.scripts = series(buildScripts, buildHtml);
exports.watch = watch;

exports.build = build;
exports.default = build;
