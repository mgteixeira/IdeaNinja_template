/*
 * script.js
 * This file joins all the necessary files for the global scripts.
 * If you want add a specific script for a tool, please,
 *  don't add a another script to the html page; require this file
 *  in the tool file and browserify the tool file.
*/

// NPM Packages
$ = require('jquery'); jQuery = $;

// LOCAL Files
//require('./ajax_request_test.js');
require('./collapse-bootstrap.js');
//require('./slider.js');
require('./contactform.js');
require('./modal-bootstrap.js');
require('./transitions-bootstrap.js');
require('./wheight.js');
require('./vid_defer.js');
