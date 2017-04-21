'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    path = require('path'),
    concat = require('gulp-concat'),
    cleanCSS = require('gulp-clean-css'),
    sourcemaps = require('gulp-sourcemaps'),
    plumber = require('gulp-plumber'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    uglify = require('gulp-uglify'),
    watch = require('gulp-watch'),
    batch = require('gulp-batch'),
    runSequence = require('run-sequence').use(gulp),
    cachebust = require('gulp-cache-bust'),
    fs = require('fs'),
    templateCache = require('gulp-angular-templatecache');

var pkg = JSON.parse(fs.readFileSync('package.json'));

gulp.task('templatecache', function () {
    return gulp.src('public/views/**/*.html')
        .pipe(templateCache({
            module: 'citizenos',
            root: '/views/',
            templateHeader: '/** AUTOGENERATED BY GULP templatecache TASK **/ \n\nangular\n    .module(\'<%= module %>\'<%= standalone %>)\n    .run([\'$log\', \'$http\', \'$templateCache\', function ($log, $http, $templateCache) {\n        var templates = [\n',
            templateBody: '            \'<%= url %>\',',
            templateFooter: '\n'
            + '        ];\n        var i = 0;\n'
            + '        if (templates.length) {\n'
            + '            downloadToCache();\n'
            + '        }\n'
            + '        function downloadToCache() {\n'
            + '            var template = templates[i];\n'
            + '            $http\n'
            + '                .get(template, {\n'
            + '                    ignoreLoadingBar: true\n'
            + '                })\n'
            + '                .then(\n'
            + '                    function (response) {\n'
            + '                        $templateCache.put(response.config.url, response.data);\n'
            + '                        if (++i < templates.length) {\n'
            + '                            downloadToCache();\n'
            + '                        }\n'
            + '                    },\n'
            + '                    function (err) {\n'
            + '                        $log.error(\'error\', err);\n'
            + '                        if (++i < templates.length) {\n'
            + '                            downloadToCache();\n'
            + '                        }\n'
            + '                    }\n'
            + '                );\n'
            + '        }\n'
            + '    }]);',
            standalone: false
        }))
        .pipe(concat('template-cache.js'))
        .pipe(gulp.dest('public/js/libs'));
});

gulp.task('default', function () {
    return runSequence(
        'uglify',
        'sass',
        'sass_etherpad',
        'cachebreaker',
        'watch'
    );
});

gulp.task('jshint', function () {
    return gulp.src([
            'public/js/**/*.js',
            '!public/js/libs/**/*.js',
            '!public/js/*.bundle.js'
        ])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

gulp.task('uglify', function () {
    return gulp.src([
            'public/js/libs/moment-with-locales.js',
            'public/js/libs/hwcrypto-legacy.js',
            'public/js/libs/hwcrypto.js',
            'public/js/libs/angular.js',
            'public/js/libs/angular-touch.js',
            'public/js/libs/angular-resource.js',
            'public/js/libs/angular-route.js',
            'public/js/libs/angular-translate.js',
            'public/js/libs/raven.js',
            'public/js/libs/raven-console.js',
            'public/js/libs/angular-raven.js',
            'public/js/libs/**/*.js',
            '!public/js/libs/template-cache.js',
            'public/js/app.js',
            'public/js/factories/**/*.js',
            'public/js/services/**/*.js',
            'public/js/filters/**/*.js',
            'public/js/directives/**/*.js',
            'public/js/controllers/**/*.js'
        ])
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(plumber())
        .pipe(uglify({
            mangle: false,
            compress: false,
            beautify: true
        }))
        .pipe(concat(pkg.name + '.bundle.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/js/'));
});

gulp.task('cachebreaker', function () {
    return gulp.src('public/index.html')
        .pipe(cachebust({
            type: 'MD5'
        }))
        .pipe(gulp.dest('public/'));
});

gulp.task('watch', function () {
    gulp.watch(['public/js/**/*.js', '!public/js/*.bundle.js'], function () {
        return runSequence(
            'uglify',
            'cachebreaker'
        );
    });
    gulp.watch('public/styles/**/*.scss', function () {
        return runSequence(
            'sass',
            'sass_etherpad',
            'cachebreaker'
        );
    });
    gulp.watch('public/views/**/*.html', function () {
        return runSequence(
            'templatecache'
        );
    });
});

/**
 * TODO: Would be 1 SASS task if followed the best practice - http://thesassway.com/beginner/how-to-structure-a-sass-project
 * BUT, if we try to follow it with current code, SASS goes berserk and generates 31 mb CSS or hangs. Needs some investigation.
 */
gulp.task('sass', function () {
    gulp.src(['public/styles/*.scss'])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(cleanCSS())
        .pipe(concat(pkg.name + '.bundle.css'))
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('public/styles/'))
});

gulp.task('sass_etherpad', function() {
    gulp.src(['public/styles/etherpad/etherpad.scss'])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('public/styles/'))
});
