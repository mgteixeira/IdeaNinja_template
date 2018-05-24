/*!
 * gulp
 * $ npm install gulp-util gulp-browserify gulp-compass gulp-connect gulp-if gulp-uglify gulp-minify-html gulp-concat path gulp-save gulp-sitemap gulp-ejs gulp-imagemin imagemin-pngquant gulp-robots run-sequence gulp-clean cross-spawn countable
 */

// PLUGINS

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    browserify = require('gulp-browserify'),
    babelify = require('babelify'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify-es').default,
    minifyHTML = require('gulp-minify-html'),
    //concat = require( 'gulp-concat'),
    path = require('path'),
    //save = require('gulp-save'),
    sitemap = require('gulp-sitemap'),
    ejs = require("gulp-ejs"),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    JpegRecompress = require('imagemin-jpeg-recompress');    
    robots = require('gulp-robots'),
    runSequence = require('run-sequence') ,
    clean = require('gulp-clean'),
    spawn = require('cross-spawn').spawn,
    watch = require('gulp-watch'),
    pump = require('pump');
    cssnano = require('gulp-cssnano'); 



// VARIABLES

var sources = {
  //js_main: 'components/scripts/global/script.js',
  js_global: 'components/scripts/global/*.js',
  js_cards: 'components/scripts/global/cardDisplay.js',
  js_awt: 'components/scripts/tools/article_writer.js',
  js_bi: 'components/scripts/tools/business_idea.js',
  js_apm: 'components/scripts/tools/automatic_pitch_machine.js',
  sass: 'components/sass/style.scss',
  img: 'components/images/**/**/*.*',
  html: '*.html',
  parts: 'components/parts/**/*.*', 
  docs: 'components/docs/*.*',
  fonts: 'components/fonts/**/*.*', 
//  tools: 'components/scripts/tools/*.js',
  materialize: 'components/scripts/*.js'
//  models: 'model/*.json'
};

var output = {
  dev: 'builds/development/',
  pro: 'builds/production/'
};

var production = true;

// THE EDITION STOPS HERE!
// DON'T EDIT THE FOLLOWING CODE!
// --------------------

// PROGRAM VARIABLES

var sassStyle;


// TASKS

// Start
gulp.task('start', start());

// Default
gulp.task('default', function(callback) {
  runSequence('start', 'clean',
              ['ejs', 'images', 'compass', 'js_cards', 'parts', 'docs', 'fonts', 'js_awt', 'js_bi', 'js_apm' ,'js_materialize'],
              'html',
              ['robots', 'sitemap', 'connect'],
             'watch',
              callback);
});

// Watch
gulp.task('watch', function() {
  gulp.watch(sources.js_global, ['js_cards']);
  gulp.watch(sources.js_awt, ['js_awt']);
  gulp.watch(sources.js_bi, ['js_bi']);
  gulp.watch(sources.js_apm, ['js_apm']);
  gulp.watch(['components/images/**/*.*','components/images/**/**/*.*'] , ['images']);
  gulp.watch('components/sass/**/*.scss', ['compass']);
//  gulp.watch('components/sass/core/*.scss', ['compass']);
//  gulp.watch('components/sass/style.scss', ['compass']);
  gulp.watch(sources.html, ['sitemap']);
  gulp.watch(sources.parts, ['parts']);
//  gulp.watch(sources.tools, ['js_tools']);
  gulp.watch(sources.docs, ['docs']);
  gulp.watch(sources.fonts, ['fonts']);
  gulp.watch(['templates/*.ejs','templates/partials/*.ejs'], function() {
    runSequence(
      ['ejs'],
      'html');
    }
  );
  watch(getOutput() + '**/*.*').pipe(connect.reload());
});

// Js
//gulp.task('js_main',  function(){return js();});
gulp.task('js_cards',  function(){return js(sources.js_cards);});
gulp.task('js_awt',  function(){return js(sources.js_awt);});
gulp.task('js_bi',  function(){return js(sources.js_bi);});
gulp.task('js_apm',  function(){return js(sources.js_apm);});
gulp.task('js_tools',  function(){return tools();});
gulp.task('js_materialize',  function(){return materialize();});

// Parts
gulp.task('parts', function(){return parts();});

// docs
gulp.task('docs',  function(){return docs();});

// Fonts
gulp.task('fonts', function(){return fonts();});

// Models
gulp.task('models', function(){return models();});

// TASKS FUNCTIONS

// start: Always run this function in start of the program
function start() {
  sources.html = getOutput() + sources.html;
  sassStyle = isProd() ? 'compressed' : 'expanded';
}

// connect : Creates a server on localhost
gulp.task('connect', function() {
  connect.server({
    root: getOutput(),
    livereload: true
  });
});

// compass : Sass pre-processor by Compass with Susy and Breakpoint
gulp.task('compass', function() {

  gulp.src(sources.sass)
      .pipe(compass({
        sass: 'components/sass',
        css: getOutput() + 'css',
        image: getOutput() + 'images',
        style: sassStyle, 
        require: ['breakpoint']
      })
      .on('error', gutil.log));
  gulp.src(getOutput() + 'css')
      .pipe(gulpif(isProd(), cssnano()));

});


// js : Compile the main js with other source
function js(source, cb){
  if (source === undefined) {
    source = sources.js_main;
  }
   pump([
      gulp.src(source, {read: false}),
      browserify({
        insertGlobals : !isProd(),
        debug : !isProd(), 
        transform: [
          babelify.configure({
            extensions: [".jsx", ".js"],
//            presets: ["env", "react"],
            sourceMapsAbsolute: !isProd(), 
            })//babelify-configure
          ]//transform
        }),//browserify
      gulpif(isProd(), uglify()),
      gulp.dest(getOutput() + 'js')
      //,gulpif(isProd(), uglify())
   ],
   cb,
      function (err) { if(err){console.log('error : ', err)}}
  )}

// tools
/*
function tools(){
  return gulp.src(sources.tools)
             .on('error', gutil.log)
             .pipe(gulp.dest(getOutput() + 'js/tools'));
}*/
// Materialize
function materialize(){
  return gulp.src(sources.materialize)
             .on('error', gutil.log)
             .pipe(gulp.dest(getOutput() + 'js'));
}
// parts
function parts(){
  return gulp.src(sources.parts)
             .on('error', gutil.log)
             .pipe(gulp.dest(getOutput() + 'parts'));
}

// docs
function docs(){
  return gulp.src(sources.docs)
             .on('error', gutil.log)
             .pipe(gulp.dest(getOutput() + 'docs'));
}
// fonts
function fonts(){
  return gulp.src(sources.fonts)
             .on('error', gutil.log)
             .pipe(gulp.dest(getOutput() + 'fonts'));
}

// models
/*
function models(){
  return gulp.src(sources.models)
             .on('error', gutil.log)
             .pipe(gulp.dest(getOutput() + 'models'));
}
*/
// TOOLS FUNCTIONS

// getOutput: Return the correct output directory
function getOutput() {
  if (isProd()) {
    return output.pro;
  } else {
    return output.dev;
  }
}

// isProd : Check the production variable
function isProd() {
  return production;
}


// -----------------

//creating robots.txt
gulp.task('robots', function () {
    gulp.src(getOutput() + 'index.html')
        .pipe(robots({
          useragent: '*',
          sitemap: 'https://ideaninja.io/sitemap.xml'
        }))
        .pipe(gulp.dest(getOutput()));
});

//optimizes images
gulp.task('images', function () {
    return gulp.src(sources.img)
        .pipe(imagemin(
          [pngquant({quality: '65-75'}), 
          JpegRecompress({quality: "medium", loops: 8})],
          {
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
        }))
        .pipe(gulp.dest(getOutput() +'images'));
});

//Reloads gulp if gulp.js or model is altered
/*gulp.task('auto-reload', function() {
  var p;
  gulp.watch(['model/*.json'], spawnChildren);  
  spawnChildren();
  function spawnChildren(e) {
    // kill previous spawned process
    if(p) { p.kill(); }

    // `spawn` a child `gulp` process linked to the parent `stdio`
    p = spawn('gulp', ['ejs'], {stdio: 'inherit'});
  }
});
*/
//Reloads server and if production minifies
gulp.task('html', function() {
  return gulp.src(sources.html)
    .pipe(gulpif(isProd(), minifyHTML()))
    .pipe(gulpif(isProd(), gulp.dest(getOutput())));
});

//compiles EJS
gulp.task('ejs', function(){
    return gulp.src("templates/*.ejs")
   .pipe(ejs(
      {},
      { 
        compileDebug: true,
        client: true,
        ext: '.html'
      }))
  .pipe(gulp.dest(getOutput()));
});

//create Sitemap
gulp.task('sitemap', function () {
    return gulp.src(sources.html)
        .pipe(sitemap({
            siteUrl: 'https://ideaninja.io'
        }))
        .pipe(gulp.dest(getOutput()));
});

gulp.task('clean', function () {
    return gulp.src([getOutput() + '*.*', getOutput() + '**/*.*'])
        .pipe(clean({force: true}));
  });
