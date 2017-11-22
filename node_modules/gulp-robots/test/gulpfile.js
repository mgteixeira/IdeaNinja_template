const gulp = require('gulp'),
    robots = require('../');

(() => {

    'use strict';

    gulp.task('default', () =>
        gulp.src('index.html')
            .pipe(robots({
                useragent: '*',
                allow: ['folder1/', 'folder2/'],
                disallow: ['cgi-bin/']
            }))
            .pipe(gulp.dest('./')));

})();
