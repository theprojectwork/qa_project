"use strict";

const {
    src,
    dest,
    parallel,
    series,
    watch
} = require('gulp');
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const pug = require('gulp-pug');
const concat = require('gulp-concat');

// Concat All JS Files
function concatAllJS() {
    return src([
            'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
            'static/js/slideToggle.min.js',
            'node_modules/tiny-slider/dist/min/tiny-slider.js',
            'node_modules/counterup2/dist/index.js',
            'node_modules/baguettebox.js/dist/baguetteBox.min.js',
            'node_modules/imagesloaded/imagesloaded.pkgd.min.js',
            'node_modules/isotope-layout/dist/isotope.pkgd.min.js',
            'node_modules/mediabox/dist/mediabox.min.js',
            'node_modules/wowjs/dist/wow.min.js',
            'static/js/countdown.min.js',
            'static/js/cookiealert.js'
        ])
        .pipe(concat('all-js-libraries.js'))
        .pipe(gulp.dest('dist/js'));
}

// CSS Autoprefixer
function cssAutoprefixer() {
    return src('node_modules/bootstrap/dist/css/bootstrap.min.css')
        .pipe(postcss([autoprefixer({
            overrideBrowserslist: ['last 2 versions']
        })]))
        .pipe(dest('dist/css/'))
}

// Move CSS to dist/css
function concatAllCSS() {
    return src([
            'node_modules/wowjs/css/libs/animate.css',
            'dist/css/bootstrap.min.css',
            'node_modules/bootstrap-icons/font/bootstrap-icons.css',
            'node_modules/flag-icon-css/css/flag-icon.min.css',
            'node_modules/tiny-slider/dist/tiny-slider.css',
            'node_modules/baguettebox.js/dist/baguetteBox.min.css',
            'node_modules/mediabox/dist/mediabox.min.css'
        ])
        .pipe(concat('all-css-libraries.css'))
        .pipe(gulp.dest('dist/css'));
}

// Move Bootstrap Icons to dist/fonts
function bootstrapIcons() {
    return src('node_modules/bootstrap-icons/font/fonts/*')
        .pipe(dest('dist/css/fonts'));
}

// Move Flag Icons to dist/flags
function flagIcons() {
    return src('node_modules/flag-icon-css/flags/*/*')
        .pipe(dest('dist/flags'));
}

// Move static Images to dist/img
function staticImg() {
    return src([
            'static/img/*',
            'static/img/*/*',
            'static/img/*/*/*',
            'static/img/*/*/*/*'
        ])
        .pipe(dest('dist/img'));
}

// Watching All Static JS Files
function staticJS() {
    return src('static/js/*.js')
        .pipe(dest('dist/js'));
}

// Watching All Static CSS Files
function staticCSS() {
    return src('static/css/*.css')
        .pipe(dest('dist/css'));
}

// Pug to HTML Convert
function pugToHtml() {
    return src('src/pug/*.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(dest('dist/'));
}

// SCSS to CSS Convert
function sassToCss() {
    return src('src/scss/*.scss')
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(postcss([autoprefixer({
            overrideBrowserslist: ['last 2 versions']
        })]))
        .pipe(dest('dist/'))
}

// SCSS - Pug Watching
function watching() {
    watch('src/scss/*.scss', series(sassToCss));
    watch(['src/pug/*.pug', 'src/pug/*/*.pug'], series(pugToHtml));
    watch(['static/img/*', 'static/img/*/*', 'static/img/*/*/*', 'static/img/*/*/*/*'], series(staticImg));
    watch('static/js/*', series(staticJS));
    watch('static/css/*', series(staticCSS));
}

const watchAll = parallel(watching);

exports.watch = watchAll;
exports.default = series(concatAllJS, cssAutoprefixer, concatAllCSS, bootstrapIcons, flagIcons, staticImg, staticJS, staticCSS, pugToHtml, sassToCss, watching);