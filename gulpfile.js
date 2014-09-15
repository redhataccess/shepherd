'use strict';

var gulp = require('gulp');
var jsoncombine = require('gulp-jsoncombine');
var replace = require('gulp-replace-task');
var cssmin = require('gulp-cssmin');
var uglify = require('gulp-uglify');

gulp.task('copy-deps', function() {
    gulp.src('bower_components/intro.js/introjs.css')
        .pipe(cssmin())
        .pipe(gulp.dest('dist'));

    gulp.src('bower_components/intro.js/intro.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('inject', function() {
    function inject(paths) {
        gulp.src('./tour.js')
            .pipe(replace({
                patterns: [{
                    match: 'paths',
                    replacement: paths
                }]
            }))
            .pipe(gulp.dest('./dist'));
    }

    gulp.src('./paths/**/*.json')
        .pipe(jsoncombine('__fake.js', inject));

});

gulp.task('default', ['copy-deps', 'inject']);
