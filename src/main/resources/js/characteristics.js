var roll = function(diceCount, dieMin, dieMax, modifier){
	var result = modifier;
	for(var i = 0; i < diceCount; i++){
		result += Math.floor(Math.random() * (dieMax - dieMin+ 1)) + 1;
	}
	return result;
}

angular.module("OnlyWar").controller("CharacteristicsController", function($scope, characteristics, character) {
    var characteristics = characteristics.query();
    $scope.characteristics = characteristics;
    $scope.character = character.character;
    $scope.generatedValues = [];
    $scope.generate = function(index) {
        if (index === undefined){
        	for(var i = 0; i < characteristics.length; i++){
        		$scope.generatedValues[i] = roll(2,1,10,20);
        	}
        } else {
        	$scope.generatedValues[index] = roll(2,1,10,20);
        }
    };
});