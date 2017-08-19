var gulp         = require('gulp'),
    path         = require('path'),
    gutil        = require('gulp-util'),
    less         = require('gulp-less'),
    browserify   = require('browserify'),
    hbsfy        = require('hbsfy').configure({
        extensions: ['hbs']
    }),
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
gulp.task('js', function () {
    return browserify({
        entries: './src/js/main.js',
        debug: true,
        transform: [hbsfy]
    })
    .bundle()
    .pipe(source('bundle.min.js'))
    .pipe(buffer())
    .pipe(sourceMaps.init({loadMaps: true}))
        .pipe(uglify())
        .on('error', gutil.log)
    .pipe(sourceMaps.write('./'))
    .pipe(gulp.dest('./public/assets/js/'));
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

/**
 *  Default tasks
 */
gulp.task('default', ['css', 'js'], function () {
    gulp.watch('src/less/**/*.less', ['css']);
    gulp.watch(['src/**/*.js', 'src/**/*.hbs'], ['js']);
});