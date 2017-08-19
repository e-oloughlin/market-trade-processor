var gulp         = require('gulp'),
    path         = require('path'),
    gutil        = require('gulp-util'),
    nodemon      = require('nodemon'),
    less         = require('gulp-less'),
    browserify   = require('browserify'),
    source       = require('vinyl-source-stream'),
    buffer       = require('vinyl-buffer'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify       = require('gulp-uglify'),
    rename       = require('gulp-rename'),
    cssnano      = require('gulp-cssnano'),
    sourceMaps   = require('gulp-sourcemaps'),
    wrap         = require('gulp-wrap-amd');

/**
 *  Javascript
 */
gulp.task('js',function(){
    gulp.src('src/**/*.js')
        .pipe(sourceMaps.init())
        .pipe(gulp.dest('public/assets'))
        .pipe(uglify())
        .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourceMaps.write())
        .pipe(gulp.dest('public/assets'))
});

/**
 *  Check LESS for errors,
 *  compile to CSS,
 *  autoprefix it,
 *  minify it,
 *  add sourcemaps
 */
gulp.task('css', function () {
    return gulp.src('src/less/main.less')
    .pipe(sourceMaps.init())
    .pipe(less({
        paths: [
            path.join(__dirname, 'src', 'less', 'bootstrap'),
            path.join(__dirname, 'src', 'less', 'bootstrap', 'mixins'),
            path.join(__dirname, 'src', 'less', 'includes')
        ]
    }))
    .pipe(autoprefixer('last 4 version'))
    .pipe(cssnano())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourceMaps.write())
    .pipe(gulp.dest('public/assets/css'));
});

gulp.task('templates', () => {
    gulp.src('src/js/templates/**/*.hbs')
        .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
        .pipe(gulp.dest('public/assets/js/templates'));
});

/**
 *  Default tasks
 */
gulp.task('default', ['css', 'js', 'templates'], function () {
    gulp.watch('src/less/**/*.less', ['css']);
    gulp.watch('src/**/*.js', ['js']);
    gulp.watch('src/**/*.hbs', ['templates']);
});