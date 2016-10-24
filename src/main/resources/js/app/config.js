require.config({
    baseUrl: "js/",
    "paths": {
        "angular": "angular.min",
        "bootstrap": "bootstrap.min",
        "angular-resource": "angular-resource.min",
        "ui-router": "angular-ui-router.min",
        "dragdrop": "angular-dragdrop.min",
        "jquery": "jquery.min",
        "jquery-ui": "jquery-ui.min",
        "angular-ui": "ui-bootstrap-tpls",
        "angular-filter": "angular-filter.min",
        "cookies": "js.cookie",
        "underscore": "underscore.min"
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
    deps: ['app/app.min']
});