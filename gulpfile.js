var gulp         = require('gulp'),
    path         = require('path'),
    gutil        = require('gulp-util'),
    nodemon      = require('nodemon'),
    less         = require('gulp-less'),
    browserSync  = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify       = require('gulp-uglify'),
    rename       = require('gulp-rename'),
    cssnano      = require('gulp-cssnano'),
    sourcemaps   = require('gulp-sourcemaps'),
    wrap         = require('gulp-wrap-amd');

/**
 *  Check LESS for errors,
 *  compile to CSS,
 *  autoprefix it,
 *  minify it,
 *  add sourcemaps
 */
gulp.task('css', function () {
    return gulp.src('src/less/main.less')
    .pipe(sourcemaps.init())
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
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/assets/css'))
    .pipe(browserSync.reload({stream:true}));
});

/**
 *  Javascript
 */
gulp.task('js',function(){
  gulp.src('src/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(gulp.dest('public/assets'))
    .pipe(uglify())
    .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/assets'))
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