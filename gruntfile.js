//Gruntfile for the AppX Project

var TITLE             = 'AppX',              // Title
    APP               = 'appx',              // JavaScript Package Name (Also used as Production JavaScript Filename)
    LANGUAGE          = 'ru',                // Language
    BUILD_DIR         = 'build',             // Project Build
    META_DIR          = 'meta',              // Meta Content
    DEVELOPMENT_DIR   = 'dev',               // Project Development
    IMAGES_DIR        = 'images',            // Images
    RESOURCES_DIR     = 'res',               // Resources (CSS, JavaScript, Fonts etc.)
    APP_PAGE          = 'app.html',          // Application
    CRITICAL_PAGE     = 'critical.html',     // Page Containing Critical Elements
    CRITICAL_WIDTH    = 1200,                // Horizontal Fold
    CRITICAL_HEIGHT   = 900,                 // Vertical Fold
    TEMPLATES_DIR     = 'templates',         // Templates
    CSS_TEMPLATE      = '_head.html',        // Template Containing CSS Declarations
    JS_TEMPLATE       = '_scriptsApp.html',  // Template Containing JavaScript Declarations
    CSS_IMAGES_DIR    = 'images',            // CSS Images
    DATA_URI          = [],                  // Array of Images (Relative to the Image Resources Directory) to Convert to DataURI
    CSS_DIR           = 'css',               // Production CSS
    SASS_DIR          = 'sass-dev',          // Sass
    CSS_DEV_DIR       = 'css-dev',           // Generated CSS
    CSS_FILENAME      = 'styles',            // Production CSS Filename
    CSS_CRITICAL      = 'critical',          // Critical CSS Filename
    JS_DIR            = 'js',                // Production JavaScript
    JS_DEV_DIR        = 'js-dev';            // JavaScript

function fillAnArray(array, path) {
  var result = [];
  for (var element in array) {
    result.push(path + array[element]);
  }
  return result;
}

