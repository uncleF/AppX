//Client-side Grunt Build File (gruntfile.js) for AppX Project

var
	title					= "AppX",				//Project Title
	app						= "appx",				//JS Production Filename
	language			= "ru",					//Project Language
	dir						= "project",		//Project Directory
	meta					= "meta",				//Meta Resources Directory
	res						= "res",				//Resources Directory

	css						= "css",				//CSS Production Directory
	cssDev				= "css.dev",		//CSS Development Directory
	cssFilename		= "styles",			//CSS Production Filename
	cssDevFiles		= [							//CSS Order
									"reset.css",
									"typographics.css",
									"layout.css",
									"ui.css",
	],
	js						= "js",					//JS Production Directory
	jsDev					= "js.dev",			//JS Development Directory
	jsDevFiles		= [							//JS Order
									"app.utilites.js",
									"app.screens.js",
									"app.routes.js",
									"app.js",
	],

	buildDir			= "build",			//Build Directory
	shareDir			= "build";			//Shared Build Directory

function fillAnArray(arr, path) {
	var resultArr = [];
	for (var i in arr) {
		resultArr.push(path + "/" + arr[i]);
	}
	return resultArr;
}

var project = {
	init: function() {
		this.title = title;
		this.language = language;
		this.dir = dir;
		this.meta = meta;
		this.resDir = this.dir + "/" + res;
		this.res = {
			css: {
				dir: this.resDir + "/" + css,
				devDir: this.resDir + "/" + cssDev,
				filename: cssFilename,
				dev: fillAnArray(cssDevFiles, dir + "/" + res + "/" + cssDev + "/"),
			},
			js: {
				dir: this.resDir + "/" + js,
				devDir: this.resDir + "/" + jsDev,
				filename: app,
				dev: fillAnArray(jsDevFiles, dir + "/" + res + "/" + jsDev + "/")
			}
		};
		this.build = {
			dir: buildDir,
			shareDir: shareDir
		};
		return this;
	}
}.init();

