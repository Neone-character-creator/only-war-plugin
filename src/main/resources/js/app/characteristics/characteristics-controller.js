define(function(){
	return function($scope, $uibModal, $state, characteroptions, character, dice) {
        characteroptions.characteristics().then(function(result){
        	$scope.characteristicNames = result.map(function(characteristic){
        		return characteristic.name;
        	});
        });

    	$scope.character = character.character;
    	$scope.generatedValues = [];
    	$scope.characteristics = character.character.characteristics;
	    $scope.generate = function(index) {
	        if (index === undefined) {
	            for (var i = 0; i < $scope.characteristicNames.length; i++) {
	                $scope.generatedValues[i] = dice.roll(1, 10, 2) + 20;
	                $scope.characteristics[$scope.characteristicNames[i].toLowerCase()].rolled = 0;
	            }
	        } else {
	            $scope.generatedValues[index] = dice.roll(1, 10, 2) + 20;
	        }
	    };

	    $scope.valueButtonClick = function(index) {
	        $scope.generate(index);
	    }

    var suppressDialog = false;
    var isComplete = function(){
		for(var characteristic in character.character.characteristics){
			if(character.character.characteristics[characteristic].rolled === 0){
				return false;
			}
		}
		return true;
    }

    $scope.$on('$stateChangeStart', function(e, toState, toParam, fromState, fromParams) {
        if (toState.name !== fromState.name && !isComplete()) {
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
                    templateUrl: "/pluginresource/templates/confirm-navigation-modal.html"
                }).result.then(resultHandler);
            }
        }
    });
}});