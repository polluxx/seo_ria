var fs = require('fs'),
    url = require('url'),
    urlRewrite = function (rootDir, indexFile) {
        indexFile = indexFile || "index.html";
        return function (req, res, next) {
            var path = url.parse(req.url).pathname;
            return fs.readFile('./' + rootDir + path, function (err, buf) {
                if (!err) {
                    return next();
                }
                if (path.substring(path.length - 4) == 'html') { // if html file not found
                    res.writeHead(404);
                    return res.end('Not found');
                }
                return fs.readFile('./' + rootDir + '/' + indexFile, function (error, buffer) {
                    var resp;
                    if (error) {
                        return next(error);
                    }
                    resp = {
                        headers: {
                            'Content-Type': 'text/html',
                            'Content-Length': buffer.length
                        },
                        body: buffer
                    };
                    res.writeHead(200, resp.headers);
                    return res.end(resp.body);
                });
            });
        };
    };

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.registerTask('deploy', [
        'build', 'compress', 'bazalt_upload', 'bump'
    ]);
    grunt.registerTask('serve', [
        'copy:assets', 'copy:theme', 'cssmin', 'connect:dev', 'connect:cm', 'watch'
    ]);
    grunt.registerTask('serve-build', [
        'copy:assets', 'connect:build', 'watch'
    ]);

    grunt.registerTask('buildTheme', [
        'html2js',
        //'less',
        'copy:theme',

        'cssmin',
        'replace:theme'
    ]);

    grunt.registerTask('build', [
        // CSS
        'less:assets',
        'copy:assets',

        // HTML
        //'html2js',
        'htmlmin',
        'replace',

        // JS
        'requirejs',
        'uglify:requirejs',
        'uglify:app',
        'uglify:cmApp'
    ]);
    grunt.registerTask('default', [
        'build', 'serve-build'
    ]);

    require('./bazalt');
    grunt.initConfig({
        bazalt: bazalt,
        pkg: grunt.file.readJSON('package.json'),
        build_dir: './build',
        releases_dir: './releases',
        app_build_file: '_bootstrap.js',
        cm_app_build_file: '_cm_bootstrap.js',
        banner: 'Developed by me', // write your copyright

        copy: {
            assets: {
                files: [
                    {
                        expand: true,
                        src: ['assets/**', '!assets/less/**', 'favicon.png'],
                        dest: '<%= build_dir %>/'
                    }
                ]
            },
            theme: {
                files: [
                    {
                        expand: true,
                        src: [
                            'app/*.json',
                            //'locale/*',
                            'assets/**',
                            '!assets/less/**'
                        ],
                        dest: '<%= build_dir %>/'
                    }
                ]
            }
        },
        less: {
            assets: {
                src: 'assets/less/theme.less',
                dest: 'assets/css/theme.css'
            }
        },
        cssmin: {
            theme: {
                files: {
                    '<%= build_dir %>/assets/css/theme.css': [
                        'assets/css/init.css',
                        'assets/css/own.css',
                        'assets/css/calendar.css',
                        'assets/css/custom_1.css',
                        'assets/css/colorpicker.css',
                        'assets/css/font-awesome.min.css',
                        'assets/codrops/component.css',
                        'assets/codrops/content.css',
                        'bower_components/trumbowyg/dist/ui/trumbowyg.min.css',
                        'bower_components/ng-table/dist/ng-table.min.css',
                        'assets/codrops/normalize.css',
                        'assets/css/alertify/alertify.core.css',
                        'assets/css/alertify/alertify.default.css',
                        'assets/css/theme.css'
                    ]
                }
            },
            options: {
                banner: '/*! <%= banner %> */',
                keepSpecialComments: '0'
            }
        },
        requirejs: {
            frontend: {
                options: {

                    baseUrl: './app',
                    optimize: 'none',
                    preserveLicenseComments: false,
                    useStrict: true,
                    mainConfigFile: 'app/requireConfig.js',
                    name: '_bootstrap',
                    include: [],
                    exclude: ['./views.js'],
                    out: '<%= build_dir %>/<%= app_build_file %>'

                }
            },
            cmApp: {
                options: {
                    baseUrl: './cmApp',
                    optimize: 'none',
                    preserveLicenseComments: false,
                    useStrict: true,
                    mainConfigFile: 'cmApp/requireConfig.js',
                    name: '_cm_bootstrap',
                    include: [],
                    exclude: ['./views.js'],
                    out: '<%= build_dir %>/<%= cm_app_build_file %>'
                }
            }
        },
        uglify: {
            requirejs: {
                src: ['bower_components/requirejs/require.js'],
                dest: '<%= build_dir %>/r.js'
            },
            app: {
                src: ['<%= build_dir %>/<%= app_build_file %>'],
                dest: '<%= build_dir %>/<%= app_build_file %>'
            },
            cmApp: {
                src: ['<%= build_dir %>/<%= cm_app_build_file %>'],
                dest: '<%= build_dir %>/<%= cm_app_build_file %>'
            },
            options: {
                compress: false,
                mangle: false,
                preserveComments: false,
                beautify: {
                    ascii_only: true
                },
                sourceMappingURL: function (fileName) {
                    return fileName.replace(/^build\/js\//, '').replace(/\.js$/, '.map');
                },
                sourceMap: function (fileName) {
                    return fileName.replace(/\.js$/, '.map');
                }
            }
        },
        watch: {
            css: {
                files: 'assets/**/*.css',
                tasks: ['cssmin'],
                options: {
                    livereload: true
                }
            },
            html: {
                files: ['views/**/*.html'],
                tasks: ['i18nextract'],
                options: {
                    livereload: true
                }
            },
            js: {
                files: '**/*.js',
                tasks: ['requirejs', 'uglify'],
                options: {
                    livereload: true
                }
            }
        },
        htmlmin: {
            backend: {
                files: {
                    'build/index.html': 'index.html'
                },
                options: {
                    removeComments: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeOptionalTags: true,
                    collapseWhitespace: true
                }
            }
        },
        connect: {

            seo: {
                options: {
                    port: 8000,
                    hostname: 'seo.ria.local',
                    base: './'
                },
                dev: {
                    options: {
                        middleware: function (connect, options) {
                            return [
                                urlRewrite('.'),
                                connect["static"](options.base),
                                connect.directory(options.base)
                            ];
                        }
                    }
                },
                build: {
                    options: {
                        base: './build',
                        middleware: function (connect, options) {
                            return [
                                urlRewrite('./build'),
                                connect["static"](options.base),
                                connect.directory(options.base)
                            ];
                        }
                    }
                }
            },
            cm: {
                options: {
                    port: 8001,
                    hostname: 'cm.ria.local',
                    base: "./",
                    index: 'cmIndex.html'
                },
                dev: {
                    options: {
                        middleware: function (connect, options) {
                            return [
                                urlRewrite('.'),
                                connect["static"](options.base),
                                connect.directory(options.base)
                            ];
                        }
                    }
                },
                build: {
                    options: {
                        base: './build',
                        middleware: function (connect, options) {
                            return [
                                urlRewrite('./build'),
                                connect["static"](options.base),
                                connect.directory(options.base)
                            ];
                        }
                    }
                }
            },
            options: {
                port: 8000,
                hostname: 'seo.ria.local',
                base: './'
            },
            dev: {
                options: {
                    middleware: function (connect, options) {
                        return [
                            urlRewrite('.'),
                            connect["static"](options.base),
                            connect.directory(options.base)
                        ];
                    }
                }
            },
            build: {
                options: {
                    base: './build',
                    middleware: function (connect, options) {
                        return [
                            urlRewrite('./build'),
                            connect["static"](options.base),
                            connect.directory(options.base)
                        ];
                    }
                }
            }
        },
        replace: {
            admin: {
                src: '<%= build_dir %>/index.html',
                overwrite: true,
                replacements: [
                    {
                        from: /<script src="(.*)\/require.js"(.*)><\/script>/gm,
                        to: '<script src="/r.js" data-main="_bootstrap"></script>'
                    },
                    {
                        from: '<script src="/bazalt.js"></script>',
                        to: ''
                    }
                ]
            },
            theme: {
                src: '<%= build_dir %>/index.html',
                overwrite: true,
                replacements: [
                    {
                        from: /<script src="\/bower_components\/requirejs\/require.js"(.*)><\/script>/gm,
                        to: '<script src="/r.js" data-main="main"></script>'
                    },
                    {
                        from: /<script src="\/bower_components\/pace\/pace.js"><\/script>/gm,
                        to: '<script src="pace.js"></script>'
                    },
                    {
                        from: /theme.css/gm,
                        to: 'theme.css?_=<%= new Date().getTime() %>'
                    }
                ]
            }
        },
        i18nextract: {
            backend: {
                lang: ['en_GB'],
                src: ['views/**/*.html', 'index.html'],
                dest: 'locale',
                safeMode: false
            }
        },
        html2js: {
            options: {
                base: '.',
                module: 'views',
                singleModule: true,
                rename: function (moduleName) {
                    return '/' + moduleName;
                },
                htmlmin: {
                    collapseBooleanAttributes:      true,
                    collapseWhitespace:             true,
                    removeAttributeQuotes:          true,
                    removeComments:                 true, // Only if you don't use comment directives!
                    removeEmptyAttributes:          true,
                    removeRedundantAttributes:      true,
                    removeScriptTypeAttributes:     true,
                    removeStyleLinkTypeAttributes:  true
                }
            },
            app: {
                src: ['views/**/*.html'],
                dest: '<%= build_dir %>/views.js'
            }
        },
        compress: {
            main: {
                options: {
                    archive: '<%= releases_dir %>/v<%= pkg.version %>.zip'
                },
                files: [{
                    expand: true,
                    cwd: '<%= build_dir %>/',
                    src: [
                        '**/*'
                    ]
                }]
            }
        },
        bazalt_upload: {
            deploy: {
                options: {
                    version: '<%= pkg.version %>',
                    url: '<%= bazalt.api %>/deploy'
                },
                src: '<%= releases_dir %>/v<%= pkg.version %>.zip'
            }
        },
        bump: {
            options: {
                files: ['bazalt.js', 'package.json', 'bower.json'],
                updateConfigs: [],
                commit: false,
                createTag: false,
                push: false
            }
        }
    });
};