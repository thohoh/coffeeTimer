'use strict';

// Gulp Dependencies
var gulp = require('gulp');

// Development Dependencies
var jshint = require('gulp-jshint');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');

// Build Dependencies
var browserify = require('browserify');
var sass = require('gulp-sass');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

// Setup

var basePaths = {
  src: 'src/',
  build: 'build/',
  dest: 'dest/'
  };

var paths = {
  scripts: {
    src: basePaths.src + 'js/',
    build: basePaths.build + 'js/',
    dest: basePaths.dest + 'js/'
  },
  styles: {
    src: basePaths.src + 'css/',
    build: basePaths.build + 'css/',
    dest: basePaths.dest + 'css/'
  }
};

var appFiles = {
  scripts: '**/*.js'
};

var bg = {
  src : ['src/js/background.js'],
  devName: 'background-bundle.js',
  devDest: 'build/js/',
  prodName: 'background.js',
  devOpts: {
    entries: ['src/js/background.js'],
    debug: true
  }

};

var popup = {
  src: ['src/js/popup.js'],
  devName: 'popup-bundle.js',
  devDest: 'build/js/',
  prodName: 'popup.js',
  devOpts: {
    entries: ['src/js/popup.js'],
    debug: true
  }
};

var browserifyOnError = function (err) {
  gutil.log(gutil.colors.red('browserify task ' + err.name + ': ' + err.message));
  this.emit('end');
};



// Lint
gulp.task('lint-src', function () {
  return gulp.src('src/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// Browserify
gulp.task('browserify-bg', ['lint-src'], function () {
  return browserify(bg.devOpts)
    .bundle()
    .on('error', browserifyOnError)
    .pipe(source(bg.devName))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(bg.devDest));
});

gulp.task('browserify-popup', ['lint-src'], function () {
  return browserify(popup.devOpts)
    .bundle()
    .on('error', browserifyOnError)
    .pipe(source(popup.devName))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(popup.devDest));
});


// watch
gulp.task('watch', function () {
  gulp.watch('src/**/*.js', ['lint-src', 'browserify-bg', 'browserify-popup']);
});


// Tasks
gulp.task('build', ['lint-src', 'browserify-bg', 'browserify-popup']);

gulp.task('default', ['build']);