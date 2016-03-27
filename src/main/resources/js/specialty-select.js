app.controller("SpecialtySelectController", function($scope, $state, specialties, character, selection, $uibModal) {
    $scope.specialties = specialties.specialties;
    $scope.character = character.character;
    $scope.selectedSpecialty = specialties.selected;

    var suppressDialog = false;

    $scope.$on('$stateChangeStart', function(e, toState, fromState, fromParams) {
        if (fromState = "specialty" && toState !== fromState && specialties.requiredOptionSelections.length !== 0) {
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

    $scope.selectSpecialty = function(index) {
        specialties.selectSpecialty(specialties.specialties[index]);
        $scope.selectedSpecialty = specialties.selected;
    };

    $scope.openSelectionModal = function(properties, index) {
        selection.target = specialties.selected;
        selection.propertyChain = properties;
        selection.index = index;
        selection.associatedService = specialties;
        $uibModal.open({
            controller: "SelectionModalController",
            templateUrl: 'templates/selection-modal.html',
        })
    };
});