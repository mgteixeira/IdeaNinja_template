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
//require ('./prism.js');

require('jquery-hammerjs'); 
require ('./materializecss/all/materialize.js');
require('./init.js');
//require('lunr'); 
require('./search.js'); 
 

/*
$ = require('jquery'); 
jQuery = $;
window.jQuery= 'jQuery';
window.$ = 'jQuery';
global.jQuery = require('jquery');
require('jquery-hammerjs'); 
require ('hammerjs'); // instead of require('./materializecss/hammer.min.js'); 
require('jquery-easing');// instead of './materializecss/jquery.easing.1.4.js'
//require('velocity-animate'); //instead of './materializecss/velocity.min.js'



require('./materializecss/sideNav.js');

require('./materializecss/animation.js');
require('./materializecss/buttons.js');
require('./materializecss/cards.js');
require('./materializecss/carousel.js');
require('./materializecss/character_counter.js');
require('./materializecss/chips.js');
require('./materializecss/collapsible.js');
require('./materializecss/dropdown.js');
require('./materializecss/forms.js');
require('./materializecss/global.js');
require('./materializecss/initial.js');
require('./materializecss/materialbox.js');
require('./materializecss/modal.js');
require('./materializecss/parallax.js');
require('./materializecss/pushpin.js');
require('./materializecss/scrollFire.js');
require('./materializecss/scrollspy.js');
require('./materializecss/slider.js');
require('./materializecss/waves.js');
require('./materializecss/tabs.js');
require('./materializecss/tapTarget.js');
require('./materializecss/toasts.js');
require('./materializecss/tooltip.js');
require('./materializecss/transitions.js');

require('./materializecss/date_picker/picker.js', './materializecss/date_picker/picker.date.js', './materializecss/date_picker/picker.time.js');
//custom 
*/