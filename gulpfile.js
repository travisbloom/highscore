var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var templateCache = require('gulp-angular-templatecache');
var browserify = require("browserify");
var babelify = require("babelify");
var source = require('vinyl-source-stream');


var paths = {
  src: 'src',
  dist: 'www',
  libs: 'bower_components',
  tmp: '.tmp',
  bower: 'bower_components',
  node: 'node_modules'
};

gulp.task('default', ['sass', 'js', 'js-lib', 'fonts', 'move-all']);

gulp.task('sass', function (done) {
  gulp.src(paths.src + '/shared/styles/app.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.dist))
    .on('end', done);
});

gulp.task('js', ['templateCache'], function(done) {
  browserify({
    debug: true,
    entries: paths.src + '/app.js'
  })
    .transform(babelify)
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('./www/'))
    .on('end', done);
});

gulp.task('templateCache', function () {
  gulp.src([paths.src + '/**/*.html',  '!' + paths.src + '/index.html'])
    .pipe(templateCache(
      'templateCache.js', {
        moduleSystem: 'Browserify',
        templateHeader: 'function templateCache($templateCache) {',
        templateFooter: '}'
    }))
    .pipe(gulp.dest(paths.tmp));
});

gulp.task('js-lib', function (done) {
  gulp.src([
    paths.node + '/gulp-babel/node_modules/babel-core/browser-polyfill.js',
    paths.bower + '/ionic/js/ionic.bundle.js',
    paths.bower + '/jsSHA/src/sha1.js',
    paths.bower + '/d3/d3.js',
    paths.bower + '/n3-line-chart/build/line-chart.js',
    paths.bower + '/ng-cordova-oauth/ng-cordova-oauth.js',
    paths.bower + '/moment/moment.js'
  ])
    .pipe(sourcemaps.init())
    .pipe(concat('libraries.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./www/'))
    .on('end', done);
});

gulp.task('move-all', function (done) {
  gulp
    .src([
      paths.src + '/**/*',
      '!' + paths.src + '/{components,components/**}',
      '!' + paths.src + '/{shared,shared/**}',
      '!' + paths.src + '/**/*.js'
    ])
    .pipe(gulp.dest(paths.dist))
    .on('end', done);
});

gulp.task('fonts', function (done) {
  gulp
    .src([
      paths.libs + '/ionic/fonts/**'
    ])
    .pipe(gulp.dest(paths.dist + '/assets/fonts'))
    .on('end', done);
});

gulp.task('watch', function () {
  gulp.watch(paths.src + '/**/*.scss', ['sass']);
  gulp.watch(paths.src + '/**/*.js', ['js']);
  gulp.watch(paths.src + '/**/*.html', ['js']);
});

gulp.task('phonegap', function (done) {
  gulp.src([
    './www/**/*.*',
    './config.xml'
  ])
    .pipe(gulp.dest('../phonegap/'))
    .on('end', done);
});