module.exports = function(grunt) {

	require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

	grunt.initConfig({
		
		pkg: grunt.file.readJSON("package.json"),

		buildEnv: grunt.file.readJSON(process.env.buildJSON),

		htmlhint: {
			htmlHint: {
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
				src: project.dir + "/*.html"
			}
		},
		jshint: {
			jsHint: {
				options: {
					"evil": true,
					"regexdash": true,
					"browser": true,
					"wsh": true,
					"trailing": true,
					"sub": true
				},
				src: project.res.js.devDir + "/*.js"
			}
		},
		csslint: {
			cssLint: {
				options: {
					"adjoining-classes": false,
					"box-model": false,
					"box-sizing": false,
					"compatible-vendor-prefixes": "warning",
					"display-property-grouping": true,
					"duplicate-background-images": false,
					"duplicate-properties": true,
					"empty-rules": true,
					"errors": true,
					"fallback-colors": false,
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
					"unique-headings": "warning",
					"universal-selector": "warning",
					"vendor-prefix": true,
					"zero-units": false
				},
				src: [project.res.css.devDir + "/*.css", "!" + project.res.css.devDir + "/reset*.css", "!" + project.res.css.devDir + "/typographics*.css"]
			}
		},

		concat: {
			js: {
				options: {
					separator: "\n\n",
				},
				src: project.res.js.dev,
				dest: project.res.js.dir + "/" + project.res.js.filename + ".js",
			},
			css: {
				src: project.res.css.dev,
				dest: project.res.css.dir + "/" + project.res.css.filename + ".css"
			}
		},

		"string-replace": {
			sassDebug: {
				options: {
					replacements: [{
						pattern: /\/\*@ sourceMappingURL(.|\t|\s|\n)*?\*\/|.media \-sass\-debug\-info(.|\t|\s|\n)*?\}\}/gi,
						replacement: ""
					}]
				},
				files: {
					"./": [project.res.css.dir + "/*.css"],
				}
			},
			build: {
				files: {
					"./": [project.build.dir + "/*.html"],
				},
				options: {
					replacements: [{
						pattern: /@tx-title!/gi,
						replacement: project.title
					},{
						pattern: /@tx-language!/gi,
						replacement: project.language
					},{
						pattern: /.!-- @tx-css -->(.|\t|\s|\n)*?!-- \/@tx-css -->/gi,
						replacement: '<link rel="stylesheet" type="text/css" href="res/css/' + project.res.css.filename + '.min.css">'
					},{
						pattern: /.!-- @tx-js -->(.|\t|\s|\n)*?!-- \/@tx-js -->/gi,
						replacement: '<script type="text/javascript" src="res/js/' + project.res.js.filename + '.min.js"></script>'
					}]
				}
			}
		},

		uglify: {
			jsMin: {
				src: [project.res.js.dir + "/*.js", "!" + project.res.js.dir + "/*.min.js"],
				dest: project.res.js.dir,
				expand: true,
				flatten: true,
				ext: ".min.js"
			}
		},

		cssc: {
			options: {
					consolidateViaSelectors: true,
					consolidateMediaQueries: true
			},
			cssOptimize: {
				src: [project.res.css.dir + "/*.css", "!" + project.res.css.dir + "/*.min.css"],
				dest: project.res.css.dir,
				expand: true,
				flatten: true,
				ext: ".min.css"
			}
		},
		uncss: {
			cssOptimize: {
				files: {
					cssMinFiles: function() {
						var cssMinFilesObject = {};
						cssMinFilesObject[project.res.css.dir + "/" + project.res.css.filename + ".min.css"] = project.dir + "/*.html";
						return cssMinFilesObject;
					}
				}.cssMinFiles()
			}
		},
		cssmin: {
			options: {
				report: "gzip"
			},
			cssMin: {
				src: project.res.css.dir + "/*.min.css",
				dest: project.res.css.dir,
				expand: true,
				flatten: true,
			}
		},

		csscomb: {
			options: {
				sortOrder: "cssorder.json"
			},
			cssSort: {
				src: [project.res.css.dir + "/*.css", "!" + project.res.css.dir + "/*.min.css"],
				dest: project.res.css.dir,
				expand: true,
				flatten: true
			}
		},

		clean: {
			build: [project.build.dir + "/"]
		},
		copy: {
			build: {
				cwd: project.dir + "/",
				src: ["**", "!**/tx.*.*", "!**/txdebug.*.*", "!**/**.dev/**", "!**/txdebug/**"],
				dest: project.build.dir,
				expand: true
			},
			meta: {
				cwd: project.meta + "/",
				src: ["*.ico", "*.png", "*.jpg", "*.gif"],
				dest: project.build.dir,
				expand: true
			},
			share: {
				cwd: project.build.dir + "/",
				src: ["**"],
				dest: "<%= buildEnv.shareRoot %>" + "/" + project.build.shareDir,
				expand: true
			}
		},

		yuidoc: {
			all: {
				name: '<%= pkg.name %>',
				description: '<%= pkg.description %>',
				version: '<%= pkg.version %>',
				url: '<%= pkg.homepage %>',
				options: {
					paths: [project.res.js.dir],
					outdir: project.dir + '/docs/'
				}
			}
		}

	});

	grunt.registerTask("lint", ["htmlhint", "jshint", "csslint"]);

	grunt.registerTask("build", ["htmlhint", "jshint", "csslint", "concat", "string-replace:sassDebug", "uglify", "cssc", "cssmin", "csscomb", "clean", "copy:build", "copy:meta", "string-replace:build"]);

	grunt.registerTask("build-share", ["htmlhint", "jshint", "csslint", "concat", "string-replace:sassDebug", "uglify", "cssc", "cssmin", "csscomb", "clean", "copy:build", "copy:meta", "string-replace:build", "copy:share"]);

	grunt.registerTask("build-ex", ["htmlhint", "jshint", "csslint", "concat", "string-replace:sassDebug", "uglify", "cssc", "uncss:cssOptimize", "cssmin", "csscomb", "clean", "copy:build", "copy:meta", "string-replace:build"]);

	grunt.registerTask("doc", ["yuidoc"]);

};