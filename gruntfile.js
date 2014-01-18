//Client-side Grunt Build File for AppX Project

var
	title						= "AppX",				//Project Title
	app							= "appx",				//JS Production Filename
	language				= "ru",					//Project Language
	dir							= "project",		//Project Directory
	images					= "images",			//Project Images Directory
	meta						= "meta",				//Meta Resources Directory
	res							= "res",				//Resources Directory

	resImages				= "images",			//Graphic Resources Directory
	resImagesFiles	= [							//Images to Convert to Data URI
										"sprites.png"
	],
	css							= "css",				//CSS Production Directory
	cssDev					= "css.dev",		//CSS Development Directory
	sass						= "sass.dev",		//Sass Development Directory
	cssFilename			= "styles",			//CSS Production Filename
	cssDevFiles			= [							//CSS Files
										"reset.css",
										"typography.css",
										"utilities.css",
										"layout.css",
										"ui.css"
	],
	js							= "js",					//JS Production Directory
	jsDev						= "js.dev",			//JS Development Directory
	jsDevFiles			= [							//JS Order
										"app.utilites.js",
										"app.screens.js",
										"app.routes.js",
										"app.js"
	],

	buildDir				= "build",			//Build Directory
	shareDir				= "build";			//Shared Build Directory

function fillAnArray(ARRAY, PATH) {
	var RESULT = [];
	for (var ELEMENT in ARRAY) {
		RESULT.push(PATH + ARRAY[ELEMENT]);
	}
	return RESULT;
}

var project = {
	init: function() {
		this.title = title;
		this.language = language;
		this.dir = dir + "/";
		this.images = this.dir + images + "/";
		this.meta = meta;
		this.resDir = this.dir + res + "/";
		this.res = {
			images: {
				dir: this.resDir + resImages + "/",
				files: fillAnArray(resImagesFiles, dir + "/" + res + "/" + resImages + "/")
			},
			css: {
				dir: this.resDir + css + "/",
				devDir: this.resDir + cssDev + "/",
				sass: this.resDir + sass + "/",
				filename: cssFilename,
				dev: fillAnArray(cssDevFiles, dir + "/" + res + "/" + cssDev + "/"),
			},
			js: {
				dir: this.resDir + js + "/",
				devDir: this.resDir + jsDev + "/",
				filename: app,
				dev: fillAnArray(jsDevFiles, dir + "/" + res + "/" + jsDev + "/")
			}
		};
		this.build = {
			dir: buildDir + "/",
			shareDir: shareDir + "/"
		};
		return this;
	}
}.init();

