// This is the main application configuration file.  It is a Grunt
// configuration file, which you can learn more about here:
// https://github.com/cowboy/grunt/blob/master/docs/configuring.md
//
module.exports = function (grunt) {

  var componentList = [
    // Shims
    'modernizr/modernizr.js',

    // jQuery and Related
    'jquery/jquery.js',
    'select2/select2.js',
    'messenger/build/js/messenger.js',

    // bootstrap
    'bootstrap/dist/js/bootstrap.js',

    // AngularJS libraries
    'angular/angular.js',
    'angular-cookies/angular-cookies.js',
    'angular-resource/angular-resource.js',
    'angular-sanitize/angular-sanitize.js',
    'angular-animate/angular-animate.js',

    // Angular UI libraries
    'angular-ui-router/release/angular-ui-router.js',
    'angular-ui-utils/components/angular-ui-docs/build/ui-utils.js',
    'angular-ui-select2/src/select2.js',
    'angular-ui-bootstrap/src/position/position.js',
    'angular-ui-bootstrap/src/datepicker/datepicker.js',
    'angular-ui-bootstrap/src/pagination/pagination.js',
    'angular-ui-bootstrap/src/buttons/buttons.js',

    //NProgress
    'nprogress/nprogress.js',

    // utilities
    'lodash/dist/lodash.js',
    'moment/moment.js'
  ],

  watchedFiles = [
    'client/src/**/*.js',
    'client/test/**/*.js',
    '<%= assets %>/templates/**/*.html',
    '<%= assets %>/less/**/*.less'
  ],

  jshintrc = grunt.file.readJSON('.jshintrc');

  grunt.initConfig ({
    pkg: grunt.file.readJSON('package.json'),

    assets: 'client/assets',
    components: '<%= assets %>/js',
    clientdist: 'client/dist',

    // The clean task ensures all files are removed from the dist/ directory so
    // that no files linger from previous builds.
    clean: ['dist', '<%= clientdist %>', 'client/docs', 'client/test-reports'],

    // The jshint option for scripturl is set to lax, because the anchor
    // override inside main.js needs to test for them so as to not accidentally
    // route.
    jshint:{
      options: jshintrc,
      code: {
        src: ['client/src/**/*.js']
      },
      specs: {
        src: ['client/test/**/*.js'],
        options: {
          expr: true
        }
      }
    },

    // Compiles the Less files into the style.css file.
    less:{
      app:{
        options: {
          paths: ['<%= assets %>/less']
        },
        files: {
          '<%= clientdist %>/assets/css/style.css': '<%= assets %>/less/style.less'
        }
      }
    },

    // Combines the application templates into a single javascript file that populates 
    // the angular template cache.
    //
    // Also builds the angular ui-bootstrap application specific template overrides
    html2js: {
      // Application Templates
      main: {
        options: {
          base: 'client',
        },
        src: [
          '<%= assets %>/templates/app/**/*.html',
          '<%= assets %>/templates/common/**/*.html',
          '<%= assets %>/templates/home/**/*.html',
          '<%= assets %>/templates/navigation/**/*.html',
          '<%= assets %>/templates/*.html'
        ],
        dest: '<%= clientdist %>/assets/templates/main.templates.js'
      },
      lib: {
        options: {
          base: '<%= assets %>/js/angular-ui-bootstrap',
        },
        src: [
          '<%= assets %>/js/angular-ui-bootstrap/template/**/*.html'
        ],
        dest: '<%= clientdist %>/assets/templates/lib.templates.js'
      }
    },

    // The concatenate task is used here to merge the almond require/define
    // shim and the templates into the application code.
    concat:{
      jsdeps: {
        src: getConcatFiles(),
        dest: '<%= clientdist %>/assets/js/deps.js'
      },
      appjs: {
        src: [
          '<%= clientdist %>/assets/js/deps.js',
          '<%= clientdist %>/assets/templates/main.templates.js',
          '<%= clientdist %>/assets/templates/lib.templates.js',
          'client/src/**/*.js'
        ],
        dest: '<%= clientdist %>/assets/js/app.js'
      },
      css: {
        src: [
          '<%= components %>/select2/select2.css',
          '<%= components %>/nprogress/nprogress.css',
          '<%= components %>/messenger/build/css/messenger.css',
          '<%= components %>/messenger/build/css/messenger-spinner.css',
          '<%= clientdist %>/assets/css/style.css'
        ],
        dest: '<%= clientdist %>/assets/css/style.css'
      }
    },

    // This task uses the MinCSS Node.js project to take all your CSS files in
    // order and concatenate them into a single CSS file named style.css.  It
    // also minifies all the CSS as well.  This is named style.css, because we
    // only want to load one stylesheet in index.html.
    cssmin: {
      all: {
        files: {
          '<%= clientdist %>/assets/css/style.min.css': ['<%= clientdist %>/assets/css/style.css']
        }
      }
    },

    // Takes the built app.js file and minifies it for filesize benefits.
    uglify: {
      dist: {
        files: {
          '<%= clientdist %>/assets/js/app.min.js': ['<%= clientdist %>/assets/js/app.js']
        }
      }
    },

    // A task that runs in the background 'watching' for changes to code.
    watch: {
      options: {
        livereload: true,
        atBegin: true
      },
      development: {
        files: watchedFiles,
        tasks: ['development'] 
      },
      debug: {
        files: watchedFiles,
        tasks: ['debug'] 
      },
      production: {
        files: watchedFiles,
        tasks: ['production'] 
      }
    },

    // Stages all the files for running the application.  Each of these
    // tasks are cumulative where production builds off of debug, debug 
    // off of development, and development off of vendor.
    // vendor: All of the 3rd party library files
    // development: All of the files required for development mode
    // debug: All of the files required for debug mode
    // production:  All of the files required for production mode
    copy: {
      vendor: {
        files: [
          {
            expand: true,
            cwd: '<%= components %>/font-awesome/fonts',
            src:['**'],
            dest:'<%= clientdist %>/assets/font/font-awesome'
          },
          {
            expand: true,
            cwd: '<%= components %>/lato/font',
            src:['**'],
            dest:'<%= clientdist %>/assets/font/lato'
          }
        ]
      },
      development: {
        files: [
          {
            expand: true,
            cwd: '<%= assets %>',
            src: ['img/**', 'font/**'],
            dest: '<%= clientdist %>/assets'
          },
          {
            src: '<%= assets %>/html/index.html',
            dest:'<%= clientdist %>/<%= pkg.name %>/index.html'
          }
        ]
      },
      debug: {
        files: [
          {
            expand: true,
            cwd: '<%= clientdist %>/assets',
            src: ['css/style.css', 'font/**', 'img/**', 'js/app.js'],
            dest: '<%= clientdist %>/<%= pkg.name %>-debug/assets'
          },
          {
            src: '<%= assets %>/html/index.html',
            dest:'<%= clientdist %>/<%= pkg.name %>/index.html'
          }
        ]
      },
      production: {
        files: [
          {
            expand: true,
            cwd: '<%= clientdist %>/assets',
            src: ['css/style.min.css', 'font/**', 'img/**', 'js/app.min.js'],
            dest: '<%= clientdist %>/<%= pkg.name %>/assets'
          },
          {
            src: '<%= assets %>/html/index.html',
            dest:'<%= clientdist %>/<%= pkg.name %>/index.html'
          }
        ]
      }
    },

    // Compile the **jade** templates into html for deployment
    jade: {
      development: {
        options: {
          pretty: true,
          data: {
            env: 'development',
            applicationScripts : getScripts('client/src', 'js/src'),
            templateScripts: [
              '<%= clientdist %>/assets/templates/main.templates.js',
              '<%= clientdist %>/assets/templates/lib.templates.js'
            ]
          }
        },
        files: {
          '<%= assets %>/html/index.html': ['api/app/views/index.jade']
        }
      },
      debug: {
        options: {
          pretty: true,
          data: {
            debug: true,
            env: 'debug'
          }
        },
        files: {
          '<%= assets %>/html/index.html': ['api/app/views/index.jade']
        }
      },
      production: {
        options: {
          data: {
            debug: false,
            env: 'production'
          }
        },
        files: {
          '<%= assets %>/html/index.html': ['api/app/views/index.jade']
        }
      }
    },

    // The **docco** task iterates through the `src` files and creates annotated source reports for them.
    docco: {
      options: {
        layout: 'parallel'
      },
      client: {
        options: {
          output: 'dist/docs/client/'
        },
        src: 'client/src/**/*.js'
      },
      app: {
        options: {
          output: 'dist/docs/app/'
        },
        src: 'app/**/*.js'
      },
      grunt: {
        options: {
          output: 'dist/docs/docs/grunt/'
        },
        src: 'Gruntfile.js'
      },
      config: {
        options: {
          output: 'dist/docs/config/'
        },
        src: 'config/**/*.js'
      }
    },

    // The **runapp** task will run the `server.js` in a `nodemon` and watch the server files for changes
    runapp: {
      development: {
        env: 'development'
      },

      debug: {
        env: 'debug'
      },

      production: {
        env: 'production'
      },

      test: {
        options: {
          dieWithParent: true
        },
        env: 'development'
      }
    },

    env: {
      development: {
        NODE_ENV: 'development'
      },
      debug: {
        NODE_ENV: 'debug'
      },
      production: {
        NODE_ENV: 'production'
      }
    },

    shell: {
      server: {
        options: {
          stdout: true,
          stderror: true
        },
        command: 'node api/server.js'
      }
    },

    // Task to add the array-style angular injection to protect against uglifying.
    ngmin: {
      app: {
        src: 'client/src/**/*.js',
        dest: '<%= clientdist %>/app.js'
      }
    },

  // *********************************************************************************************
  // New Tasks go below here !!! 


  });

  // *********************************************************************************************

  function getConcatFiles() {
    var _ = require('lodash');

    return _.map(componentList, function (component) {
      return '<%= components %>/' + component;
    });
  }
 
  function getScripts(dir, dest) {
    var path = require('path');
    var fs = require('fs');
    var files = fs.readdirSync(dir);
    var _ = require('lodash');
    var scripts = [];

    _.each(files, function (file) {
      var name = dir + '/' + file;
      var destName = dest + '/' + file;
    
      if (fs.statSync(name).isDirectory()) {
          scripts = scripts.concat(getScripts(name, destName));
      } else if (path.extname(file) === '.js') {
        scripts.push(destName);
      }

    });

    return scripts;
  }

  // *********************************************************************************************

  // Load NPM Package Tasks
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-docco-multi');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-ngmin');
  grunt.loadNpmTasks('grunt-mixtape-run-app');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-env');


  // **********************************************************************************************

  // The default task will remove all contents inside the dist/ folder, lint
  // all your code, precompile all the underscore templates into
  // dist/debug/templates.js, compile all the application code into
  // dist/debug/require.js, and then concatenate the require/define shim
  // almond.js and dist/debug/templates.js into the require.js file.

  grunt.registerTask('default', ['clean', 'jshint', 'less', 'concat:css', 'html2js', 'concat:jsdeps', 'copy:vendor', 'copy:development']);

  // Task to compile everything in development mode
  grunt.registerTask('development', ['default']);
  grunt.registerTask('debug', ['development', 'concat:appjs', 'jade:debug', 'copy:debug']);
  grunt.registerTask('production', ['debug', 'cssmin', 'uglify', 'jade:production', 'copy:production']);

  // Forks off the application server and runs the unit and e2e tests.
  // Test results stored in client/test-reports
  grunt.registerTask('test', ['production', 'runapp:test']);

  grunt.registerTask('serve:development', ['env:development', 'shell:server']);
  grunt.registerTask('serve:debug', ['env:debug', 'shell:server']);
  grunt.registerTask('serve:production', ['env:production', 'shell:server']);
};
