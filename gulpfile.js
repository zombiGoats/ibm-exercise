/*!
 * gulp
 * $ npm install gulp-ruby-sass gulp-autoprefixer gulp-minify-css gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-rename gulp-livereload gulp-cache del --save-dev
 */

// Load plugins
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    connect = require('gulp-connect'),
    livereload = require('gulp-livereload'),
    del = require('del');

// SCSS
gulp.task('styles', function() {
  return sass('scss/styles.scss', { style: 'expanded' })
    .pipe(gulp.dest('css'))
    .pipe(autoprefixer('last 2 version'))
    .pipe(notify({ message: 'Styles task complete' }));
});

//Minify Foundation CSS
gulp.task('minify-css', function() {
  return gulp.src(['css/*.css','!css/*.min.css'])
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('css/'));
});

// Scripts
gulp.task('scripts', function() {
  return gulp.src(['js/**/*.js', '!js/foundation/**', '!js/foundation.js','!js/vendor/mondernizr.js','!js/vendor/**', '!js/*.min.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    //.pipe(concat('app.js'))
    .pipe(gulp.dest('js/'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('js/'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

// Images
gulp.task('images', function() {
  return gulp.src('img/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest('img/'))
    .pipe(notify({ message: 'Images task complete' }));
});

// Clean
gulp.task('clean', function() {
  return del(['css', 'js', 'img', '!js/foundation/**','!js/vendor']);
});

// Webserver
gulp.task('webserver', function() {
  connect.server();
});

// Default task
gulp.task('default', function() {
  gulp.start('styles', 'scripts', 'images', 'minify-css', 'webserver', 'watch');
});

// Watch
gulp.task('watch', function() {

  // Watch .scss files
  gulp.watch('scss/**/*.scss', ['styles']);

  // Watch .css files
  gulp.watch('css/**/*.css', ['minify-css']);

  // Watch .js files
  gulp.watch('js/*.js', ['scripts']);

  // Watch image files
  gulp.watch('img/**/*', ['images']);

  // Create LiveReload server
  //livereload.listen();

  // Watch any files in dist/, reload on change
  //gulp.watch(['dist/**']).on('change', livereload.changed);

});