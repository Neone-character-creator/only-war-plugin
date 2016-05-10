define(function(){
	return function($scope, character, armorTooltipService){
		$scope.providers = armorTooltipService.modifiers();
	}
});