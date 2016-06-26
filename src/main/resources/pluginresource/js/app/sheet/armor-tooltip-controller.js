define(function(){
	return function($scope, characterService, armorTooltipService){
		$scope.providers = armorTooltipService.modifiers;
	}
});