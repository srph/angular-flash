module.exports = function(grunt) {

	// Project configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		server: {
			port: 8080,
			base: './example',
			url: 'http://localhost:<%= server.port %>'
		},
		bower: {
			dev: {
				dest: './bower_components'
			}
		},
		concat: {
			main: {
				src: [
					'src/module.js',
					'src/provider.js',
					'src/directive.js'
				],
				dest: 'dist/<%= pkg.name %>.js'
			}
		},
		uglify: {
			main: {
				files: {
					'dist/<%= pkg.name %>.min.js': [
						'<%= concat.main.dest %>'
					]
				}
			}
		},
		watch: {
			options: {
				livereload: true
			},
			scripts: {
				files: ['src/*.js'],
				tasks: ['concat', 'uglify']
			}
		}
	});

	// Server
	grunt.registerTask('server', 'Start a web server', function() {
		var done = this.async();
		grunt.log.writeln('Starting a server on port 1234');
		require('./server.js')
			.listen(1234)
			.on('close', done);
	});

	// Load the plugins
	grunt.loadNpmTasks('grunt-bower');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	

	// Register default tasks
	grunt.registerTask('default', [
		'watch',
		'server'
	]);
}