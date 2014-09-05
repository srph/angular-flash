var
	_src = './src/',
	_dist = './dist/',
	_ex = './example/';

var
	gulp 		= require('gulp'),
	concat		= require('gulp-concat'),
	rename 		= require('gulp-rename'),
	uglify		= require('gulp-uglify'),
	annotate	= require('gulp-ng-annotate');

var express 	= require('express'),
	app 		= express();

// Bundles all source files
gulp.task('scripts', function() {
	return gulp.src([
			_src + 'module.js',
			_src + 'provider.js',
			_src + 'directive.js'
		])
		// Concatenate all file then move to the dist/ folder
		.pipe(concat('angular-flash.js'))
		.pipe(annotate())
		.pipe(gulp.dest(_dist));
});

// Uglifies the main script
gulp.task('uglify', function() {
	return gulp.src(_dist + 'angular-flash.js', { base: './' })
		.pipe(uglify())
		.pipe(rename('angular-flash.min.js'))
		.pipe(gulp.dest(_dist));
});

// Server for the examples
gulp.task('server', function() {
	app.use('/', express.static(__dirname + '/example'));
	// app.use('/client', express.static(__dirname + '/example/client'));
	app.use('/dist', express.static(__dirname + '/dist'));

	app.all('/*', function(req, res, next) {
	    // Just send the index.html for other files to support HTML5Mode
	    res.sendfile('example/index.html', { root: __dirname });
	});

	var server = app.listen(8080, function() {
		console.log('Listening on port %d', server.address().port);
	});
});

gulp.task('build-example', function () {
	return gulp.src([
			_ex + 'client/app.js',
			_ex + 'client/utils/**/*.js',
			_ex + 'client/home/**/*.js',
			_ex + 'client/about/**/*.js',
			_ex + 'client/bootstrap.js'
		])
		.pipe(concat('build.js'))
		.pipe(annotate())
		.pipe(gulp.dest(_ex));
});

gulp.task('default', function() {
	// Run the install task which installs Bower components
	// gulp.run('install');

	// Run the scripts task, then uglify
	gulp.run('scripts');
	gulp.run('uglify');
	gulp.run('build-example');

	// Run the server
	gulp.run('server');

	// Watch for file changes
	gulp.watch(_src + '*.js', ['scripts']);
	gulp.watch(_dist + '*.js', ['uglify']);
	gulp.watch(_ex + '**/*.js', ['build-example']);
});