module.exports = function(grunt) {

	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		
		pkg: grunt.file.readJSON("package.json"),

		buildEnv: grunt.file.readJSON(process.env.buildJSON),

		datauri: {
			resImages: {
				options: {
					classPrefix: "image-"
				},
				src: project.res.images.files,
				dest: project.res.css.sass + "tx/_tx.project.images.sass"
			}
		},

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
				cwd: project.dir,
				src: ["*.html"],
				expand: true,
				flatten: true
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
				cwd: project.res.js.devDir,
				src: ["*.js"],
				expand: true,
				flatten: true
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
				cwd: project.res.css.devDir,
				src: ["*.css", "!reset.css", "!typography.css"],
				expand: true,
				flatten: true
			}
		},

		sass: {
			options: {
				sourcemap: true,
				compass: true,
				style: "expanded"
			},
			generateCSS: {
				cwd: project.res.css.sass,
				src: ["*.sass", "!txdebug.*.sass"],
				dest: project.res.css.devDir,
				expand: true,
				flatten: true,
				ext: ".css"
			}
		},

		concat: {
			js: {
				options: {
					separator: "\n\n",
				},
				src: project.res.js.dev,
				dest: project.res.js.dir + project.res.js.filename + ".js",
			},
			css: {
				src: project.res.css.dev,
				dest: project.res.css.dir + project.res.css.filename + ".css"
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
					"./": [project.res.css.dir + "*.css"],
				}
			},
			build: {
				files: {
					"./": [project.build.dir + "*.html"],
				},
				options: {
					replacements: [{
						pattern: /@tx-title/gi,
						replacement: project.title
					},{
						pattern: /@tx-language/gi,
						replacement: project.language
					},{
						pattern: /.!-- @tx-css -->(.|\t|\s|\n)*?!-- \/@tx-css -->/gi,
						replacement: '<link rel="stylesheet" type="text/css" href="' + project.res.css.dir.replace(project.dir, "") + project.res.css.filename + '.min.css">'
					},{
						pattern: /.!-- @tx-js -->(.|\t|\s|\n)*?!-- \/@tx-js -->/gi,
						replacement: '<script type="text/javascript" src="' + project.res.js.dir.replace(project.dir, "") + project.res.js.filename + '.min.js" defer></script>'
					}]
				}
			}
		},

		removelogging: {
			jsClean: {
				cwd: project.res.js.dir,
				src: ["*.js", "!*.min.js"],
				dest: project.res.js.dir,
				expand: true,
				flatten: true
			},
			jsDevClean: {
				cwd: project.res.js.dev,
				src: ["*.js"],
				dest: project.res.js.dev,
				expand: true,
				flatten: true
			}
		},
		uglify: {
			jsMin: {
				cwd: project.res.js.dir,
				src: ["*.js", "!*.min.js"],
				dest: project.res.js.dir,
				ext: ".min.js",
				expand: true,
				flatten: true
			}
		},

		cssc: {
			options: {
					consolidateViaSelectors: true,
					consolidateMediaQueries: true
			},
			cssOptimize: {
				cwd: project.res.css.dir,
				src: ["*.css", "!*.min.css"],
				dest: project.res.css.dir,
				ext: ".min.css",
				expand: true,
				flatten: true
			}
		},
		uncss: {
			cssOptimize: {
				files: {
					cssMinFiles: function() {
						var cssMinFilesObject = {};
						cssMinFilesObject[project.res.css.dir + project.res.css.filename + ".min.css"] = project.dir + "*.html";
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
				expand: true,
				flatten: true
			}
		},

		csscomb: {
			options: {
				sortOrder: "cssorder.json"
			},
			cssSort: {
				cwd: project.res.css.dir,
				src: ["*.css", "!*.min.css"],
				dest: project.res.css.dir,
				expand: true,
				flatten: true
			}
		},

		clean: {
			build: [project.build.dir]
		},
		copy: {
			build: {
				cwd: project.dir,
				src: ["**", "!**/tx-*.*", "!**/txdebug-*.*", "!**/**.dev/**", "!**/txdebug/**"],
				dest: project.build.dir,
				expand: true
			},
			meta: {
				cwd: project.meta,
				src: ["*.ico", "*.png", "*.jpg", "*.gif"],
				dest: project.build.dir,
				expand: true,
				flatten: true
			},
			share: {
				cwd: project.build.dir,
				src: ["**"],
				dest: "<%= buildEnv.shareRoot %>" + project.build.shareDir,
				expand: true
			}
		},

		imagemin: {
			images: {
				cwd: project.images,
				src: ["**/*.{png,jpg,gif}", "!**/tx-*.*", "!**/txdebug-*.*"],
				dest: project.images,
				expand: true,
				flatten: true
			},
			res: {
				cwd: project.res.images.dir,
				src: ["**/*.{png,jpg,gif}", "!**/tx-*.*", "!**/txdebug-*.*"],
				dest: project.res.images.dir,
				expand: true,
				flatten: true
			},
			meta: {
				cwd: project.build.dir,
				src: ["*.{png,jpg,gif}"],
				dest: project.build.dir,
				expand: true,
				flatten: true
			}
		},
		imageoptim: {
			images: {
				options: {
					jpegMini: true,
					quitAfter: true
				},
				cwd: project.images,
				src: ["**/*.{png,jpg,gif}", "!**/tx-*.*", "!**/txdebug-*.*"],
				dest: project.images,
				expand: true,
				flatten: true
			},
			res: {
				options: {
					jpegMini: true,
					quitAfter: true
				},
				cwd: project.res.images.dir,
				src: ["**/*.{png,jpg,gif}", "!**/tx-*.*", "!**/txdebug-*.*"],
				dest: project.res.images.dir,
				expand: true,
				flatten: true
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
				expand: true,
				flatten: true
			}
		},
		svgmin: {
			svg: {
				cwd: project.res.images.dir,
				src: ["**/*.svg"],
				dest: project.res.images.dir,
				expand: true,
			}
		},

		compress: {
			gzip: {
				options: {
					mode: "gzip",
				},
				cwd: project.build.dir,
				src: ["**/*.min.js", "**/*.min.css"],
				dest: project.build.dir,
				expand: true
			}
		}

	});

	grunt.registerTask("lint", ["htmlhint", "jshint", "sass", "csslint", "removelogging:jsDevClean"]);

	grunt.registerTask("images", ["imagemin:images", "imagemin:res", "datauri", "svgmin"]);

	grunt.registerTask("compile", ["concat", "string-replace:sassDebug", "removelogging:jsClean", "uglify", "cssc", "cssmin", "csscomb"]);

	grunt.registerTask("build", ["htmlhint", "jshint", "compile", "clean", "copy:build", "copy:meta", "imagemin:meta", "compress", "string-replace:build"]);

	grunt.registerTask("build-sass", ["sass", "build"]);

	grunt.registerTask("build-share", ["build", "copy:share"]);

	grunt.registerTask("build-experimental", ["htmlhint", "jshint", "concat", "string-replace:sassDebug", "removelogging:jsClean", "uglify", "cssc", "uncss:cssOptimize", "cssmin", "csscomb", "clean", "copy:build", "copy:meta", "imagemin:meta", "compress", "string-replace:build"]);

};