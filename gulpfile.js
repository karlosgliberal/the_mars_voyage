var fs = require('fs');
var gulp = require('gulp'),
    print = require('gulp-print'),
    babel = require('gulp-babel'),
    webserver = require('gulp-webserver'),


gulp.task('build', function() {
    return gulp.src('sketch.js')
        .pipe(print())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('build/sketch.js'));
});


gulp.task('serve', ['build'], function() {
    gulp.src('build')
        .pipe(webserver({open: true}));
});


gulp.task('watch', function(){
    gulp.watch('sketch.js', ['build', 'shell']);
});

gulp.task('default', ['build']);
