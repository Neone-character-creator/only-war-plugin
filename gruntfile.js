/**
 * Created by Damien on 10/12/2016.
 */
module.exports = function (grunt) {

    grunt.initConfig({
            pfk: grunt.file.readJSON('package.json'),
            "concat-json": {
                character_json: {
                    src: [
                        '*.json',
                        "!Specialties.json"
                    ],
                    dest: 'dist/Character/Character.json',
                    cwd: "src/main/resources/Character"
                },
                regimentjson: {
                    src: "*.json",
                    dest: "dist/Regiment/Regiment-Creation.json",
                    cwd: "src/main/resources/Regiment/Creation"
                }
            },
            ts: {
                build: {
                    tsconfig: true
                }
            },
            copy: {
                libraries: {
                    files: [
                        {
                            "src": "angular/angular.min.js",
                            "dest": "dist/js",
                            cwd: "node_modules",
                            expand: true,
                            flatten: true
                        },
                        {
                            "src": "angular-dragdrop/src/angular-dragdrop.min.js",
                            "dest": "dist/js",
                            cwd: "node_modules",
                            expand: true,
                            flatten: true
                        },
                        {
                            "src": "angular-filter/dist/angular-filter.min.js",
                            "dest": "dist/js",
                            cwd: "node_modules",
                            expand: true,
                            flatten: true
                        },
                        {
                            "src": "angular-messages/angular-messages.min.js",
                            "dest": "dist/js",
                            cwd: "node_modules",
                            expand: true,
                            flatten: true
                        },
                        {
                            "src": "angular-resource/angular-resource.min.js",
                            "dest": "dist/js",
                            cwd: "node_modules",
                            expand: true,
                            flatten: true
                        },
                        {
                            "src": "angular-filter/dist/angular-filter.min.js",
                            "dest": "dist/js",
                            cwd: "node_modules",
                            expand: true,
                            flatten: true
                        },
                        {
                            "src": "angular-resource/angular-resource.min.js",
                            "dest": "dist/js",
                            cwd: "node_modules",
                            expand: true,
                            flatten: true
                        },
                        {
                            "src": "angular-ui-bootstrap/dist/ui-bootstrap-tpls.js",
                            "dest": "dist/js",
                            cwd: "node_modules",
                            expand: true,
                            flatten: true
                        },
                        {
                            "src": "angular-ui-bootstrap/dist/ui-bootstrap-css.css",
                            "dest": "dist/css",
                            cwd: "node_modules",
                            expand: true,
                            flatten: true
                        },
                        {
                            "src": "angular-ui-bootstrap/template/",
                            "dest": "dist/templates",
                            cwd: "node_modules",
                            expand: true
                        },
                        {
                            "src": "angular-ui-router/release/angular-ui-router.min.js",
                            "dest": "dist/js",
                            cwd: "node_modules",
                            expand: true,
                            flatten: true
                        },
                        {
                            src: "bootstrap/dist/css/**/*.min.css",
                            dest: "dist/css",
                            cwd: "node_modules",
                            expand: true,
                            flatten: true
                        },
                        {
                            src: "bootstrap/dist/fonts/**/*",
                            dest: "dist/fonts",
                            cwd: "node_modules",
                            expand: true,
                            flatten: true
                        },
                        {
                            src: "bootstrap/dist/js/**/*.min.js",
                            dest: "dist/js",
                            cwd: "node_modules",
                            expand: true,
                            flatten: true
                        },
                        {
                            src: "bootstrap-modal/app/**/*.js",
                            dest: "dist/js",
                            cwd: "node_modules",
                            expand: true,
                            flatten: true
                        },
                        {
                            src: "bootstrap-modal/**/*.css",
                            dest: "dist/css",
                            cwd: "node_modules",
                            expand: true,
                            flatten: true
                        },
                        {
                            src: [
                                "jquery/dist/*.min.js",
                                "!jquery/dist/*.slim.min.js"
                            ],
                            dest: "dist/js",
                            cwd: "node_modules",
                            expand: true,
                            flatten: true
                        },
                        {
                            src: "jquery-ui-dist/**/*.*",
                            dest: "dist/js",
                            cwd: "node_modules",
                            expand: true,
                            flatten: true
                        },
                        {
                            src: "jquery-ui-dist/*.min.css",
                            dest: "dist/css",
                            cwd: "node_modules",
                            expand: true,
                            flatten: true
                        },
                        {
                            src: "js-cookie/src/js.cookie.js",
                            dest: "dist/js",
                            cwd: "node_modules",
                            expand: true,
                            flatten: true
                        },
                        {
                            src: "babel-polyfill/dist/polyfill.min.js",
                            dest: "dist/js",
                            cwd: "node_modules",
                            expand: true,
                            flatten: true
                        }
                    ]
                },
                css: {
                    files: [
                        {
                            cwd: "node_modules",
                            src: "**/*.min.css",
                            dest: "dist/css",
                            flatten: true,
                            expand: true
                        }
                    ]
                },
                app: {
                    files: [
                        {
                            cwd: "src/main/resources/js/app",
                            src: "**/*.js",
                            dest: "dist/js/app",
                            flatten: false,
                            expand: true
                        },
                        {
                            cwd: "src/main/resources/Regiment",
                            src: "**/*.json",
                            dest: "dist/Regiment",
                            expand: true
                        },
                        {
                            cwd: "src/main/resources/Character",
                            src: "Specialty.json",
                            dest: "dist/Character",
                            expand: true
                        }
                    ]
                },
                templates: {
                    files: [
                        {
                            cwd: "src/main/resources/templates",
                            src: "**/*.html",
                            dest: "dist/templates",
                            expand: true
                        }
                    ]
                }
            },
            uglify: {
                build: {
                    options: {
                        mangle: false,
                        beautify: true
                    },
                    files: [
                        {
                            cwd: "dist/js",
                            src: "**/*.compiled.js",
                            dest: "dist/js",
                            ext: ".js",
                            expand: true,
                        },
                        {
                            src: "requirejs/require.js",
                            dest: "dist/js",
                            cwd: "node_modules",
                            expand: true,
                            flatten: true,
                            ext: ".min.js"
                        }
                    ]
                }
            },
            babel: {
                options: {
                    presets: ["latest"]
                },
                files: {
                    cwd: "dist/js/app",
                    src: "**/*.js",
                    dest: "dist/js/app",
                    expand: true,
                    ext: ".compiled.js"
                },
            },
            cssmin: {
                build: {
                    files: [
                        {
                            src: "src/main/resources/css/**/*.css",
                            dest: "dist/css",
                            expand: true,
                            flatten: true,
                            ext: ".min.css"
                        }
                    ]
                }
            },
            clean: {
                build: {
                    src: [
                        "dist/js/**/*.compiled.js",
                    ]
                },
                prebuild: {
                    src: "dist"
                }
            }
        }
    );

    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-concat-json");
    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-babel");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-cssmin");

    grunt.registerTask('default', ["clean:prebuild", "copy", "ts", "babel", "uglify", "concat-json", "cssmin", "clean:build"]);
}