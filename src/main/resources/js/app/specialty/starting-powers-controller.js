define(function(){
	return function($scope, characterOptions, characterService){
		$scope.character =characterService.character;
		$scope.boughtPowers = characterService.character.psychicPowers.powers.filter(function(element){
			return element.bonus;
		});
		function getAvailablePowers(){
			var powers;
			characterOptions.powers().then(function(result){
				$scope.powers = result.filter(function(element){
					return element.value <= characterService.character.psychicPowers.bonusXp && characterService.character.psychicPowers.powers.indexOf(element) === -1;
				});
			});
		};
		getAvailablePowers();
		$scope.selectedPower;

		$scope.selectPower = function(){
			var newPower = $scope.powers[Number($scope.selectedPower)];
			newPower.bonus = true;
			characterService.character.psychicPowers.powers.push(newPower);
			getAvailablePowers();
			characterService.character.psychicPowers.bonusXp -= newPower.value;
			$scope.boughtPowers = characterService.character.psychicPowers.powers.filter(function(element){
				return element.bonus;
			});
		};

		$scope.remove = function(index){
			characterService.character.psychicPowers.bonusXp += characterService.character.psychicPowers.powers.splice(characterService.character.psychicPowers.powers.indexOf($scope.boughtPowers[index]), 1)[0].value;
			getAvailablePowers();
			$scope.boughtPowers = characterService.character.psychicPowers.powers.filter(function(element){
				return element.hasOwnProperty('bonus');
			});
		}
	};
});