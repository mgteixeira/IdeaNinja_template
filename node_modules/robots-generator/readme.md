# Robots Generator [![Build Status](https://travis-ci.org/haydenbleasel/robots-generator.svg?branch=master)](https://travis-ci.org/haydenbleasel/robots-generator)

Produces a simple, valid robots.txt to be parsed by web crawlers. Adheres to the [specification](https://developers.google.com/webmasters/control-crawl-index/docs/robots_txt) provided by Google, however currently only supports one User-Agent rule. Requires Node 4+. Installed through NPM with:

```shell
npm install robots-generator --save-dev
```

Simply require the module and execute it with an optional array of configuration.

- User-Agent: A means of identifying a specific crawler or set of crawlers.
- Allow: An array of directories that a crawler is allowed to access.
- Disallow: An array of directories that a crawler is not allowed to access.
- Sitemap: Your website's sitemap URL.

```js
var robots = require('robots-generator');

robots({
    useragent: '*',
    allow: ['folder1/', 'folder2/'],
    disallow: ['cgi-bin/'],
    sitemap: 'http://haydenbleasel.com/sitemap.xml'
}, function (error, robots) {
    // Join ('\n') and write this to a file
    console.log(error, robots);
});
```

If you need an ES5 build for legacy purposes, just require the ES5 file:

```js
var robots = require('robots-generator/es5');
```

Outputs the following file:

```
User-agent: *
Allow: /folder1/
Allow: /folder2/
Disallow: cgi-bin/
Sitemap: http://haydenbleasel.com/sitemap.xml
```

To build the ES5 version:

```sh
npm install -g babel-cli
babel --presets es2015 index.js --out-file es5.js
```
