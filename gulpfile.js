var
	src = './src/',
	dist = './dist/',
	ex = './example/';

var
	gulp 		= require('gulp'),
	concat		= require('gulp-concat'),
	rename 		= require('gulp-rename'),
	uglify		= require('gulp-uglify');

var express 	= require('express'),
	app 		= express();

gulp.task('scripts', function() {
	// Locate all js files in the src folder
	return gulp.src([src + 'module.js', src + 'provider.js', src + 'directive.js'])
		// Concatenate all file then move to the dist/ folder
		.pipe(concat('angular-flash.js'))
		.pipe(gulp.dest(dist))
});

// Uglifies the main script
gulp.task('uglify', function() {
	return gulp.src(dist + 'angular-flash.js', { base: './' })
		.pipe(uglify({ mangle: true }))
		.pipe(rename('angular-flash.min.js'))
		.pipe(gulp.dest(dist))
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
});