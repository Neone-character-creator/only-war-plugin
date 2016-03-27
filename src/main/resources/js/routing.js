app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state("sheet", {
            url: "/",
            templateUrl: "templates/sheet.html",
            controller: "SheetController"
        }).state("regiment", {
            url: "/regiment",
            templateUrl: "templates/regiment-select.html",
            controller: "RegimentSelectionController"
        })
        .state("characteristics", {
            url: "/characteristics",
            templateUrl: "templates/characteristics.html",
            controller: "CharacteristicsController"
        }).state("specialty", {
            url: "/specialty",
            templateUrl: "templates/specialty.html",
            controller: "SpecialtySelectController"
        });
});