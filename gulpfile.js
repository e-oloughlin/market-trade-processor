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
        paths: [ path.join(__dirname, 'src', 'less', 'includes') ]
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
  gulp.src('src/js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(gulp.dest('public/assets/js'))
    .pipe(uglify())
    .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/assets/js'))
});

gulp.task('browser-sync', ['nodemon'], function() {
    browserSync.init(null, {
        proxy: "http://localhost:3000",
        files: ["public/**/*.*"],
        browser: "google chrome",
        port: 7000,
    });
});

gulp.task('nodemon', function (cb) {
    var started = false;

    return nodemon({
        script: 'app.js'
    }).on('start', function () {
        // to avoid nodemon being started multiple times
        // thanks @matthisk
        if (!started) {
            cb();
            started = true;
        }
    });
});

/**
 *  Default tasks
 */
gulp.task('default', ['browser-sync', 'css', 'js'], function () {
    gulp.watch('src/less/**/*.less', ['css']);
    gulp.watch('src/js/**/*.js', ['js']);
});