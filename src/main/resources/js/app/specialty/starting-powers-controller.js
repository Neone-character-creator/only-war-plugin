define(function(){
	return function($scope, characteroptions, character){
		$scope.character =character.character();
		$scope.boughtPowers = character.character().powers().all().filter(function(element){
			return element.hasOwnProperty('bonus');
		});
		function getAvailablePowers(){
			var powers;
			characteroptions.powers().then(function(result){
				$scope.powers = result.filter(function(element){
					return element.value <= character.character().powers().bonusXp() && character.character().powers().all().indexOf(element) === -1;
				});
			});
		};
		getAvailablePowers();
		$scope.selectedPower;

		$scope.selectPower = function(){
			character.character().powers().addPower($scope.powers[Number($scope.selectedPower)], true);
			getAvailablePowers();
			$scope.boughtPowers = character.character().powers().all().filter(function(element){
            			return element.hasOwnProperty('bonus');
            		});
		};

		$scope.remove = function(index){
			character.character().powers().removePower($scope.boughtPowers[index]);
			getAvailablePowers();
			$scope.boughtPowers = character.character().powers().all().filter(function(element){
				return element.hasOwnProperty('bonus');
			});
		}
	};
});