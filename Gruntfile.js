/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    concat: {
      options: {
        banner: '<%= banner %>\'use strict\';\nvar injector = (function () {\n',
        stripBanners: true,
        footer: '\nreturn new Injector();\n}());'
      },
      dist: {
        src: ['src/*.js', '!src/require.shim.js'],
        dest: 'dist/inject.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/inject.min.js'
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        globals: {
          _: true
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib_test: {
        src: ['src/**/*.js', 'Tests/**/*.js']
      }
    },
    watch: {
      scripts: {
        files: ['Gruntfile.js', 'src/*.js', 'Tests/*.js', 'Tests/**/*.coffee'],
        tasks: ['jshint', 'karma:unit', 'concat', 'uglify', 'karma:dist', 'karma:min'],
      }
    },
    karma: {
      unit: {
        configFile: 'Tests/karma.conf.js'
      },
      dist: {
        configFile: 'Tests/karma.dist.conf.js'
      },
      min: {
        configFile: 'Tests/karma.dist.min.conf.js'
      },
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-karma');

  // Default task.
  grunt.registerTask('default',['watch']);
  grunt.registerTask('deploy', ['jshint', 'karma:full', 'concat', 'uglify', 'karma:dist', 'karma:min']);
};
