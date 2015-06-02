var gulp = require('gulp'),
    //common
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),// for css and js
    rimraf = require('rimraf'),// remove files in folders (rm -rf) 
    rigger = require('gulp-rigger'),// includes in css/js/html files («//= __FILE_PATH__»)
    combiner = require('stream-combiner2'),//for prevent watch break
    webserver = require('gulp-webserver'),
    filesystem = require('fs'),
    //gaze = require('gaze'),//extended watch
    notify = require('gulp-notify'),//notifier for pipes
    notifier = require('node-notifier'), //notifier for common usage
    //process
    sys = require('sys')
    , exec  = require('child_process').exec
    , async = require('async')
    , util  = require('util')
    //css
    //stylus = require('gulp-stylus'), // Stylus
    //nib = require('nib'), // Stylus mixins lib
    sass = require('gulp-sass'),
    csso = require('gulp-csso'),//css minifier
    //images
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant');
    
//paths
var projectPath = {};
projectPath.server = 'www/';
projectPath.template = projectPath.server+'template/';
projectPath.build = projectPath.template+'build/';
projectPath.assets = projectPath.template+'assets/';
var path = {
    build: {
        //html:  projectPath.template+'build/',
        js:    projectPath.build+'js/',
        css:   projectPath.build+'css/',
        img:   projectPath.build+'img/',
        fonts: projectPath.build+'fonts/'
    },
    assets: {
        //html:   projectPath.assets+'*.html',
        js:     projectPath.assets+'js/main.js',
        css:    projectPath.assets+'css/main.scss',
        img:    projectPath.assets+'img/**/*.*',
        fonts:  projectPath.assets+'fonts/**/*.*',
        iconfont: projectPath.assets+'svg-to-icon-font/',
		bower: projectPath.assets+'bower/',
    },
    watch: {
        //html:   projectPath.template+'src/**/*.html',
        js:     projectPath.assets+'js/**/*.js',
        css:    projectPath.assets+'css/**/*.scss',
        img:    projectPath.assets+'img/**/*.*',
        fonts:  projectPath.assets+'fonts/**/*.*'
    },
    clean: projectPath.template+'build'
};

//tasks
gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});
//gulp.task('html:build', function () {
//    gulp.src(path.src.html) 
//        .pipe(rigger())
//        .pipe(gulp.dest(path.build.html));
//});
gulp.task('js:build', function (cb) {
    var combined = combiner.obj([
        gulp.src(path.assets.js),
        rigger(),
        sourcemaps.init(),
        //uglify(),
        sourcemaps.write(),
        gulp.dest(path.build.js),
        notify("js:build completed")
    ]);
    combined.on('error', function(error){
        notifier.notify({
            title: 'js:build error',
            message: error.toString()
        });
        console.error.bind(console);
    });
    return combined;
});
gulp.task('js:prod', function (cb) {
    var combined = combiner.obj([
        gulp.src(path.assets.js),
        rigger(),
        //sourcemaps.init(),
        uglify(),
        //sourcemaps.write(),
        gulp.dest(path.build.js),
        notify("js:build completed")
    ]);
    combined.on('error', function(error){
        notifier.notify({
            title: 'js:build error',
            message: error.toString()
        });
        console.error.bind(console);
    });
    return combined;
});
gulp.task('css:build', function () {
    var combined = combiner.obj([
        gulp.src(path.assets.css),
        sourcemaps.init(),
        //stylus({
            //use: nib(),
            //compress: true
        //}),
        sass(),
        //csso(),
        sourcemaps.write(),
        gulp.dest(path.build.css),
        notify("css:build completed")
    ]);
    combined.on('error', function(error){
        notifier.notify({
            title: 'css:build error',
            message: error.toString()
        });
        console.error.bind(console);
    });
    return combined;
});
gulp.task('css:prod', function () {
    var combined = combiner.obj([
        gulp.src(path.assets.css),
        //sourcemaps.init(),
        //stylus({
            //use: nib(),
            //compress: true
        //}),
        sass(),
        csso(),
        //sourcemaps.write(),
        gulp.dest(path.build.css),
        notify("css:build completed")
    ]);
    combined.on('error', function(error){
        notifier.notify({
            title: 'css:build error',
            message: error.toString()
        });
        console.error.bind(console);
    });
    return combined;
});
gulp.task('fonts:build', function(cb) {
    var createFonts = function(){
            gulp.src(path.assets.fonts)
                .pipe(gulp.dest(path.build.fonts));
            notifier.notify({
                title: 'fonts:build',
                message: 'completed'
            });
        },
        //delete old fonts
        combined = combiner.obj([
            filesystem.exists(path.build.fonts, function (exists) {
                if(exists)
                    rimraf(path.build.fonts, createFonts);
                else
                    createFonts();
            })
        ]);
    //combined.on('error', console.error.bind(console));
    return combined;
});
gulp.task('img:build', function(cb) {
    var createImg = function(){
            gulp.src(path.assets.img) 
                .pipe(imagemin({
                    progressive: true,
                    svgoPlugins: [{removeViewBox: false}],
                    use: [pngquant()],
                    interlaced: true
                }))
                .pipe(gulp.dest(path.build.img));
            notifier.notify({
                title: 'img:build',
                message: 'completed'
            });
        },
        //delete old imgs
        combined = combiner.obj([
            filesystem.exists(path.build.img, function (exists) {
                if(exists)
                    rimraf(path.build.img, createImg);
                else
                    createImg();
            })
        ]);
    //combined.on('error', console.error.bind(console));
    return combined;
});

//bower
gulp.task('bower:clean', function(cb) {
    rimraf(path.assets.bower, cb);
});
gulp.task('bower:copymin', function() {
    var bower = require('main-bower-files');
    var bowerNormalizer = require('gulp-bower-normalize');
    return gulp.src(bower(), {base: './bower_components'})
        .pipe(bowerNormalizer({bowerJson: './bower.json'}))
        .pipe(gulp.dest(path.assets.bower))
});
gulp.task('bower:copy', function() {
	var bower = require('gulp-bower');
	return bower()
		.pipe(gulp.dest(path.assets.bower));
});
gulp.task('bower:update', function() {
	return bower({ cmd: 'update'});
});
gulp.task('bower', ['bower:clean','bower:copymin']);//,'bower:copy'

//tasks common
gulp.task('build', [
    //'html:build',
    'js:build',
    'css:build',
    //'fonts:build',
    //'img:build'
]);
gulp.task('prod', [
    //'html:build',
    'js:prod',
    'css:prod',
    //'fonts:build',
    //'img:build'
]);
gulp.task('watch', function(){
    //livereload server run
    gulp.src(projectPath.build)
        .pipe(webserver({
            livereload: true,
            directoryListing: true
            //,open: true
        }));
    
    //watchers run
    //watch([path.watch.html], function(event, cb) {
    //    gulp.start('html:build');
    //});
    gulp.watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    gulp.watch([path.watch.css], function(event, cb) {
        gulp.start('css:build');
    });
	//gaze(path.watch.img, function(err, watcher) {
	//	this.on('all', function(event, filepath) {// On changed/added/deleted
	//		gulp.start('img:build');
	//	});
	//});
	//gaze(path.watch.fonts, function(err, watcher) {
	//	this.on('all', function(event, filepath) {// On changed/added/deleted 
	//		gulp.start('fonts:build');
	//	});
	//});
});
gulp.task('default', ['build', 'watch']);