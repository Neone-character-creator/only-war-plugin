define(function() {
	return function(associatedServiceName){
	var associatedServiceName = associatedServiceName;
		return function($scope, $state, $injector ,character, selection, $uibModal, characteroptions) {
		switch(associatedServiceName){
			case "regiments":
			characteroptions.regiments().then(function(names) {
				$scope.available = names;
			});
			case "specialties":
			characteroptions.specialties().then(function(names) {
				$scope.available = names;
			});
		}
		$scope.character = character.character;
		var modifierService = $injector.get(associatedServiceName);

		$scope.selected = modifierService.selected();
		$scope.requiredSelections = modifierService.remainingSelections();

		var suppressDialog = false;

		$scope.$on('$stateChangeStart', function(e, toState, fromState, fromParams) {
			if (toState !== fromState && modifierService.remainingSelections().length !== 0) {
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

		$scope.select = function(regiment) {
			var confirm;
			var proceed = function() {
				modifierService.select(regiment);
				$scope.requiredSelections = modifierService.remainingSelections();
				character.character.regiment = regiment;
				$scope.selected = modifierService.selected();
			}
			if (modifierService.selected() && !modifierService.selectionComplete) {
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
			selection.target = modifierService.selected();
			selection.associatedService = modifierService;
			selection.selectionObject = selectedObject;
			$uibModal.open({
				controller: "SelectionModalController",
				templateUrl: 'templates/selection-modal.html',
			}).result.then(function() {
				$scope.selected = modifierService.selected();
				character.character.regiment = $scope.selected;
			});
		};

		$scope.openStartingPowersModal = function() {
			$uibModal.open({
				controller: "StartingPowersController",
				templateUrl: 'templates/starting-powers-modal.html'
			});
		}
	}
}});