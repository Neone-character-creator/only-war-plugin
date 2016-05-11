define(function(){
	return function($scope, character, characteristicTooltipService){
	var characteristic = character.character.characteristics[characteristicTooltipService.displayed.toLowerCase()];
	$scope.base = characteristic.rolled;
	$scope.regiment = characteristic.regiment;
	$scope.specialty = characteristic.specialty;
	$scope.advancements = characteristic.advancements * 5;
	}
});