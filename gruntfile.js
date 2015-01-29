//Gruntfile for the AppX Project

var TITLE							= "AppX",										// Title
		APP								= "appx",										// JavaScript Package Name (Also used as Production JavaScript Filename)
		LANGUAGE					= "ru",											// Language
		BUILD_DIR					= "build",									// Project Build
		META_DIR					= "meta",										// Meta Content
		DEVELOPMENT_DIR		= "dev",										// Project Development
		IMAGES_DIR				= "images",									// Images
		RESOURCES_DIR			= "res",										// Resources (CSS, JavaScript, Fonts etc.)
		APP_PAGE					= "app.html",								// Application
		CRITICAL_PAGE			= "index.html",							// Page That Should Contain CRP CSS Styles
		CRITICAL_WIDTH		= 1200,											// Horizontal Fold
		CRITICAL_HEIGHT		= 900,											// Vertical Fold
		TEMPLATES_DIR			= "templates",							// Templates
		CSS_TEMPLATE			= "_head.html",							// Template Containing CSS Declarations
		JS_TEMPLATE				= "_scriptsApp.html",				// Template Containing JavaScript Declarations
		CSS_IMAGES_DIR		= "images",									// CSS Images
		DATA_URI					= [],												// Array of Images (Relative to the Image Resources Directory) to Convert to DataURI
		CSS_DIR						= "css",										// Production CSS
		SASS_DIR					= "sass-dev",								// Sass
		CSS_DEV_DIR				= "css-dev",								// Generated CSS
		CSS_FILENAME			= "styles",									// Production CSS Filename
		CSS_CRITICAL			= "critical",								// Critical CSS Filename
		JS_DIR						= "js",											// Production JavaScript
		JS_DEV_DIR				= "js-dev";									// JavaScript

function fillAnArray(ARRAY, PATH) {
	var RESULT = [];
	for (var ELEMENT in ARRAY) {
		RESULT.push(PATH + ARRAY[ELEMENT]);
	}
	return RESULT;
}

