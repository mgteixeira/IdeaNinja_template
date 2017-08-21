function init() {
var vidDefer = document.getElementsByTagName('iframe'); //returns an array with all the videos in the page.
	for (var i=0; i<vidDefer.length; i++) {//loop through the array 
		if(vidDefer[i].getAttribute('data-src')) { //if the video has data-src defined then...
			vidDefer[i].setAttribute('src',vidDefer[i].getAttribute('data-src'));
} } }
window.onload = init;
