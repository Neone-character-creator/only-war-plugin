define(function() {
	return function(associatedServiceName){
	var associatedServiceName = associatedServiceName;
		return function($scope, $state, $injector ,characterService, selection, optionselection, $uibModal, characteroptions) {
		switch(associatedServiceName){
			case "regiments":
			characteroptions.regiments().then(function(names) {
				$scope.available = names;
				$scope.selectionType = associatedServiceName;
			});
			$scope.createNewRegiment = function(){
				$uibModal.open({
					controller : "RegimentCreationController",
					templateUrl : 'pluginresource/templates/regiment-creation.html'
				}).result.then(function(result){

				});
			}
			break;
			case "specialties":
			characteroptions.specialties().then(function(names) {
				$scope.available = names;
				$scope.selectionType = associatedServiceName;
			});
			break;
		}
		$scope.character = characterService.character;
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
						templateUrl: "pluginresource/templates/confirm-navigation-modal.html"
					}).result.then(resultHandler);
				}
			}
		});

		$scope.select = function(selected) {
			var confirm;
			var proceed = function() {
				modifierService.select(selected);
				$scope.requiredSelections = modifierService.remainingSelections();
				switch(associatedServiceName){
					case "regiments":
						characterService.character.regiment = selected;
					break;
					case "specialties":
						characterService.character.specialty = selected;
					break;
				}
				$scope.selected = modifierService.selected();
			}
			if (modifierService.selected() && !modifierService.selectionComplete) {
				confirm = $uibModal.open({
					controller: "ConfirmationController",
					templateUrl: "pluginresource/templates/confirm-discard-changes-modal.html"
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
				templateUrl: 'pluginresource/templates/selection-modal.html',
			}).result.then(function() {
				$scope.selected = modifierService.selected();
				switch(associatedServiceName){
                					case "regiments":
                						characterService.character.regiment = $scope.selected;
                					break;
                					case "specialties":
                						characterService.character.specialty = $scope.selected;
                					break;
                				}
                optionselection.target = $scope.selected;
                optionselection.selectionObject = selectedObject;
                optionselection.selected = selection.selected;
                optionselection.associatedService = modifierService;
                optionselection.applySelection();
			});
		};

		$scope.openStartingPowersModal = function() {
			$uibModal.open({
				controller: "StartingPowersController",
				templateUrl: 'pluginresource/templates/starting-powers-modal.html'
			});
		}
	}
}});