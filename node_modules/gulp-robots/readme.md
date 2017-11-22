# gulp-robots [![Build Status](https://travis-ci.org/haydenbleasel/robots-generator.svg?branch=master)](https://travis-ci.org/haydenbleasel/robots-generator)

Robots.txt generator for Gulp. Simple wrapper around [robots-generator](https://github.com/haydenbleasel/robots-generator). Requires Node 4+. Installed through NPM with:

```shell
npm install gulp-robots --save-dev
```

Check out robots-generator for example options. This module scans your HTML for `<link rel="sitemap" />`. Example usage:

```js
var robots = require('gulp-robots');

gulp.task('default', function () {
    gulp.src('index.html')
        .pipe(robots({
            useragent: '*',
            allow: ['folder1/', 'folder2/'],
            disallow: ['cgi-bin/']
        }))
        .pipe(gulp.dest('robots.txt'));
});
```

If you need an ES5 build for legacy purposes, just require the ES5 file:

```js
var robots = require('gulp-robots/es5');
```

To build the ES5 version, run the following and remember to require the ES5 version.

```js
npm install -g babel-cli
babel --presets es2015 index.js --out-file es5.js
```
