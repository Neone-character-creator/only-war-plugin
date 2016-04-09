define(function() {
	return function($scope, $state, regiments, character, selection, $uibModal, characteroptions) {
		characteroptions.regiments().then(function(names) {
			$scope.available = names;
		});
		$scope.character = character.character();
		$scope.selected = regiments.selected();
		$scope.requiredSelections = regiments.remainingSelections();

		var suppressDialog = false;

		$scope.$on('$stateChangeStart', function(e, toState, fromState, fromParams) {
			if (fromState = "regiment" && toState !== fromState && regiments.remainingSelections().length !== 0) {
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
				regiments.selectRegiment(regiment);
				$scope.requiredSelections = regiments.remainingSelections();
				character.character().regiment(regiment);
				$scope.selected = regiments.selected();
			}
			if (regiments.selected() && !regiments.selectionComplete) {
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
			selection.target = regiments.selected();
			selection.associatedService = regiments;
			selection.selectionObject = selectedObject;
			$uibModal.open({
				controller: "SelectionModalController",
				templateUrl: 'templates/selection-modal.html',
			}).result.then(function() {
				$scope.selected = regiments.sselected();
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