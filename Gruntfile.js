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
          banner: 'var tours = ',
          footer: ';',
        },
        files: {
          '.tmp/tours.js': ['.tmp/tours.json'],
        },
      },
      dist: {
        options: {
          banner: 'define([\'jquery\', \'introjs\'], function (jQuery, introjs) {',
          footer: '});',
        },
        files: {
          'dist/tour.js': ['actions.js', '.tmp/tours.js', 'tour.js']
        }
      }
    },
    copy: {
      main: {
        src: 'tour.css',
        dest: 'dist/',
      },
    },
    uglify: {
      dist: {
        files: {
          'dist/tour.min.js': ['dist/tour.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-json-merge');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['clean:dist', 'json_merge', 'concat', 'copy', 'uglify']);

};
