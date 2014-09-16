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
          banner: '(function(){',
          footer: '}());',
        },
        files: {
          'dist/tour.js': ['bower_components/intro.js/minified/intro.min.js', '.tmp/tours.js', 'tour.js']
        }
      }
    },
    copy: {
      deps: {
        src: 'bower_components/intro.js/minified/introjs.min.css',
        dest: 'dist/introjs.css'
      }
    }
  });

  grunt.loadNpmTasks('grunt-json-merge');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['clean:dist', 'json_merge', 'concat', 'copy']);

};
