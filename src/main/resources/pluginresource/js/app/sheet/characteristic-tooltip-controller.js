define(function(){
	return function($scope, characterService, characteristicTooltipService){
	var characteristic = characterService.character.characteristics[characteristicTooltipService.displayed.toLowerCase()];
	$scope.base = characteristic.rolled;
	$scope.regiment = characteristic.regiment;
	$scope.specialty = characteristic.specialty;
	$scope.advancements = characteristic.advancements * 5;
	}
});