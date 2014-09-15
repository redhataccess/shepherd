'use strict';

var gulp = require('gulp');
var jsoncombine = require('gulp-jsoncombine');
var replace = require('gulp-replace-task');

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

gulp.task('default', ['inject']);
