const robots = require('robots-generator').stream;

(() => {

    'use strict';

    module.exports = (params) => robots(params);

})();