module.exports = function(grunt) {

  var project = {
    init: function() {
      this.title = TITLE;
      this.app = APP_PAGE;
      this.language = LANGUAGE;
      this.dir = DEVELOPMENT_DIR + '/';
      this.images = this.dir + IMAGES_DIR + '/';
      this.meta = META_DIR;
      var templatesDirCompiled = this.dir + TEMPLATES_DIR + '/';
      var resourcesDirCompiled = this.dir + RESOURCES_DIR + '/';
      this.templates = {
        dir: templatesDirCompiled,
        css: templatesDirCompiled + CSS_TEMPLATE,
        js: templatesDirCompiled + JS_TEMPLATE
      };
      this.res = {
        dir: resourcesDirCompiled,
        images: {
          dir: resourcesDirCompiled + CSS_IMAGES_DIR + '/',
          dataURI: fillAnArray(DATA_URI, resourcesDirCompiled + CSS_IMAGES_DIR + '/')
        },
        css: {
          dir: resourcesDirCompiled + CSS_DIR + '/',
          devDir: resourcesDirCompiled + CSS_DEV_DIR + '/',
          sass: resourcesDirCompiled + SASS_DIR + '/',
          filename: CSS_FILENAME,
          critical: CSS_CRITICAL
        },
        js: {
          dir: resourcesDirCompiled + JS_DIR + '/',
          devDir: resourcesDirCompiled + JS_DEV_DIR + '/',
          filename: APP
        }
      };
      this.build = {
        dir: BUILD_DIR + '/',
        critical: {
          page: CRITICAL_PAGE,
          width: CRITICAL_WIDTH,
          height: CRITICAL_HEIGHT
        }
      };
      return this;
    }
  }.init();

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({

    htmlhint: {
      options: {
        'htmlhintrc': '.htmlhintrc'
      },
      htmlHint: {
        cwd: project.build.dir,
        src: ['*.html'],
        expand: true
      }
    },
    jshint: {
      options: {
        'jshintrc': '.jshintrc'
      },
      jsHint: {
        cwd: project.res.js.devDir,
        src: ['*.js'],
        expand: true
      }
    },
    jsinspect: {
      jsInspect: {
        cwd: project.res.js.devDir,
        src: ['*.js'],
        expand: true
      }
    },
    scsslint: {
      scssLint: {
        cwd: project.res.css.sass,
        src: ['*.scss'],
        expand: true
      }
    },
    csslint: {
      options: {
        'csslintrc': '.csslintrc'
      },
      cssLint: {
        cwd: project.res.css.devDir,
        src: ['*.css'],
        expand: true
      }
    },
    csscss: {
      options: {
        verbose: true
      },
      csscssTest: {
        src: project.res.css.devDir + '*.css'
      }
    },
    colorguard: {
      files: {
        src: project.res.css.devDir + '*.css'
      }
    },
    arialinter: {
      options: {
        level: 'A'
      },
      ariaLinter: {
        cwd: project.build.dir,
        src: ['*.html'],
        expand: true
      }
    },

    backstop: {
      test: {
        options: {
          backstop_path: './node_modules/backstopjs',
          test_path: './tests',
          setup: false,
          configure: false,
          create_references: false,
          run_tests: true
        }
      }
    },

    analyzecss: {
      options: {
        outputMetrics: 'error',
        softFail: true,
        thresholds: grunt.file.readJSON('.analyzecssrc')
      },
      ananlyzeCSS: {
        sources: [project.res.css.dir + project.res.css.filename + '.min.css']
      }
    },

    sass: {
      options: {
        sourceMap: true,
        precision: 5
      },
      generateCSS: {
        cwd: project.res.css.sass,
        src: ['**/*.scss', '**/*.sass', '!**/_*.scss', '!**/_*.sass'],
        dest: project.res.css.devDir,
        ext: '.css',
        expand: true
      }
    },
    autoprefixer: {
      options: {
        map: true,
        browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1', 'Explorer >= 7'],
        cascade: false
      },
      prefixCSS: {
        cwd: project.res.css.devDir,
        src: ['**/*.css'],
        dest: project.res.css.devDir,
        expand: true
      }
    },

    concat: {
      js: {
        options: {
          separator: '\n\n'
        },
        src: '<%= task.jsArray %>',
        dest: project.res.js.dir + project.res.js.filename + '.js'
      },
      css: {
        src: '<%= task.cssArray %>',
        dest: project.res.css.dir + project.res.css.filename + '.css'
      }
    },

    'string-replace': {
      cssComments: {
        options: {
          replacements: [{
            pattern: /\/\* line \d*, .* \*\/(\r?\n|\r)*/g,
            replacement: ''
          }, {
            pattern: /\/\*# sourceMappingURL(.|\t|\s|\r?\n|\r)*?\*\//gi,
            replacement: ''
          }, {
            pattern: /.media \-sass\-debug\-info(.|\t|\s|\r?\n|\r)*?\}\}/gi,
            replacement: ''
          }, {
            pattern: /\/\*\*\* uncss>.*\*\*\*\/(\r?\n|\r)*/g,
            replacement: ''
          }, {
            pattern: /\*\s(.)*\*\/(\r?\n|\r)*$/g,
            replacement: ''
          }, {
            pattern: /\*\s(.)*\*\/(\r?\n\t*|\r\t*)*\//g,
            replacement: ''
          }, {
            pattern: /(\r?\n|\r)*\/$/g,
            replacement: ''
          }, {
            pattern: /\/\*(.)*(\r?\n|\r){4}/g,
            replacement: ''
          }]
        },
        files: {
          './': [project.res.css.dir + '*.css']
        }
      },
      build: {
        options: {
          replacements: [{
            pattern: /@tx-title/gi,
            replacement: project.title + ' App'
          },{
            pattern: /@tx-language/gi,
            replacement: project.language
          },{
            pattern: /@tx-launch/gi,
            replacement: project.app
          },{
            pattern: /.!-- @tx-css -->(.|\t|\s|\r?\n|\r)*?!-- \/@tx-css -->/gi,
            replacement: '<link rel=\'stylesheet\' type=\'text/css\' href=\'' + project.res.css.dir.replace(project.dir, '') + project.res.css.filename + '.min.css\'>'
          },{
            pattern: /.!-- @tx-js -->(.|\t|\s|\r?\n|\r)*?!-- \/@tx-js -->/gi,
            replacement: '<script type=\'text/javascript\' src=\'' + project.res.js.dir.replace(project.dir, '') + project.res.js.filename + '.min.js\'></script>'
          }]
        },
        files: {
          './': [project.build.dir + '*.{html,webapp}']
        }
      },
      critical: {
        options: {
          replacements: [{
            pattern: /(\r?\n|\r)$/g,
            replacement: ''
          },{
            pattern: /(\r?\n|\r){5}/g,
            replacement: '\n\n'
          }]
        },
        files: {
          './': [project.res.css.dir + project.res.css.critical + '.css']
        }
      }
    },

    removelogging: {
      jsClean: {
        cwd: project.res.js.dir,
        src: ['*.js'],
        dest: project.res.js.dir,
        expand: true
      },
      jsDevClean: {
        cwd: project.res.js.devDir,
        src: ['*.js'],
        dest: project.res.js.devDir,
        expand: true
      }
    },
    fixmyjs: {
      options: {
        config: '.jshintrc',
        indentpref: 'tabs'
      },
      fixMyJS: {
        cwd: project.res.js.dir,
        src: ['*.min.js'],
        dest: project.res.js.dir,
        expand: true
      }
    },
    'closure-compiler': {
      frontend: {
        cwd: project.res.js.dir,
        js: ['*.js', '!*.min.js'],
        jsOutputFile: project.res.js.dir + project.res.js.filename + '.min.js',
        options: {}
      }
    },
    uglify: {
      options: {
        preserveComments: false
      },
      jsMin: {
        cwd: project.res.js.dir,
        src: ['*.min.js'],
        dest: project.res.js.dir,
        expand: true
      }
    },

    uncss: {
      cssOptimize: {
        options: {
          ignore: [/.*-is-.*/, /.*-has-.*/, /.*-are-.*/, /js-.*/],
          stylesheets: [project.res.css.dir.replace(project.dir, '') + project.res.css.filename + '.css'],
          timeout: 1000
        },
        files: {
          cssMinFiles: function() {
            var cssMinFilesObject = {};
            cssMinFilesObject[project.res.css.dir + project.res.css.filename + '.css'] = project.dir + '*.html';
            return cssMinFilesObject;
          }
        }.cssMinFiles()
      }
    },
    csscomb: {
      options: {
        config: '.csscombrc'
      },
      cssSortBuild: {
        cwd: project.res.css.dir,
        src: ['*.css'],
        dest: project.res.css.dir,
        expand: true
      },
      cssSortDev: {
        cwd: project.res.css.devDir,
        src: ['*.css'],
        dest: project.res.css.devDir,
        expand: true
      }
    },
    cssc: {
      options: grunt.file.readJSON('.csscrc'),
      cssOptimize: {
        cwd: project.res.css.dir,
        src: ['*.css'],
        dest: project.res.css.dir,
        ext: '.min.css',
        expand: true
      }
    },
    penthouse: {
      cssCritical: {
        url: project.dir + project.build.critical.page,
        width: project.build.critical.width,
        height: project.build.critical.height,
        outfile: project.res.css.dir + project.res.css.critical + '.css',
        css: project.res.css.dir + project.res.css.filename + '.css'
      }
    },
    cssmin: {
      cssMin: {
        cwd: project.res.css.dir,
        src: ['*.min.css'],
        dest: project.res.css.dir,
        expand: true
      },
      cssMinCritical: {
        cwd: project.res.css.dir,
        src: [project.res.css.critical + '.css'],
        dest: project.res.css.dir,
        ext: '.min.css',
        expand: true
      }
    },

    processhtml: {
      options: {
        includeBase: project.templates.dir,
        commentMarker: '@tx-process',
        recursive: true
      },
      templates: {
        cwd: project.templates.dir,
        src: ['*.html', '!_*.html'],
        dest: project.dir,
        ext: '.html',
        expand: true
      }
    },
    htmlmin: {
      options: grunt.file.readJSON('.htmlminrc'),
      cleanup: {
        cwd: project.build.dir,
        src: ['*.html'],
        dest: project.build.dir,
        expand: true
      }
    },

    datauri: {
      options: {
        classPrefix: 'image-'
      },
      resImages: {
        src: project.res.images.dataURI,
        dest: project.res.css.sass + 'tx/_tx-projectImages.scss'
      }
    },
    imagemin: {
      images: {
        cwd: project.dir,
        src: ['**/*.{png,jpg,gif}', '!**/tx-*.*', '!tx/*.*'],
        dest: project.dir,
        expand: true
      },
      meta: {
        cwd: project.build.dir,
        src: ['*.{png,jpg,gif}'],
        dest: project.build.dir,
        expand: true
      }
    },
    svgmin: {
      svg: {
        cwd: project.dir,
        src: ['**/*.svg', '!**/fonts/**/*.svg'],
        dest: project.dir,
        expand: true
      }
    },
    imageoptim: {
      images: {
        options: {
          jpegMini: true,
          quitAfter: true
        },
        cwd: project.dir,
        src: ['**/*.{png,jpg,gif}', '!**/tx-*.*', '!tx/*.*'],
        dest: project.dir,
        expand: true
      },
      meta: {
        options: {
          jpegMini: true,
          imageAlpha: true,
          quitAfter: true
        },
        cwd: project.build.dir,
        src: ['*.{png,jpg,gif}'],
        dest: project.build.dir,
        expand: true
      }
    },

    clean: {
      res: [project.res.css.dir, project.res.js.dir + '*.js'],
      reports: [project.res.js.dir + '*.txt'],
      build: [project.build.dir]
    },
    copy: {
      build: {
        cwd: project.dir,
        src: ['**/*.*', '!' + project.build.critical.page, '!**/tx-*.*', '!**/templates/**', '!**/**-dev/**', '!**/tx/**'],
        dest: project.build.dir,
        expand: true
      },
      meta: {
        cwd: project.meta,
        src: ['**/*.{ico,png,jpg,gif,txt,webapp}'],
        dest: project.build.dir,
        expand: true
      }
    },
    compress: {
      cssGzip: {
        options: {
          mode: 'gzip'
        },
        cwd: project.build.dir,
        src: ['**/*.min.css', '!**/' + project.res.css.critical + '.min.css'],
        dest: project.build.dir,
        ext: '.min.css.gz',
        expand: true
      },
      jsGzip: {
        options: {
          mode: 'gzip'
        },
        cwd: project.build.dir,
        src: ['**/*.min.js'],
        dest: project.build.dir,
        ext: '.min.js.gz',
        expand: true
      },
      build: {
        options: {
          mode: 'zip',
          archive: project.title + '.build.zip'
        },
        cwd: project.build.dir,
        src: ['**'],
        dest: '.',
        expand: true
      }
    },

    watch: {
      options: {
        spawn: false
      },
      htmlTemplates: {
        files: [project.templates.dir + '*.html'],
        tasks: ['processhtml']
      },
      sass: {
        files: [project.res.css.sass + '**/*.scss', project.res.css.sass + '**/*.sass'],
        tasks: ['sass', 'autoprefixer']
      },
      sassImages: {
        files: [project.res.images.dir + '**/*.{png,jpg,gif,svg}'],
        tasks: ['sass', 'autoprefixer', 'processhtml']
      },
      livereloadWatch: {
        options: {
          livereload: true
        },
        files: [project.dir + '*.html', project.res.css.devDir + '**/*.css', project.res.js.devDir + '**/*.js', project.images + '**/*.{png,jpg,gif,svg}']
      }
    },
    concurrent: {
      options: {
        logConcurrentOutput: true,
        limit: 4
      },
      projectWatch: ['watch:htmlTemplates', 'watch:sass', 'watch:sassImages', 'watch:livereloadWatch']
    }

  });

  grunt.registerTask('process-css', 'CSS processing', function() {
    var cssDirRegEx = new RegExp('<link(.)*href="' + project.res.css.devDir.replace(project.dir, ''), 'g');
    var css = grunt.file.read(project.templates.css)
        .replace(/(.|\t|\s|\r?\n|\r)*?<!-- @tx-css -->/, '')
        .replace(/<!-- \/@tx-css -->(.|\t|\s|\r?\n|\r)*/, '')
        .replace(/^\s(.)*tx\/tx-debug(.)*/gm, '')
        .replace(/<!--(.|\t|\s|\r?\n|\r)*/, '')
        .replace(cssDirRegEx, '')
        .replace(/\r?\n|\r/g, '')
        .replace(/\s/g, '')
        .replace(/">$/, '');
    var cssArray = css.split('">');
    var cssExpected = cssArray.length;
    var cssActual = grunt.file.expand([project.res.css.devDir + '*.css']).length;
    if (cssExpected === cssActual || (cssArray[0] === '' && cssActual === 0)) {
      if (cssActual === 0) {
        grunt.log.writeln('No .css-files to process.');
      } else {
        var processTasks = [];
        processTasks.push('concat:css');
        grunt.config.set('task.cssArray', fillAnArray(cssArray, project.res.css.devDir));
        processTasks = processTasks.concat(['uncss', 'csscomb', 'string-replace:cssComments', 'cssc', 'cssmin:cssMin']);
        grunt.task.run(processTasks);
      }
    } else {
      var errorMessage = '';
      if (cssExpected > cssActual) {
        errorMessage += 'There is got to be more .css-files.';
      } else if (cssExpected < cssActual) {
        errorMessage += 'Not all of the .css-files has been referenced.';
      }
      grunt.fail.warn(errorMessage);
    }
  });

  grunt.registerTask('process-js', 'JS processing', function() {
    var jsDirRegEx = new RegExp('<script(.)*src="' + project.res.js.devDir.replace(project.dir, ''), 'g');
    var js = grunt.file.read(project.templates.js)
        .replace(/(.|\t|\s|\r?\n|\r)*?<!-- @tx-js -->/, '')
        .replace(/<!-- \/@tx-js -->(.|\t|\s|\r?\n|\r)*/, '')
        .replace(/^\s(.)*tx\/tx-debug(.)*/gm, '')
        .replace(/<!--(.|\t|\s|\r?\n|\r)*/, '')
        .replace(jsDirRegEx, '')
        .replace(/\r?\n|\r/g, '')
        .replace(/\s/g, '')
        .replace(/"><\/script>$/, '');
    var jsArray = js.split('"></script>');
    var jsExpected = jsArray.length;
    var jsActual = grunt.file.expand([project.res.js.devDir + '*.js']).length;
    if (jsExpected === jsActual || jsArray[0] === '' && jsActual === 0) {
      if (jsActual === 0) {
        grunt.log.writeln('No .js-files to process.');
      } else {
        grunt.config.set('task.jsArray', fillAnArray(jsArray, project.res.js.devDir));
        grunt.task.run(['concat:js', 'removelogging', 'fixmyjs', 'closure-compiler', 'uglify']);
      }
    } else {
      if (jsExpected > jsActual) {
        grunt.fail.warn('There is got to be more .js-files.');
      } else if (jsExpected < jsActual) {
        grunt.fail.warn('Not all of the .js-files has been referenced.');
      }
    }
  });

  grunt.registerTask('critical-cssInline', 'Injecting critical CSS', function() {
    var criticalCssRegEx = new RegExp('<(.)*' + project.res.css.filename + '.min.css(.)*>', 'g');
    var criticalCssNoScript = '<noscript><link rel="stylesheet" type="text/css" href="' + project.res.css.dir.replace(project.dir, '') + project.res.css.filename + '.min.css' + '"></noscript>';
    var criticalCssCritical = '<style type="text/css">' + grunt.file.read(project.res.css.dir + project.res.css.critical + '.min.css') + '</style>';
    var criticalCss = criticalCssCritical + '\n    ' + criticalCssNoScript;
    var cssLoad = '<script type="text/javascript" async>function loadcss(a){function e(){for(var d,f=0,g=c.length,f=0;g>f;f++)c[f].href&&c[f].href.indexOf(a)>-1&&(d=!0);d?b.media="all":setTimeout(e)}var b=window.document.createElement("link"),c=window.document.styleSheets,d=window.document.getElementsByTagName("style")[0];return b.rel="stylesheet",b.type="text/css",b.href=a,b.media="only x",d.parentNode.insertBefore(b,d.nextSibling),e(),b}loadcss(\'' + project.res.css.dir.replace(project.dir, '') + project.res.css.filename + '.min.css\');</script>';
    var pagePath = project.build.dir + project.app;
    var page = grunt.file.read(pagePath).replace(criticalCssRegEx, criticalCss).replace('<!-- @tx-critical -->', cssLoad);
    grunt.file.write(pagePath, page);
  });

  grunt.registerTask('quality', ['htmlhint', 'jshint', 'jsinspect', 'scsslint', 'csslint', 'csscss', 'colorguard', 'arialinter']);

  grunt.registerTask('test', ['backstop']);

  grunt.registerTask('performance', ['analyzecss']);

  grunt.registerTask('images-datauri', ['datauri']);

  grunt.registerTask('process-svg', ['svgmin']);

  grunt.registerTask('images', ['imagemin', 'images-datauri', 'process-svg']);

  grunt.registerTask('generate-css', ['sass', 'autoprefixer']);

  grunt.registerTask('watch-project', ['concurrent']);

  grunt.registerTask('compile', ['clean:res', 'processhtml', 'generate-css', 'process-css', 'process-js', 'images']);

  grunt.registerTask('critical', ['penthouse', 'string-replace:critical', 'cssmin:cssMinCritical', 'critical-cssInline']);

  grunt.registerTask('build', ['compile', 'clean:build', 'clean:reports', 'copy:build', 'copy:meta', 'compress:cssGzip:', 'compress:jsGzip:', 'string-replace:build', 'critical', 'htmlmin:cleanup', 'imagemin:meta']);

  grunt.registerTask('compress-build', ['compress:build']);

};
