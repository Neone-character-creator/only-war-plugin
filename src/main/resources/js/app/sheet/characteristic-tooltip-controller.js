define(function(){
	return function($scope, character, characteristicTooltipService){
	var characteristic = character.character().characteristics().byName(characteristicTooltipService.displayed().name.toLowerCase());
	$scope.base = characteristic.rolled;
	$scope.regiment = characteristic.regiment;
	$scope.specialty = characteristic.specialty;
	$scope.advancements = characteristic.advancements;
	}
});