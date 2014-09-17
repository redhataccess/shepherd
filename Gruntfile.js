'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    json_merge: {
      options: {
        replacer: null,
        space: ''
      },
      tours: {
        files: {
          '.tmp/tours.json': ['tours/**/*.json']
        },
      },
    },
    clean: {
      dist: {
        src: ['dist/*']
      },
      tmp: {
        src: ['.tmp']
      }
    },
    concat: {
      tours: {
        options: {
          // Hack.
          banner: 'window.tours = ',
          footer: ';',
        },
        files: {
          '.tmp/tours.js': ['.tmp/tours.json'],
        },
      },
      dist: {
        options: {
          banner: '(function(){',
          footer: '}());',
        },
        files: {
          'dist/tour.js': ['.tmp/tours.js', 'tour.js']
        }
      }
    },
    copy: {
      main: {
        src: 'tour.css',
        dest: 'dist/',
      },
    },
  });

  grunt.loadNpmTasks('grunt-json-merge');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['clean:dist', 'json_merge', 'concat', 'copy']);

};
