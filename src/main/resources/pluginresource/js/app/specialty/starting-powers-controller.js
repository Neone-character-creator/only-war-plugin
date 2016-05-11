define(function(){
	return function($scope, characteroptions, character){
		$scope.character =character.character;
		$scope.boughtPowers = character.character.psychicPowers.powers.filter(function(element){
			return element.bonus;
		});
		function getAvailablePowers(){
			var powers;
			characteroptions.powers().then(function(result){
				$scope.powers = result.filter(function(element){
					return element.value <= character.character.psychicPowers.bonusXp && character.character.psychicPowers.powers.indexOf(element) === -1;
				});
			});
		};
		getAvailablePowers();
		$scope.selectedPower;

		$scope.selectPower = function(){
			var newPower = $scope.powers[Number($scope.selectedPower)];
			newPower.bonus = true;
			character.character.psychicPowers.powers.push(newPower);
			getAvailablePowers();
			character.character.psychicPowers.bonusXp -= newPower.value;
			$scope.boughtPowers = character.character.psychicPowers.powers.filter(function(element){
				return element.bonus;
			});
		};

		$scope.remove = function(index){
			character.character.psychicPowers.bonusXp += character.character.psychicPowers.powers.splice(character.character.psychicPowers.powers.indexOf($scope.boughtPowers[index]), 1)[0].value;
			getAvailablePowers();
			$scope.boughtPowers = character.character.psychicPowers.powers.filter(function(element){
				return element.hasOwnProperty('bonus');
			});
		}
	};
});