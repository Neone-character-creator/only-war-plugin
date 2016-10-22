require.config({
    baseUrl: "js/",
    "paths": {
        "angular": "libs/angular.min",
        "bootstrap": "libs/bootstrap.min",
        "angular-resource": "libs/angular-resource.min",
        "ui-router": "libs/angular-ui-router.min",
        "dragdrop": "libs/angular-dragdrop.min",
        "jquery": "libs/jquery.min",
        "jquery-ui": "libs/jquery-ui.min",
        "angular-ui": "libs/ui-bootstrap-tpls.min",
        "angular-filter": "libs/angular-filter.min",
        "cookies": "libs/js.cookie.min",
        "underscore": "libs/underscore.min"
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