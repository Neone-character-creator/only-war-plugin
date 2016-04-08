define(function() {
	return function($scope, $uibModal, $state, $stateParams, $uibModal, selection, regiments, characteroptions, character) {
		characteroptions.regiments().then(function(result){
			$scope.regiments = result;
		});

		$scope.selectedRegiment = regiments.selected();
		$scope.requiredSelections = regiments.remainingSelections();
		var suppressDialog = false;

		$scope.$on('$stateChangeStart', function(e, toState, toParam, fromState, fromParams) {
			if (fromState.name === "regiment" && toState.name !== fromState.name && !regiments.complete()) {
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

		$scope.selectRegiment = function(regiment) {
			var confirm;
			var proceed = function() {
				regiments.selectRegiment(regiment);
				$scope.selectedRegiment = regiments.selected();
				$scope.requiredSelections = regiments.remainingSelections();
				character.character().regiment(regiment);
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
			}).result.then(function(){
				$scope.selectedRegiment = regiments.selected();
			});
		};
	};
})