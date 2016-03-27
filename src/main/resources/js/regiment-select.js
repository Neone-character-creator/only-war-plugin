//Regiments service. Stored loaded regiment definitions and the state of the currently selected one.
angular.module("OnlyWar").factory("regiments", function($resource) {
    var regiments = $resource("Regiment/regiments.json").query();
    var service = {
        regiments: regiments,
        selected: null,
        requiredOptionSelections: [],
        selectRegiment: function(regiment) {
            service.selected = regiment;
            this.requiredOptionSelections = regiment['optional modifiers'];
        }
    };
    return service;
});

angular.module("OnlyWar").controller("RegimentSelectionController", function($scope, $uibModal, character, regiments, selection, $state, $stateParams, $uibModal) {
    $scope.regiments = regiments.regiments;
    $scope.character = character.character;
    $scope.selectedRegiment = regiments.selected;
    var suppressDialog = false;

    $scope.$on('$stateChangeStart', function(e, toState, fromState, fromParams) {
        if (fromState = "regiment" && toState !== fromState && regiments.requiredOptionSelections.length !== 0) {
            var resultHandler = function(result) {
                if (result) {
                    suppressDialog = true;
                    $state.go(toState);
                }
            };
            if (!suppressDialog) {
                e.preventDefault();
                confirm = $uibModal.open({
                    controller: "NavigationConfirmationController",
                    templateUrl: "templates/confirm-modal.html"
                }).result.then(resultHandler);
            }
        }
    });

    $scope.selectRegiment = function(index) {
        regiments.selectRegiment(regiments.regiments[index]);
        $scope.selectedRegiment = regiments.selected;
        $scope.requiredSelections = regiments.requiredOptionSelections;
    };

    $scope.openSelectionModal = function(selectedObject) {
        selection.target = regiments.selected;
        selection.associatedService = regiments;
        selection.selectionObject = selectedObject;
        $uibModal.open({
            controller: "SelectionModalController",
            templateUrl: 'templates/selection-modal.html',
        });
    };
});