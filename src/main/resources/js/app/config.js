require.config({
    baseUrl: "js/",
    "paths": {
        "angular": "libs/angular/angular.min",
        "bootstrap": "libs/bootstrap/dist/js/bootstrap.min",
        "angular-resource": "libs/angular-resource/angular-resource.min",
        "ui-router": "libs/angular-ui-router/release/angular-ui-router.min",
        "dragdrop": "libs/angular-dragdrop/src/angular-dragdrop.min",
        "jquery": "libs/jquery/dist/jquery.min",
        "jquery-ui": "libs/jquery-ui/jquery-ui.min",
        "angular-ui": "libs/angular-bootstrap/ui-bootstrap-tpls.min",
        "angular-filter": "libs/angular-filter/dist/angular-filter.min",
        "cookies": "libs/js-cookie/src/js.cookie",
        "underscore": "libs/underscore/underscore"
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
        },
        "underscore" : {
            exports: "_"
        }
    },
    deps: ['app/app']
});