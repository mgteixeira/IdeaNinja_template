const path = require('path'),
    _ = require('underscore'),
    through2 = require('through2'),
    cheerio = require('cheerio'),
    File = require('vinyl');

(() => {

    'use strict';

    function robots (params, next) {

        const options = _.defaults(params || {}, {
            useragent: '*',
            allow: [],
            disallow: ['cgi-bin/'],
            sitemap: null
        }),
            configuration = [`User-agent: ${ options.useragent }`];

        if (options.allow.length) {
            _.each(options.allow, (a) => configuration.push(`Allow: ${ a }`));
        }

        if (options.disallow.length) {
            _.each(options.disallow, (d) => configuration.push(`Disallow: ${ d }`));
        }

        if (options.sitemap) {
            configuration.push(`Sitemap: ${ options.sitemap }`);
        }

        return next ? next(null, configuration) : true;

    }

    function stream (params) {

        params = params || {};

        return through2.obj((file, encoding, callback) => {

            const $ = cheerio.load(file.contents.toString());

            if (file.isNull()) {
                return callback(null, file);
            }

            if (file.isStream()) {
                return callback(new Error('Streaming not supported'));
            }

            if (!params.sitemap) {
                params.sitemap = $('link[rel="sitemap"]').attr('href');
            }

            robots(params, (error, config) =>
                callback(error, new File({
                    path: path.join(file.cwd, 'robots.txt'),
                    contents: new Buffer(config.join('\n'))
                })));

        });

    }

    module.exports = robots;
    module.exports.stream = stream;

})();
