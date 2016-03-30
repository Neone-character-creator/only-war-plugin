define(function(){
	return function($scope, $state, specialties, character, selection, $uibModal) {
    specialties.specialtyNames().then(function(names){
    	$scope.specialties = names;
    });
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
                    controller: "ConfirmationController",
                    templateUrl: "templates/confirm-navigation-modal.html"
                }).result.then(resultHandler);
            }
        }
    });

    $scope.selectSpecialty = function(specialty) {
        specialties.selectSpecialty(specialty);
        $scope.selectedSpecialty = specialties.selected;
        $scope.requiredSelections = specialties.requiredOptionSelections;
    };

	$scope.openSelectionModal = function(selectedObject) {
		selection.target = specialties.selected;
		selection.associatedService = specialties;
		selection.selectionObject = selectedObject;
		$uibModal.open({
			controller: "SelectionModalController",
			templateUrl: 'templates/selection-modal.html',
		});
    };
}});