module.exports = function(grunt) {

	var project = {
		init: function() {
			this.title = TITLE;
			this.app = APP_PAGE;
			this.language = LANGUAGE;
			this.dir = DEVELOPMENT_DIR + "/";
			this.images = this.dir + IMAGES_DIR + "/";
			this.meta = META_DIR;
			var TEMPLATES_DIR_COMPILED = this.dir + TEMPLATES_DIR + "/",
					RESOURCES_DIR_COMPILED = this.dir + RESOURCES_DIR + "/";
			this.templates = {
				dir: TEMPLATES_DIR_COMPILED,
				css: TEMPLATES_DIR_COMPILED + CSS_TEMPLATE,
				js: TEMPLATES_DIR_COMPILED + JS_TEMPLATE
			};
			this.res = {
				dir: RESOURCES_DIR_COMPILED,
				images: {
					dir: RESOURCES_DIR_COMPILED + CSS_IMAGES_DIR + "/",
					dataURI: fillAnArray(DATA_URI, RESOURCES_DIR_COMPILED + CSS_IMAGES_DIR + "/")
				},
				css: {
					dir: RESOURCES_DIR_COMPILED + CSS_DIR + "/",
					devDir: RESOURCES_DIR_COMPILED + CSS_DEV_DIR + "/",
					sass: RESOURCES_DIR_COMPILED + SASS_DIR + "/",
					filename: CSS_FILENAME,
					critical: CSS_CRITICAL
				},
				js: {
					dir: RESOURCES_DIR_COMPILED + JS_DIR + "/",
					devDir: RESOURCES_DIR_COMPILED + JS_DEV_DIR + "/",
					filename: APP
				}
			};
			this.build = {
				dir: BUILD_DIR + "/",
				critical: {
					page: CRITICAL_PAGE,
					width: CRITICAL_WIDTH,
					height: CRITICAL_HEIGHT
				}
			};
			return this;
		}
	}.init();

	require("load-grunt-tasks")(grunt);

	grunt.initConfig({

		htmlhint: {
			options: {
				"htmlhintrc": ".htmlhintrc"
			},
			htmlHint: {
				cwd: project.build.dir,
				src: ["*.html"],
				expand: true
			}
		},
		jshint: {
			options: {
				"jshintrc": ".jshintrc"
			},
			jsHint: {
				cwd: project.res.js.devDir,
				src: ["*.js"],
				expand: true
			}
		},
		jsinspect: {
			jsInspect: {
				cwd: project.res.js.devDir,
				src: ["*.js"],
				expand: true
			}
		},
		csslint: {
			options: {
				"csslintrc": ".csslintrc"
			},
			cssLint: {
				cwd: project.res.css.devDir,
				src: ["*.css"],
				expand: true
			}
		},
		csscss: {
			options: {
				verbose: true
			},
			csscssTest: {
				src: project.res.css.devDir + "*.css"
			}
		},
		colorguard: {
			files: {
				src: project.res.css.devDir + "*.css"
			}
		},
		arialinter: {
			options: {
				level: "A"
			},
			ariaLinter: {
				cwd: project.build.dir,
				src: ["*.html"],
				expand: true
			}
		},

		analyzecss: {
			options: {
				outputMetrics: "error",
				softFail: true,
				thresholds: grunt.file.readJSON(".analyzecssrc")
			},
			ananlyzeCSS: {
				sources: [project.res.css.dir + project.res.css.filename + ".min.css"]
			}
		},

		sass: {
			options: {
				sourceMap: true,
				precision: 5
			},
			generateCSS: {
				cwd: project.res.css.sass,
				src: ["**/*.scss", "**/*.sass", "!**/_*.scss", "!**/_*.sass"],
				dest: project.res.css.devDir,
				ext: ".css",
				expand: true
			}
		},
		autoprefixer: {
			options: {
				map: true,
				browsers: ["> 1%", "last 2 versions", "Firefox ESR", "Opera 12.1", "Explorer >= 7"],
				cascade: false
			},
			prefixCSS: {
				cwd: project.res.css.devDir,
				src: ["**/*.css"],
				dest: project.res.css.devDir,
				expand: true
			}
		},

		concat: {
			js: {
				options: {
					separator: "\n\n"
				},
				src: "<%= TASK.JS_ARRAY %>",
				dest: project.res.js.dir + project.res.js.filename + ".js"
			},
			css: {
				src: "<%= TASK.CSS_ARRAY %>",
				dest: project.res.css.dir + project.res.css.filename + ".css"
			}
		},

		"string-replace": {
			cssComments: {
				options: {
					replacements: [{
						pattern: /\/\* line \d*, .* \*\/(\r?\n|\r)*/g,
						replacement: ""
					},{
						pattern: /\/\*# sourceMappingURL(.|\t|\s|\r?\n|\r)*?\*\//gi,
						replacement: ""
					},{
						pattern: /.media \-sass\-debug\-info(.|\t|\s|\r?\n|\r)*?\}\}/gi,
						replacement: ""
					},{
						pattern: /\/\*\*\* uncss>.*\*\*\*\/(\r?\n|\r)*/g,
						replacement: ""
					},{
						pattern: /\*\s(.)*\*\/(\r?\n|\r)*$/g,
						replacement: ""
					},{
						pattern: /\*\s(.)*\*\/(\r?\n|\r)*\//g,
						replacement: ""
					},{
						pattern: /(\r?\n|\r)*\/$/g,
						replacement: ""
					},{
						pattern: /\/\*(.)*(\r?\n|\r){4}/g,
						replacement: ""
					}]
				},
				files: {
					"./": [project.res.css.dir + "*.css"]
				}
			},
			build: {
				options: {
					replacements: [{
						pattern: /@tx-title/gi,
						replacement: project.title + " App"
					},{
						pattern: /@tx-language/gi,
						replacement: project.language
					},{
						pattern: /@tx-launch/gi,
						replacement: project.app
					},{
						pattern: /.!-- @tx-css -->(.|\t|\s|\r?\n|\r)*?!-- \/@tx-css -->/gi,
						replacement: "<link rel=\"stylesheet\" type=\"text/css\" href=\"" + project.res.css.dir.replace(project.dir, "") + project.res.css.filename + ".min.css\">"
					},{
						pattern: /.!-- @tx-js -->(.|\t|\s|\r?\n|\r)*?!-- \/@tx-js -->/gi,
						replacement: "<script type=\"text/javascript\" src=\"" + project.res.js.dir.replace(project.dir, "") + project.res.js.filename + ".min.js\"></script>"
					}]
				},
				files: {
					"./": [project.build.dir + "*.{html,webapp}"]
				}
			},
			critical: {
				options: {
					replacements: [{
						pattern: /(\r?\n|\r)$/g,
						replacement: ""
					},{
						pattern: /(\r?\n|\r){5}/g,
						replacement: "\n\n"
					}]
				},
				files: {
					"./": [project.res.css.dir + project.res.css.critical + ".css"]
				}
			}
		},

		removelogging: {
			jsClean: {
				cwd: project.res.js.dir,
				src: ["*.js"],
				dest: project.res.js.dir,
				expand: true
			},
			jsDevClean: {
				cwd: project.res.js.devDir,
				src: ["*.js"],
				dest: project.res.js.devDir,
				expand: true
			}
		},
		fixmyjs: {
			options: {
				config: ".jshintrc",
				indentpref: "tabs"
			},
			fixMyJS: {
				cwd: project.res.js.dir,
				src: ["*.min.js"],
				dest: project.res.js.dir,
				expand: true
			}
		},
		"closure-compiler": {
			frontend: {
				cwd: project.res.js.dir,
				js: ["*.js", "!*.min.js"],
				jsOutputFile: project.res.js.dir + project.res.js.filename + ".min.js",
				options: {}
			}
		},
		uglify: {
			options: {
				preserveComments: false
			},
			jsMin: {
				cwd: project.res.js.dir,
				src: ["*.min.js"],
				dest: project.res.js.dir,
				expand: true
			}
		},

		uncss: {
			cssOptimize: {
				options: {
					ignore: [/.*-is-.*/, /.*-has-.*/, /.*-are-.*/, /js-.*/],
					stylesheets: [project.res.css.dir.replace(project.dir, "") + project.res.css.filename + ".css"],
					timeout: 1000
				},
				files: {
					cssMinFiles: function() {
						var cssMinFilesObject = {};
						cssMinFilesObject[project.res.css.dir + project.res.css.filename + ".css"] = project.dir + "*.html";
						return cssMinFilesObject;
					}
				}.cssMinFiles()
			}
		},
		csscomb: {
			options: {
				config: ".csscombrc"
			},
			cssSortBuild: {
				cwd: project.res.css.dir,
				src: ["*.css"],
				dest: project.res.css.dir,
				expand: true
			},
			cssSortDev: {
				cwd: project.res.css.devDir,
				src: ["*.css"],
				dest: project.res.css.devDir,
				expand: true
			}
		},
		cssc: {
			options: grunt.file.readJSON(".csscrc"),
			cssOptimize: {
				cwd: project.res.css.dir,
				src: ["*.css"],
				dest: project.res.css.dir,
				ext: ".min.css",
				expand: true
			}
		},
		penthouse: {
			cssCritical: {
				url: project.build.dir + project.build.critical.page,
				width: project.build.critical.width,
				height: project.build.critical.height,
				outfile: project.res.css.dir + project.res.css.critical + ".css",
				css: project.res.css.dir + project.res.css.filename + ".css"
			}
		},
		cssmin: {
			cssMin: {
				cwd: project.res.css.dir,
				src: ["*.min.css"],
				dest: project.res.css.dir,
				expand: true
			},
			cssMinCritical: {
				cwd: project.res.css.dir,
				src: [project.res.css.critical + ".css"],
				dest: project.res.css.dir,
				ext: ".min.css",
				expand: true
			},
			svg: {
				cwd: project.dir,
				src: ["**/*.svg"],
				dest: project.dir,
				expand: true
			}
		},

		processhtml: {
			options: {
				includeBase: project.templates.dir,
				commentMarker: "@tx-process",
				recursive: true
			},
			templates: {
				cwd: project.templates.dir,
				src: ["*.html", "!_*.html"],
				dest: project.dir,
				ext: ".html",
				expand: true
			}
		},
		htmlmin: {
			options: grunt.file.readJSON(".htmlminrc"),
			cleanup: {
				cwd: project.build.dir,
				src: ["*.html"],
				dest: project.build.dir,
				expand: true
			}
		},

		datauri: {
			options: {
				classPrefix: "image-"
			},
			resImages: {
				src: project.res.images.dataURI,
				dest: project.res.css.sass + "tx/_tx-projectImages.scss"
			}
		},
		imagemin: {
			images: {
				cwd: project.dir,
				src: ["**/*.{png,jpg,gif}", "!**/tx-*.*", "!tx/*.*"],
				dest: project.dir,
				expand: true
			},
			meta: {
				cwd: project.build.dir,
				src: ["*.{png,jpg,gif}"],
				dest: project.build.dir,
				expand: true
			}
		},
		svgmin: {
			svg: {
				cwd: project.dir,
				src: ["**/*.svg", "!**/fonts/**/*.svg"],
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
				src: ["**/*.{png,jpg,gif}", "!**/tx-*.*", "!tx/*.*"],
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
				src: ["*.{png,jpg,gif}"],
				dest: project.build.dir,
				expand: true
			}
		},

		clean: {
			res: [project.res.css.dir, project.res.js.dir + "*.js"],
			reports: [project.res.js.dir + "*.txt"],
			build: [project.build.dir]
		},
		copy: {
			build: {
				cwd: project.dir,
				src: ["**/*.*", "!**/tx-*.*", "!**/templates/**", "!**/**-dev/**", "!**/tx/**"],
				dest: project.build.dir,
				expand: true
			},
			meta: {
				cwd: project.meta,
				src: ["**/*.{ico,png,jpg,gif,txt,webapp}"],
				dest: project.build.dir,
				expand: true
			}
		},
		compress: {
			cssGzip: {
				options: {
					mode: "gzip"
				},
				cwd: project.build.dir,
				src: ["**/*.min.css", "!**/" + project.res.css.critical + ".min.css"],
				dest: project.build.dir,
				ext: ".min.css.gz",
				expand: true
			},
			jsGzip: {
				options: {
					mode: "gzip"
				},
				cwd: project.build.dir,
				src: ["**/*.min.js"],
				dest: project.build.dir,
				ext: ".min.js.gz",
				expand: true
			},
			build: {
				options: {
					mode: "zip",
					archive: project.title + ".build.zip"
				},
				cwd: project.build.dir,
				src: ["**"],
				dest: ".",
				expand: true
			}
		},

		watch: {
			options: {
				spawn: false
			},
			htmlTemplates: {
				files: [project.templates.dir + "*.html"],
				tasks: ["processhtml"]
			},
			sass: {
				files: [project.res.css.sass + "**/*.scss", project.res.css.sass + "**/*.sass"],
				tasks: ["sass", "autoprefixer"]
			},
			sassImages: {
				files: [project.res.images.dir + "**/*.{png,jpg,gif,svg}"],
				tasks: ["sass", "autoprefixer", "processhtml"]
			},
			livereloadWatch: {
				options: {
					livereload: true
				},
				files: [project.dir + "*.html", project.res.css.devDir + "**/*.css", project.res.js.devDir + "**/*.js", project.images + "**/*.{png,jpg,gif,svg}"]
			}
		},
		concurrent: {
			options: {
				logConcurrentOutput: true,
				limit: 4
			},
			projectWatch: ["watch:htmlTemplates", "watch:sass", "watch:sassImages", "watch:livereloadWatch"]
		}

	});

	grunt.registerTask("process-css", "CSS processing", function() {
		var CSS_DIR_REGEX = new RegExp("<link(.)*href=\"" + project.res.css.devDir.replace(project.dir, ""), "g"),
				CSS = grunt.file.read(project.templates.css)
					.replace(/(.|\t|\s|\r?\n|\r)*?<!-- @tx-css -->/, "")
					.replace(/<!-- \/@tx-css -->(.|\t|\s|\r?\n|\r)*/, "")
					.replace(/^\t(.)*tx\/tx-debug(.)*/gm, "")
					.replace(/\t/g, "")
					.replace(/<!--(.|\t|\s|\r?\n|\r)*/, "")
					.replace(CSS_DIR_REGEX, "")
					.replace(/\r?\n|\r/g, "")
					.replace(/">$/, ""),
				CSS_ARRAY = CSS.split("\">"),
				CSS_EXPECTED = CSS_ARRAY.length,
				CSS_ACTUAL = grunt.file.expand([project.res.css.devDir + "*.css"]).length;
		if (CSS_EXPECTED === CSS_ACTUAL || (CSS_ARRAY[0] === "" && CSS_ACTUAL === 0)) {
			if (CSS_ACTUAL === 0) {
				grunt.log.writeln("No .css-files to process.");
			} else {
				var PROCESS_TASKS = [];
				PROCESS_TASKS.push("concat:css");
				grunt.config.set("TASK.CSS_ARRAY", fillAnArray(CSS_ARRAY, project.res.css.devDir));
				PROCESS_TASKS = PROCESS_TASKS.concat(["uncss", "string-replace:cssComments", "csscomb", "cssc", "cssmin:cssMin"]);
				grunt.task.run(PROCESS_TASKS);
			}
		} else {
			var ERROR_MESSAGE = "";
			if (CSS_EXPECTED > CSS_ACTUAL) {
				ERROR_MESSAGE += "There's got to be more .css-files.";
			} else if (CSS_EXPECTED < CSS_ACTUAL) {
				ERROR_MESSAGE += "Not all of the .css-files has been referenced.";
			}
			grunt.fail.warn(ERROR_MESSAGE);
		}
	});

	grunt.registerTask("process-js", "JS processing", function() {
		var JS_DIR_REGEX = new RegExp("<script(.)*src=\"" + project.res.js.devDir.replace(project.dir, ""), "g"),
				JS = grunt.file.read(project.templates.js)
					.replace(/(.|\t|\s|\r?\n|\r)*?<!-- @tx-js -->/, "")
					.replace(/<!-- \/@tx-js -->(.|\t|\s|\r?\n|\r)*/, "")
					.replace(/^\t(.)*tx\/tx-debug(.)*/gm, "")
					.replace(/[\t]/g, "")
					.replace(/<!--(.|\t|\s|\r?\n|\r)*/, "")
					.replace(JS_DIR_REGEX, "")
					.replace(/\r?\n|\r/g, "")
					.replace(/"><\/script>$/, ""),
				JS_ARRAY = JS.split("\"></script>"),
				JS_EXPECTED = JS_ARRAY.length,
				JS_ACTUAL = grunt.file.expand([project.res.js.devDir + "*.js"]).length;
		if (JS_EXPECTED === JS_ACTUAL || JS_ARRAY[0] === "" && JS_ACTUAL === 0) {
			if (JS_ACTUAL === 0) {
				grunt.log.writeln("No .js-files to process.");
			} else {
				grunt.config.set("TASK.JS_ARRAY", fillAnArray(JS_ARRAY, project.res.js.devDir));
				grunt.task.run(["concat:js", "removelogging", "fixmyjs", "closure-compiler", "uglify"]);
			}
		} else {
			if (JS_EXPECTED > JS_ACTUAL) {
				grunt.fail.warn("There's got to be more .js-files.");
			} else if (JS_EXPECTED < JS_ACTUAL) {
				grunt.fail.warn("Not all of the .js-files has been referenced.");
			}
		}
	});

	grunt.registerTask("critical-cssInline", "Injecting critical CSS", function() {
		var CRITICAL_CSS_REGEX = new RegExp("<(.)*" + project.res.css.filename + ".min.css(.)*>", "g"),
				CRITICAL_CSS_NOSCRIPT = "<noscript><link rel=\"stylesheet\" type=\"text/css\" href=\"" + project.res.css.dir + project.res.css.filename + ".min.css" + "\"></noscript>",
				CRITICAL_CSS_CRITICAL = "<style type=\"text/css\">" + grunt.file.read(project.res.css.dir + project.res.css.critical + ".min.css") + "</style>",
				CRITICAL_CSS = CRITICAL_CSS_CRITICAL + "\n\t\t" + CRITICAL_CSS_NOSCRIPT,
				CSS_LOAD = "\t<script type=\"text/javascript\">function loadCSS(a){function e(){for(var d,f=0,g=c.length,f=0;g>f;f++)c[f].href&&c[f].href.indexOf(a)>-1&&(d=!0);d?b.media=\"all\":setTimeout(e)}var b=window.document.createElement(\"link\"),c=window.document.styleSheets,d=window.document.getElementsByTagName(\"style\")[0];return b.rel=\"stylesheet\",b.type=\"text/css\",b.href=a,b.media=\"only x\",d.parentNode.insertBefore(b,d.nextSibling),e(),b}loadCSS(\"" + project.res.css.dir.replace(project.dir, "") + project.res.css.filename + ".min.css\");</script>\n\t</body>",
				PAGE_PATH = project.build.dir + project.app,
				PAGE = grunt.file.read(PAGE_PATH).replace(CRITICAL_CSS_REGEX, CRITICAL_CSS).replace("</body>", CSS_LOAD);
		grunt.file.write(PAGE_PATH, PAGE);
	});

	grunt.registerTask("quality", ["htmlhint", "jshint", "jsinspect", "csslint", "csscss", "colorguard", "arialinter"]);

	grunt.registerTask("performance", ["analyzecss"]);

	grunt.registerTask("images-datauri", ["datauri"]);

	grunt.registerTask("process-svg", ["svgmin", "cssmin:svg"]);

	grunt.registerTask("images", ["imagemin", "images-datauri", "process-svg"]);

	grunt.registerTask("generate-css", ["sass", "autoprefixer"]);

	grunt.registerTask("watch-project", ["concurrent"]);

	grunt.registerTask("compile", ["clean:res", "processhtml", "generate-css", "process-css", "process-js", "images"]);

	grunt.registerTask("critical", ["penthouse", "string-replace:critical", "cssmin:cssMinCritical", "critical-cssInline"]);

	grunt.registerTask("build", ["compile", "clean:build", "clean:reports", "copy:build", "copy:meta", "compress:cssGzip:", "compress:jsGzip:", "string-replace:build", "critical", "htmlmin:cleanup", "imagemin:meta"]);

	grunt.registerTask("compress-build", ["compress:build"]);

};
