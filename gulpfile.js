//****************************************************************************/
//    Gulp.js configuration
//****************************************************************************/

var gulp = require('gulp'),
        browsersync  = require('browser-sync'),
        uglify       = require('gulp-uglify'),
        rename       = require('gulp-rename'),
        less         = require('gulp-less'),
        autoprefixer = require('gulp-autoprefixer'),
        cleanCSS     = require('less-plugin-clean-css')
;



//****************************************************************************/
//    JavaScript
//****************************************************************************/

gulp.task('js', function() {
    var theScripts = gulp.src([
            './src/*.js',
        ])
        .pipe(uglify({
            mangle: true,
            preserveComments: "some",
        }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./dist'))
    ;

    browsersync.reload();


    return theScripts;
});



//****************************************************************************/
//    Styles
//****************************************************************************/

var cleanCSSPlugin = new cleanCSS({ advanced: true });

gulp.task('less', function() {
    var theStyles = gulp.src([
            './src/*.less',
        ])
        .pipe(less({
            plugins: [cleanCSSPlugin]
        }))
        .pipe(autoprefixer())
        .pipe(gulp.dest('./dist'))
    ;

    browsersync.reload();


    return theStyles;
});



//****************************************************************************/
//    browsersync
//****************************************************************************/

gulp.task('browser-sync', function() {
    browsersync.init({
        notify: true,
        open: false,
        server: {
            proxy: 'localhost:8081',
            port: 3000,
            baseDir: 'test',
            routes: {
                '/src': 'src',
                '/dist': 'dist',
            },
        }
    });
});


gulp.task('default', ['js', 'browser-sync'], function() {
    // scripts
    gulp.watch([
        './src/*.js',
    ], ['js']);

    // styles
    gulp.watch([
        './src/*.less',
    ], ['less']);
});
