/**
 * Created by Damien on 10/12/2016.
 */
module.exports = function (grunt) {
    require("time-grunt")(grunt);
    grunt.initConfig({
            pfk: grunt.file.readJSON('package.json'),
            "concat-json": {
                character_json: {
                    src: '*.json',
                    dest: 'dist/Character/Character.json',
                    cwd: "src/main/resources/Character"
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
                            "src": "angular-ui-router/release/angular-ui-router.min.js",
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
                            src: "js-cookie/src/js.cookie.js",
                            dest: "dist/js",
                            cwd: "node_modules",
                            expand: true,
                            flatten: true
                        },
                        {
                            src: "jquery/dist/jquery.min.js",
                            dest: "dist/js",
                            cwd: "node_modules",
                            expand: true,
                            flatten: true
                        },
                        {
                            src: "jquery-ui-dist/*.min.js",
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
                            expand: true
                        },
                        {
                            cwd: "src/main/resources/Regiment",
                            src: "**/*.json",
                            dest: "dist/Regiment",
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
                    files: [
                        {
                            cwd: "dist/js/app",
                            src: "**/*.compiled.js",
                            dest: "dist/js/app",
                            flatten: false,
                            ext: ".min.js",
                            expand: true
                        },
                        {
                            src: "requirejs/require.js",
                            dest: "dist/js",
                            cwd: "node_modules",
                            expand: true,
                            flatten: true,
                            ext: ".min.js",
                        }
                    ]
                }
            },
            babel: {
                options: {
                    presets: ["es2015"]
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
                        "dist/js/**/*.js",
                        "dist/js/**/*.compiled.js",
                        "!dist/js/**/*.min.js",
                        "!dist/js/js.cookies.js"
                    ]
                },
                prebuild: [
                    "dist"
                ]
            },
            requirejs: {
                compile: {
                    options: {
                        appDir: "src/main/resources/js/app",
                        include: "src/main/resources/js/app",
                        mainConfigFile: "src/main/resources/js/app/config.js",
                        path: "dist/js/compiled"
                    }
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
    grunt.loadNpmTasks("grunt-contrib-requirejs");

    grunt.registerTask('default', ["clean:prebuild", "copy:libraries","ts", "babel", "uglify", "concat-json", "clean:build"]);
}