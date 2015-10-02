module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  grunt.initConfig ({
    uglify: {
      my_target: {
        files: {
          'steps.min.js': ['steps.js']
        }
      }
    },
    cssmin: {
      target: {
        files: {
          'steps.min.css': ['steps.css']
        }
      }
    },
    browserSync: {
      dev: {
        bsFiles: {
            src : [
                '*.html',
                '*.js',
                '*.css'
            ]
        },
        options: {
          online: true,
          server:{
            baseDir: './'
          }
        }
      }
    },

  });

 
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browser-sync');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.registerTask('default', ['browserSync']);
}