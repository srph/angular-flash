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

// Install Bower components
gulp.task('install', function() {
	// Locate the source file then run the install function
	gulp.src(['./bower.json'])
		.pipe(install());
});

gulp.task('scripts', function() {
	// Locate all js files in the src folder
	gulp.src(src + '*.js')
		// Concatenate all files to a single one,
		// then move the concatenated file to the dist/ folder
		.pipe(concat('angular-flash.js'))
		.pipe(gulp.dest(dist))
		// Minify
		// .pipe(uglify())
		.pipe(livereload())
		.pipe(notify({ message: 'Scripts tasks completed!'} ) );
});

gulp.task('watch', function() {
	// Run the install task which installs Bower components
	gulp.run('install');

	// Run the scripts task
	gulp.run('scripts');

	// Watch for file changes
	gulp.watch(src + '*.js', ['scripts'];
	gulp.watch(ex + 'index.html')
		.on('change', function(file) {
			file.change()
		});
});