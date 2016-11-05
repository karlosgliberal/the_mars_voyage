var gulp = require('gulp'),
    print = require('gulp-print')
    babel = require('gulp-babel')
    webserver = require('gulp-webserver');

gulp.task('puny-human', function() {
    console.log('Puny humaaaan');
});

gulp.task('build', function() {
    return gulp.src('sketch.js')
        .pipe(print())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('build'));
});


gulp.task('serve', ['build'], function() {
    gulp.src('build')
        .pipe(webserver({open: true}));
});


gulp.task('watch', function(){
    gulp.watch('sketch.js', ['build']);
});

gulp.task('default', ['build']);
