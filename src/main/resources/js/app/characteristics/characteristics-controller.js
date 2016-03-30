define(['app/services/characteristics', 'app/services/character'], function(characteristics, character){
	return function($scope, $uibModal, $state) {
    var characteristicNames;
    characteristics.characteristics().$promise.then(function(result) {
        characteristicNames = result;
        $scope.characteristicNames = characteristicNames;

    });
    $scope.character = character.character;
    $scope.generatedValues = [];
    $scope.characteristicValues = character.character.characteristics;
    $scope.generate = function(index) {
        if (index === undefined) {
            for (var i = 0; i < characteristicNames.length; i++) {
                $scope.generatedValues[i] = roll(2, 1, 10, 20);
                $scope.characteristicValues[characteristicNames[i].toLowerCase()] = null;
            }
        } else {
            $scope.generatedValues[index] = roll(2, 1, 10, 20);
        }
    };

    $scope.valueButtonClick = function(index) {
        $scope.generate(index);
    }

    $scope.onDrop = function(result) {
        dirty = true;
    }
    var suppressDialog = false;
    var valuesAreDirty = function() {
        var numValuesAssigned = 0;
        for (var characteristic in $scope.characteristicValues) {
            if ($scope.characteristicValues[characteristic] !== null) {
                numValuesAssigned++;
            };
        };
        return numValuesAssigned !== characteristicNames.length
    };

    $scope.$on('$stateChangeStart', function(e, toState, toParam, fromState, fromParams) {
        if (fromState.name === "characteristics" && toState.name !== fromState.name && valuesAreDirty()) {
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