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
      }
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
          banner: 'var __tours = ',
          footer: ';',
        },
        files: {
          '.tmp/tours.js': ['.tmp/tours.json'],
        },
      },
      dist: {
        options: {
          banner: 'define([\'introjs\', \'jquery\', \'underscore\', \'moment\', \'polyglot\'], function (introjs, $, _, moment, P) {\n',
          footer: '});',
        },
        files: {
          'dist/tour.js': ['actions.js', '.tmp/tours.js', 'tour.js']
        }
      }
    },
    sass: {
      dist: {
        options: {
          style: 'compressed',
          sourcemap: 'none'
        },
        files: {
          'dist/tour.css': 'tour.scss'
        }
      }
    },
    autoprefixer: {
      single_file: {
        src: 'dist/tour.css'
      },
    }
  });

  grunt.loadNpmTasks('grunt-json-merge');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-autoprefixer');

  grunt.registerTask('default', ['clean:dist', 'json_merge', 'concat', 'sass', 'autoprefixer']);

};
