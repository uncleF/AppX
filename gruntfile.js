//Gruntfile for the AppX Project

var TITLE							= "AppX",										// Title
		APP								= "appx",										// JavaScript Package Name (Used as Production JavaScript Filename)
		APP_PAGE					= "app.html",								// Base Application Page
		LANGUAGE					= "ru",											// Language
		URL								= "http://localhost:8000",	// URL
		DEVELOPMENT				= "dev",										// Development Directory
		IMAGES						= "images",									// Images
		META							= "meta",										// Meta Images
		TEMPLATES					= "templates",							// Templates
		CSS_TEMPLATE			= "_head.html",							// Template Containing CSS Declarations
		JS_TEMPLATE				= "_scriptApp.html",				// Template Containing JavaScript Declarations
		CRITICAL_PAGE			= "index.html",							// Page That Should Contain Critical Inline CSS Styles
		CRITICAL_WIDTH		= 1200,											// Horizontal "Fold"
		CRITICAL_HEIGHT		= 900,											// Vertical "Fold"
		RESOURCES					= "res",										// Project Resources
		IMAGE_RESOURCES		= "images",									// Image Resources
		DATA_URI					= [],												// List of Images (Relative to the Image Resources Directory) to Convert to DataURI
		SASS							= "sass-dev",								// Sass
		CSS_DEV						= "css-dev",								// Generated CSS
		CSS								= "css",										// Production CSS
		CSS_FILENAME			= "styles",									// Production CSS Filename
		CSS_CRITICAL			= "critical",								// Critical CSS Filename
		JS_DEV						= "js-dev",									// JavaScript
		JS								= "js",											// Production JavaScript
		BUILD							= "build";									// Project Build

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
			this.url = URL;
			this.dir = DEVELOPMENT + "/";
			this.images = this.dir + IMAGES + "/";
			this.meta = META;
			var TEMPLATES_DIR = this.dir + TEMPLATES + "/",
					RESOURCES_DIR = this.dir + RESOURCES + "/";
			this.templates = {
				dir: TEMPLATES_DIR,
				css: TEMPLATES_DIR + CSS_TEMPLATE,
				js: TEMPLATES_DIR + JS_TEMPLATE
			};
			this.res = {
				dir: RESOURCES_DIR,
				images: {
					dir: RESOURCES_DIR + IMAGE_RESOURCES + "/",
					dataURI: fillAnArray(DATA_URI, RESOURCES_DIR + IMAGE_RESOURCES + "/")
				},
				css: {
					dir: RESOURCES_DIR + CSS + "/",
					devDir: RESOURCES_DIR + CSS_DEV + "/",
					sass: RESOURCES_DIR + SASS + "/",
					filename: CSS_FILENAME,
					critical: CSS_CRITICAL
				},
				js: {
					dir: RESOURCES_DIR + JS + "/",
					devDir: RESOURCES_DIR + JS_DEV + "/",
					filename: APP
				}
			};
			this.build = {
				dir: BUILD + "/",
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
		
		datauri: {
			options: {
				classPrefix: "image-"
			},
			resImages: {
				src: project.res.images.dataURI,
				dest: project.res.css.sass + "tx/_tx-projectImages.scss"
			}
		},

		htmlhint: {
			options: {
				"tagname-lowercase": true,
				"attr-lowercase": true,
				"attr-value-double-quotes": true,
				"doctype-first": true,
				"tag-pair": true,
				"spec-char-escape": true,
				"id-unique": true,
				"src-not-empty": true,
				"id-class-value": true,
				"style-disabled": true,
				"img-alt-require": true
			},
			htmlHint: {
				cwd: project.dir,
				src: ["*.html"],
				expand: true
			}
		},
		jshint: {
			options: {
				"evil": true,
				"regexdash": true,
				"browser": true,
				"wsh": true,
				"trailing": true,
				"sub": true
			},
			jsHint: {
				cwd: project.res.js.devDir,
				src: ["*.js", "!*.min.js"],
				expand: true
			}
		},
		csslint: {
			options: {
				"adjoining-classes": false,
				"box-model": false,
				"box-sizing": false,
				"compatible-vendor-prefixes": false,
				"display-property-grouping": true,
				"duplicate-background-images": false,
				"duplicate-properties": true,
				"empty-rules": true,
				"errors": true,
				"fallback-colors": true,
				"floats": "warning",
				"font-faces": "warning",
				"font-sizes": "warning",
				"gradients": "warning",
				"ids": "warning",
				"import": "warning",
				"important": "warning",
				"known-properties": true,
				"outline-none": "warning",
				"overqualified-elements": "warning",
				"qualified-headings": "warning",
				"regex-selectors": "warning",
				"rules-count": "warning",
				"shorthand": "warning",
				"star-property-hack": "warning",
				"text-indent": "warning",
				"underscore-property-hack": "warning",
				"unique-headings": false,
				"universal-selector": "warning",
				"vendor-prefix": true,
				"zero-units": false
			},
			cssLint: {
				cwd: project.res.css.devDir,
				src: ["*.min.css", "!*-IE.min.css"],
				expand: true
			}
		},
		analyzecss: {
			options: {
				outputMetrics: "error",
				softFail: true,
				thresholds: {
					"base64Length": 9308,
					"redundantBodySelectors": 0,
					"comments": 1,
					"commentsLength": 68,
					"complexSelectors": 32,
					"complexSelectorsByAttribute": 3,
					"duplicatedSelectors": 7,
					"emptyRules": 0,
					"expressions": 0,
					"oldIEFixes": 51,
					"imports": 0,
					"importants": 3,
					"mediaQueries": 4,
					"oldPropertyPrefixes": 65,
					"qualifiedSelectors": 28,
					"specificityIdAvg": 0.05,
					"specificityIdTotal": 35,
					"specificityClassAvg": 1.25,
					"specificityClassTotal": 872,
					"specificityTagAvg": 0.78,
					"specificityTagTotal": 548,
					"selectorsByAttribute": 93,
					"selectorsByClass": 568,
					"selectorsById": 35,
					"selectorsByPseudo": 166,
					"selectorsByTag": 519,
					"universalSelectors": 4,
					"length": 51665,
					"rules": 422,
					"selectors": 699,
					"declarations": 1240
				}
			},
			ananlyzeCSS: {
				sources: [project.res.css.dir + project.res.css.filename + ".min.css"]
			}
		},
		yslow: {
			options: {
				thresholds: {
					weight: 180,
					speed: 1000,
					score: 80,
					requests: 15
				}
			},
			pages: {
				files: [
					{
						src: project.url
					}
				]
			}
		},

		sass: {
			options: {
				// sourceMap: true,
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
				browsers: ["> 1%", "last 2 versions", "Firefox ESR", "Opera 12.1", "Explorer >= 7"],
				map: true,
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
			commentsFirst: {
				options: {
					replacements: [{
						pattern: /\/\*# sourceMappingURL(.|\t|\s|\r?\n|\r)*?\*\//gi,
						replacement: ""
					},{
						pattern: /.media \-sass\-debug\-info(.|\t|\s|\r?\n|\r)*?\}\}/gi,
						replacement: ""
					},{
						pattern: /\*\s(.)*\*\/(\r?\n|\r)*$/g,
						replacement: ""
					},{
						pattern: /\*\s(.)*\*\/(\r?\n|\r)*\//g,
						replacement: ""
					}]
				},
				files: {
					"./": [project.res.css.dir + "*.css"],
				}
			},
			commentsSecond: {
				options: {
					replacements: [{
						pattern: /(\r?\n|\r)*\/$/g,
						replacement: ""
					},{
						pattern: /\/\*(.)*(\r?\n|\r){4}/g,
						replacement: ""
					}]
				},
				files: {
					"./": [project.res.css.dir + "*.css"],
				}
			},
			build: {
				options: {
					replacements: [{
						pattern: /@tx-title/gi,
						replacement: project.title
					},{
						pattern: /@tx-language/gi,
						replacement: project.language
					},{
						pattern: /.!-- @tx-css -->(.|\t|\s|\r?\n|\r)*?!-- \/@tx-css -->/gi,
						replacement: '<link rel="stylesheet" type="text/css" href="' + project.res.css.dir.replace(project.dir, "") + project.res.css.filename + '.min.css">'
					},{
						pattern: /.!-- @tx-js -->(.|\t|\s|\r?\n|\r)*?!-- \/@tx-js -->/gi,
						replacement: '<script type="text/javascript" src="' + project.res.js.dir.replace(project.dir, "") + project.res.js.filename + '.min.js"></script>'
					}]
				},
				files: {
					"./": [project.build.dir + "*.html"],
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
		uglify: {
			options: {
				preserveComments: false
			},
			jsMin: {
				cwd: project.res.js.dir,
				src: ["*.js"],
				dest: project.res.js.dir,
				ext: ".min.js",
				expand: true
			}
		},

		csscomb: {
			options: {
				config: "csscombConfig.json"
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
			cssOptimize: {
				cwd: project.res.css.dir,
				src: ["*.css"],
				dest: project.res.css.dir,
				ext: ".min.css",
				expand: true
			}
		},
		uncss: {
			cssOptimize: {
				options: {
					ignore: [/(.)*-is-(.)*/, /(.)*-has-(.)*/, /(.)*-are-(.)*/],
					stylesheets: [project.res.css.dir.replace(project.dir, "") + project.res.css.filename + ".css"]
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
				src: ["*.tmp.html", "!_*.html"],
				dest: project.dir,
				ext: ".html",
				expand: true
			}
		},

		htmlmin: {
			cleanup: {
				options: {
					removeComments: true,
					removeCommentsFromCDATA: true,
					collapseBooleanAttributes: true,
					removeRedundantAttributes: true,
					removeEmptyAttributes: true
				},
				cwd: project.build.dir,
				src: ["*.html", "!*.min.html"],
				dest: project.build.dir,
				expand: true
			},
			minify: {
				options: {
					collapseWhitespace: true,
					removeAttributeQuotes: true,
				},
				cwd: project.build.dir,
				src: ["*.html", "!_*.html", "!*.min.html"],
				dest: project.build.dir,
				ext: ".min.html",
				expand: true
			}
		},

		clean: {
			res: [project.res.css.dir, project.res.js.dir + "*.js"],
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
				src: ["**/*.{ico,png,jpg,gif,txt}"],
				dest: project.build.dir,
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
		svgmin: {
			svg: {
				cwd: project.dir,
				src: ["**/*.svg"],
				dest: project.dir,
				expand: true
			}
		},

		compress: {
			cssGzip: {
				options: {
					mode: "gzip",
				},
				cwd: project.build.dir,
				src: ["**/*.min.css", "!**/" + project.res.css.critical + ".min.css"],
				dest: project.build.dir,
				ext: ".min.css.gz",
				expand: true
			},
			jsGzip: {
				options: {
					mode: "gzip",
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
			htmlTemplates: {
				files: [project.templates.dir + "*.html"],
				tasks: ["processhtml"]
			},
			sassStyles: {
				files: [project.res.css.sass + "**/*.scss", project.res.css.sass + "**/*.sass", "!" + project.res.css.sass + "**/_*.scss", "!" + project.res.css.sass + "**/_*.sass"],
				tasks: ["newer:sass", "newer:autoprefixer"]
			},
			sassPartials: {
				files: [project.res.css.sass + "**/_*.scss", project.res.css.sass + "**/_*.sass"],
				tasks: ["sass", "newer:autoprefixer"]
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
				limit: 5
			},
			projectWatch: ["watch:htmlTemplates", "watch:sassStyles", "watch:sassPartials", "watch:sassImages", "watch:livereloadWatch"]
		}

	});

	grunt.registerTask("process-css", "CSS processing", function() {
		var CSS_DIR_REGEX = new RegExp("<link(.)*href=\"" + project.res.css.devDir.replace(project.dir, ""), "g"),
				CSS_IE_DIR_REGEX = new RegExp("<!--(.)*href=\"" + project.res.css.devDir.replace(project.dir, ""), "g"),
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
				PROCESS_TASKS = PROCESS_TASKS.concat(["uncss", "string-replace:commentsFirst", "string-replace:commentsSecond", "csscomb", "cssc", "cssmin:cssMin"]);
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
				grunt.task.run(["concat:js", "removelogging", "uglify"]);
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
				CRITICAL_CSS = "<style>" + grunt.file.read(project.res.css.dir + project.res.css.critical + ".min.css") + "</style>",
				CSS_LOAD = '\t<script>function loadCSS(FILE) { var LINK = window.document.createElement("link"), HEAD = window.document.getElementsByTagName("head")[0]; LINK.rel = "stylesheet"; LINK.href = FILE; LINK.media = "only x"; HEAD.parentNode.insertBefore(LINK, HEAD); setTimeout( function(){ LINK.media = "all"; }, 0); } loadCSS("' + project.res.css.dir.replace(project.dir, "") + project.res.css.filename + '.min.css");</script>\n\t</body>',
				PAGE_PATH = project.build.dir + project.app,
				PAGE = grunt.file.read(PAGE_PATH).replace(CRITICAL_CSS_REGEX, CRITICAL_CSS).replace("</body>", CSS_LOAD);
		grunt.file.write(PAGE_PATH, PAGE);
	});

	grunt.registerTask("lint", ["htmlhint", "jshint", "csslint", "analyzecss"]);

	grunt.registerTask("test", ["yslow"]);

	grunt.registerTask("images-datauri", ["datauri"]);

	grunt.registerTask("images", ["imagemin", "images-datauri", "svgmin"]);

	grunt.registerTask("generate-css", ["sass", "autoprefixer"]);

	grunt.registerTask("watch-project", ["concurrent"]);

	grunt.registerTask("compile", ["clean:res", "processhtml", "generate-css", "process-css", "process-js"]);

	grunt.registerTask("critical", ["penthouse", "cssmin:cssMinCritical", "critical-cssInline"]);

	grunt.registerTask("build", ["compile", "clean:build", "copy:build", "copy:meta", "compress:cssGzip:", "compress:jsGzip:", "string-replace:build", "critical", "htmlmin:cleanup", "imagemin:meta", "compress:build"]);

};