/**
 * Created by Damien on 10/12/2016.
 */
module.exports = function (grunt) {
    grunt.initConfig({
            pfk: grunt.file.readJSON('package.json'),
            "concat-json": {
                character_json: {
                    src: '*.json',
                    dest: 'src/main/resources/Character/Character.json',
                    cwd : "src/main/resources/Character"
                }
            }
        }
    );

    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-concat-json");

    grunt.registerTask('default', ['concat-json']);
}