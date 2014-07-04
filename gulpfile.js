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
	uglify		= require('gulp-uglify');

var express 	= require('express'),
	app 		= express();

// Install Bower components
gulp.task('install', function() {
	// Locate the source file then run the install function
	return gulp.src(['./bower.json'])
		.pipe(install());
});

gulp.task('scripts', function() {
	// Locate all js files in the src folder
	return gulp.src([src + 'module.js', src + 'provider.js', src + 'directive.js'])
		// Concatenate all files to a single one,
		// then move the concatenated file to the dist/ folder
		.pipe(concat('angular-flash.js'))
		.pipe(gulp.dest(dist))
		// Minify
		// .pipe(uglify())
		.pipe(livereload())
		.pipe(notify({ message: 'Scripts tasks completed!'} ) );
});

gulp.task('html', function() {
	return gulp.src(ex + '*.html')
		.pipe(livereload())
		.pipe(connect.reload())
		.pipe(notify({ message: 'Server up on 8080' }));
});

gulp.task('connect', function() {
	app.use(express.static(__dirname + '/example'));
	var server = app.listen(8080, function() {
		console.log('Listening on port %d', server.address().port);
	});
});

gulp.task('watch', function() {
	var server = livereload();
	// Run the install task which installs Bower components
	gulp.run('install');

	// Run the scripts task
	gulp.run('scripts');

	//
	gulp.run('connect');

	// Watch for file changes
	gulp.watch(src + '*.js', ['scripts']);
	gulp.watch(ex + 'index.html')
		.on('change', server.changed);
});