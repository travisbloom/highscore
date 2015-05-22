var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');

var paths = {
  src: 'src',
  dist: 'www',
  libs: 'bower_components',
  sass: ['app/scss/**/*.scss'],
  js: ['app/js/**/*.js'],
  bower: 'bower_components',
  node: 'node_modules'
};

gulp.task('default', ['sass', 'js', 'js-lib', 'fonts', 'move-all']);

gulp.task('sass', function(done) {
  gulp.src(paths.src + '/scss/main.scss')
    .pipe(sass())
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('js', function(done) {
  gulp.src(paths.src + '/js/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('./www/js/'))
    .on('end', done);
});

gulp.task('js-lib', function(done) {
  gulp.src([
    paths.node + '/gulp-babel/node_modules/babel-core/browser-polyfill.js',
    paths.bower + '/ionic/js/ionic.bundle.js',
    paths.bower + '/jsSHA/src/sha1.js',
    paths.bower + '/d3/d3.js',
    paths.bower + '/n3-line-chart/build/line-chart.js',
    paths.bower + '/ng-cordova-oauth/ng-cordova-oauth.js',
    paths.bower + '/moment/moment.js'
  ])
    .pipe(concat('lib.js'))
    .pipe(gulp.dest('./www/js/'))
    .on('end', done);
});

gulp.task('move-all', function(done) {
  gulp
    .src([
      paths.src + '/**/*',
      '!' + paths.src + '/js/**/*',
      '!' + paths.src + '/scss/**/*'
    ])
    .pipe(gulp.dest(paths.dist))
    .on('end', done);
});

gulp.task('fonts', function(done) {
  gulp
    .src([
      paths.libs + '/ionic/fonts/**'
    ])
    .pipe(gulp.dest(paths.dist + '/assets/fonts'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.js, ['js']);
});

gulp.task('phonegap', function(done) {
  gulp.src([
    './www/**/*.*',
    './config.xml'
  ])
    .pipe(gulp.dest('../phonegap/'))
    .on('end', done);
});