define(function(){
	return function($scope, $uibModal, $state, characteroptions, character, dice) {
        characteroptions.characteristics().then(function(result){
        	$scope.characteristicNames = result.map(function(characteristic){
        		return characteristic.name;
        	});
        });

    	$scope.character = character.character;
    	$scope.generatedValues = [];
	    	$scope.characteristics = character.character().characteristics().all();
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

    $scope.$on('$stateChangeStart', function(e, toState, toParam, fromState, fromParams) {
        if (fromState.name === "characteristics" && toState.name !== fromState.name && !character.character().characteristics().complete()) {
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
}});