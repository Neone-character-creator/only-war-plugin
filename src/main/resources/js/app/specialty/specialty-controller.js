define(function() {
	return function($scope, $state, specialties, character, selection, $uibModal, characteroptions) {
		characteroptions.specialties().then(function(names) {
			$scope.specialties = names;
		});
		$scope.character = character.character();
		$scope.selectedSpecialty = specialties.selected();
		$scope.requiredSelections = specialties.remainingSelections();

		var suppressDialog = false;

		$scope.$on('$stateChangeStart', function(e, toState, fromState, fromParams) {
			if (fromState = "specialty" && toState !== fromState && specialties.remainingSelections().length !== 0) {
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
			var confirm;
			var proceed = function() {
				specialties.selectSpecialty(specialty);
				$scope.selectedSpecialty = specialties.selected();
				$scope.requiredSelections = specialties.remainingSelections();
				character.character().specialty(specialty);
			}
			if (specialties.selected() && !specialties.selectionComplete) {
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
			selection.target = specialties.selected();
			selection.associatedService = specialties;
			selection.selectionObject = selectedObject;
			$uibModal.open({
				controller: "SelectionModalController",
				templateUrl: 'templates/selection-modal.html',
			}).result.then(function() {
				$scope.selectedSpecialty = specialties.selected();
			});
		};

		$scope.openStartingPowersModal = function() {
			$uibModal.open({
				controller: "StartingPowersController",
				templateUrl: 'templates/starting-powers-modal.html'
			});
		}
	}
});