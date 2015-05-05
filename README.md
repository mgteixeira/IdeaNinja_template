# ideaNinja.io Website

Release 1.0
First production Release of ideaninja.io
Lots of improvements to be made. 

To create a build you need to install a NodeJs (https://nodejs.org/), Gulp ( run NPM install Gulp) and Harp.js (run npm install -g harp)

After node and gulp have been installed open a bash in the repo folder and run gulp, by typing gulp.
In your first instalation you will need to run the command NPM install gulp and all its modules. Don't worry each time you run gulp, he will tell you what modules you need to install until all is up and running. 
Then copy the contents of the folder "files to add to the build" and you ready to go. 

After the build is complete, open the developmente build with bash and run:
	harp init .
	harp server .

If you need to deploy the website, then write harp compile and it will produce the html files. 