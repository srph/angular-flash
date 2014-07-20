var
	src = './src/',
	dist = './dist/',
	ex = './example/';

var
	gulp 		= require('gulp'),
	livereload	= require('gulp-livereload'),
	notify		= require('gulp-notify'),
	install		= require('gulp-install'),
	connect		= require('gulp-connect'),
	concat		= require('gulp-concat'),
	rename 		= require('gulp-rename'),
	uglify		= require('gulp-uglify');

var express 	= require('express'),
	app 		= express();

// Install Bower components
gulp.task('install', function() {
	// Locate the source file then run the install function
	return gulp.src(['./bower.json'])
		.pipe(install())
		.pipe(notify({ message: 'Scripts installed!' }));
});

gulp.task('scripts', function() {
	// Locate all js files in the src folder
	return gulp.src([src + 'module.js', src + 'provider.js', src + 'directive.js'])
		// Concatenate all file then move to the dist/ folder
		.pipe(concat('angular-flash.js'))
		.pipe(gulp.dest(dist))
		.pipe(livereload())
		.pipe(notify({ message: 'Scripts tasks completed!' }));
});

// Uglifies the main script
gulp.task('uglify', function() {
	return gulp.src(dist + 'angular-flash.js', { base: './' })
		// .pipe(uglify({ mangle: false }))
		.pipe(rename('angular-flash.min.js'))
		.pipe(gulp.dest('./'))
		.pipe(livereload())
		.pipe(notify({ message: 'Uglified your ugly script!' }));
});

gulp.task('server', function() {
	app.use(express.static(__dirname + '/example'));
	var server = app.listen(8080, function() {
		console.log('Listening on port %d', server.address().port);
	});
});

gulp.task('default', function() {
	var server = livereload();

	// Run the install task which installs Bower components
	// gulp.run('install');

	// Run the scripts task, then uglify
	gulp.run('scripts');
	gulp.run('uglify');

	// Run the server
	gulp.run('server');

	// Watch for file changes
	gulp.watch(src + '*.js', ['scripts']);
	gulp.watch(dist + '*.js', ['uglify']);
	gulp.watch(ex + 'index.html')
		.on('change', function(file) {
			server.changed(file);
		});
});