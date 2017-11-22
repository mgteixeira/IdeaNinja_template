'use strict';

var robots = require('robots-generator/es5').stream;

(function () {
    'use strict';

    module.exports = function (params) {
        return robots(params);
    };
})();
