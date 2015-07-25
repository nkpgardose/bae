'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;


var AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

// Development checker
// Lint JavaScript
gulp.task('jshint', function() {
  return gulp.src(['src/scripts/**/*.js', 'gulpfile.js'])
    .pipe(reload({stream: true, once: true}))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

// Lint JS code style
gulp.task('jscs', function() {
  return gulp.src(['src/scripts/**/*.js', 'gulpfile.js'])
    .pipe(reload({stream: true, once: true}))
    .pipe($.jscs())
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

// BrowserSync and watch for dev
gulp.task('serve', ['styles:dev', 'scripts:dev'], function() {
  browserSync.init({
    notify: false,
    server: './',
    startPath: 'src/index.html'
  });

  gulp.watch(['src/**/*.html'], reload);
  gulp.watch(['src/styles/**/*.scss'], ['styles:dev', reload]);
  gulp.watch(['src/scripts/**/*.js'], ['scripts:dev', reload]);
});

// Scripts Development 
gulp.task('scripts:dev', ['jscs', 'jshint'], function() {
  gulp.src('src/scripts/**/*.js')
    .pipe($.sourcemaps.init())
    .pipe($.uglify({
      sourceRoot: '.',
      soruceMapIncludeSources: true
    }))
    .pipe($.concat('bae.min.js'))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('build'))
    .pipe($.size({title: 'scripts'}));
});

// Styles Development 
gulp.task('styles:dev', function() {
  return gulp.src('src/styles/*.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      precision: 10,
      onError: console.error.bind(console, 'Sass error:')
    }))
    .pipe($.cssInlineImages({
      webRoot: 'src'
    }))
    .pipe($.if('*.css', $.csso())) 
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe($.concat('bae.min.css'))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('build'))
    .pipe($.size({title: 'styles'}));
});

// Scripts Production
gulp.task('scripts', ['jscs', 'jshint'], function() {
  return gulp.src('src/scripts/**/*.js')
      .pipe($.sourcemaps.init())
      .pipe($.concat('bae.js'))
      .pipe(gulp.dest('./dist/scripts'))
      .pipe($.uglify({
        sourceRoot: '.',
        soruceMapIncludeSources: true
      }))
      .pipe($.concat('bae.min.js'))
      .pipe($.sourcemaps.write('./'))
      .pipe(gulp.dest('./dist/scripts'))
      .pipe($.size({title: 'scripts'}));
});

// Styles Production
gulp.task('styles', function() {
  return gulp.src('src/styles/*.scss')
      .pipe($.sourcemaps.init())
      .pipe($.sass({
        precision: 10,
        onError: console.error.bind(console, 'Sass error:')
      }))
      .pipe($.cssInlineImages({
        webRoot: 'src'
      }))
      .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
      .pipe($.concat('bae.css'))
      .pipe(gulp.dest('./dist/styles'))
      // Minify css
      .pipe($.if('*.css', $.csso()))
      .pipe($.concat('bae.min.css'))
      .pipe($.sourcemaps.write('./'))
      .pipe(gulp.dest('./dist/styles'))
      .pipe($.size({title: 'styles'}));
});

gulp.task('default', ['scripts', 'styles']);