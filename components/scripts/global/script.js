/*
 * script.js
 * This file joins all the necessary files for the global scripts.
 * If you want add a specific script for a tool, please,
 *  don't add a another script to the html page; require this file
 *  in the tool file and browserify the tool file.
*/

// MATERIALIZE THE WHOLE SHABANG





// NPM Packages>


require ('./jquery.timeago.min.js');
require('jquery-hammerjs'); 
require ('./materializecss/all/materialize.js');
require('./init.js');
require('./search.js'); 
//require('./data.js'); 