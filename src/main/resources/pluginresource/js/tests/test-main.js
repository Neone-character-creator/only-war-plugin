var allTestFiles = [];
var TEST_REGEXP = /(spec|test)\.js$/i;

// Get a list of all the test files to include
Object.keys(window.__karma__.files).forEach(function (file) {
    if (TEST_REGEXP.test(file)) {
        // Normalize paths to RequireJS module names.
        // If you require sub-dependencies of test files to be loaded as-is (requiring file extension)
        // then do not normalize the paths
        var normalizedTestModule = file.replace(/^\/base\/|\.js$/g, '');
        allTestFiles.push(normalizedTestModule);
    }
});

require.config({
    baseUrl: '/base',
    "paths": {
        "angular": "libs/angular/angular",
        "bootstrap": "libs/bootstrap/dist/js/bootstrap",
        "angular-resource": "libs/angular-resource/angular-resource",
        "ui-router": "libs/angular-ui-router/release/angular-ui-router",
        "dragdrop": "libs/angular-dragdrop/src/angular-dragdrop",
        "jquery": "libs/jquery/dist/jquery.min",
        "jquery-ui": "libs/jquery-ui/jquery-ui",
        "angular-ui": "libs/angular-bootstrap/ui-bootstrap-tpls",
        "angular-filter": "libs/angular-filter/dist/angular-filter",
        "cookies": "libs/js-cookie/src/js.cookie"
    },
    shim: {
        "jquery": {
            exports: "$"
        },
        "angular": {
            exports: "angular"
        },
        "ui-router": {
            deps: ['angular']
        },
        "angular-resource": {
            deps: ["angular"]
        },
        "jquery-ui": {
            deps: ["jquery"]
        },
        "dragdrop": {
            deps: ['angular', 'jquery-ui']
        },
        "angular-ui": {
            deps: ['angular']
        },
        "angular-filter": {
            deps: ['angular']
        },
        "angular-cookies": {
            deps: ['angular'],
            exports: 'angularCookies'
        },
        "bootstrap": {
            deps: ['jquery']
        }
    },
    deps: allTestFiles,
    callback: window.__karma__.start
});

require(["app/app"], function (app) {
});