//Regiments service. Stored loaded regiment definitions and the state of the currently selected one.
angular.module("OnlyWar").factory("regiments", function($resource, $q) {
    var regiments = $resource("Regiment/regiments.json").query();
    var regimentNameToIndex = {};

    var service = {
        regimentNames: function() {
            var d = $q.defer();
            regiments.$promise.then(function(data) {
                for (var i = 0; i < data.length; i++) {
                    regimentNameToIndex[data[i].name] = i;
                }
                regimentNames = Object.keys(regimentNameToIndex);
                d.resolve(regimentNames);
            });
            return d.promise;
        },
        selected: null,
        requiredOptionSelections: [],
        dirty: false,
        selectRegiment: function(regimentName) {
            service.selected = Object.clone(regiments[regimentNameToIndex[regimentName]]);
            this.requiredOptionSelections = this.selected['optional modifiers'];
        }
    };
    return service
});

angular.module("OnlyWar").controller("RegimentSelectionController", function($scope, $uibModal, regiments, selection, $state, $stateParams, $uibModal) {
    regiments.regimentNames().then(function(names) {
        $scope.regimentNames = names;
    });

    $scope.selectedRegiment = regiments.selected;
    var suppressDialog = false;

    $scope.$on('$stateChangeStart', function(e, toState, toParam, fromState, fromParams) {
        if (fromState.name === "regiment" && toState.name !== fromState.name && regiments.requiredOptionSelections.length !== 0) {
            var resultHandler = function(result) {
                if (result) {
                    suppressDialog = true;
                    $state.go(toState);
                }
            };
            if (!suppressDialog) {
                e.preventDefault();
                confirm = $uibModal.open({
                    controller: "ConfirmationController",
                    templateUrl: "templates/confirm-navigation-modal.html"
                }).result.then(resultHandler);
            }
        }
    });

    $scope.selectRegiment = function(name) {
        var confirm;
        var proceed = function() {
            regiments.selectRegiment(name);
            $scope.selectedRegiment = regiments.selected;
            $scope.requiredSelections = regiments.requiredOptionSelections;
        }
        if (regiments.dirty === true) {
            confirm = $uibModal.open({
                controller: "ConfirmationController",
                templateUrl: "templates/confirm-discard-changes-modal.html"
            }).result.then(function() {
                proceed();
            });
        } else {
            proceed();
        }
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