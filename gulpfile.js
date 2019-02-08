// gulpfile.js
var gulp = require('gulp');
var concat = require('gulp-concat');

var paths = {
  src: 'src',
  srcJS: 'src/**/*.js',
  tmp: 'tmp',
  tmpJS: 'tmp/**/*.js',
  dist: 'dist',
  distJS: 'dist/**/*.js'
};

gulp.task('bundle-js', function() {
  return gulp.src('./src/**/*.js')
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('./dist/'));
});

gulp.watch(['toBundletheseJs/**/*.js'], function () {
        gulp.run('bundle-js');
    });
