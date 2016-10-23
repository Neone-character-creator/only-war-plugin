/**
 * Created by Damien on 10/12/2016.
 */
module.exports = function (grunt) {
    grunt.initConfig({
            pfk: grunt.file.readJSON('package.json'),
            "concat-json": {
                character_json: {
                    src: '*.json',
                    dest: 'src/main/resources/dist/Character/Character.json',
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
                            cwd: "node_modules",
                            src: ["**/*.min.js", "**/*-min.js"],
                            dest: "src/main/resources/dist/js",
                            flatten: true,
                            expand: true,
                            ext: ".min.js"
                        }
                    ]
                },
                css: {
                    files: [
                        {
                            cwd: "node_modules",
                            src: "**/*.min.css",
                            dest: "src/main/resources/dist/css/",
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
                            dest: "src/main/resources/dist/js/app",
                            expand: true
                        }
                    ]
                }
            },
            uglify: {
                build: {
                    files: [{
                        cwd: "src/main/resources/js/libs/requirejs",
                        src: "require.js",
                        dest: "src/main/resources/dist/js",
                        ext: ".min.js",
                        expand: true
                    }, {
                        cwd: "src/main/resources/dist/js/app",
                        src: "**/*.compiled.js",
                        dest: "src/main/resources/dist/js/app",
                        flatten: false,
                        ext: ".min.js",
                        expand: true
                    }]
                }
            }
            ,
            babel: {
                options: {
                    presets: ["es2015"]
                }
                ,
                files: {
                    cwd: "src/main/resources/dist/js/app",
                    src: "**/*.js",
                    dest: "src/main/resources/dist/js/app",
                    expand: true,
                    ext: ".compiled.js"
                }
                ,
            }
            ,
            clean: {
                build: {
                    src: [
                        "src/main/resources/dist/js/**/*.js",
                        "src/main/resources/dist/js/**/*.compiled.js",
                        "!src/main/resources/dist/js/**/*.min.js"
                    ],
                    options: {
                        "no-write": true
                    }
                }
                ,
                prebuild: [
                    "src/main/resources/dist"
                ]
            }
        }
    )
    ;

    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-concat-json");
    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-babel");
    grunt.loadNpmTasks("grunt-contrib-clean");

    grunt.registerTask('default', ["clean:prebuild", "copy:libraries","ts", "babel", "uglify", "concat-json", "clean:build"]);
}