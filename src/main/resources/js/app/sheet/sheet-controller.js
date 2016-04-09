define(function() {
	return function($scope, character, regiments, specialties, characteroptions, characteristicTooltipService) {
		$scope.character = character.character();
		characteroptions.characteristics().then(function(result){
			$scope.characteristics = result;
		});

		$scope.characteristicTooltip = function(characteristic){
			characteristicTooltipService.displayed(characteristic);
		}

		$scope.talents = character.character().talents().all();
		var availableTalents = characteroptions.talents().the

		function updateAvailableTalents(){
			characteroptions.talents().then(function(result){
				$scope.availableTalents = result.filter(function(element){
					return character.character().talents().all().indexOf(element) === -1;
				});
			});
		}
		updateAvailableTalents();
		$scope.$watch('character.talents().all().length', function(newVal, oldVal){
			updateAvailableTalents();
		});
		$scope.newTalent;

		$scope.addTalent = function(){
			if($scope.newTalent){
				$scope.talents.push($scope.availableTalents[$scope.newTalent]);
				$scope.newTalent = null;
			}
		}

		$scope.removeTalent = function(index){
			$scope.talents.splice(index, 1);
		}

		$scope.criticalInjuries = character.character().wounds().criticalDamage();
		$scope.newCriticalInjury;

		$scope.addCriticalInjury = function() {
			if ($scope.newCriticalInjury) {
				$scope.criticalInjuries.push($scope.newCriticalInjury);
				$scope.newCriticalInjury = null;
			}
		};

		$scope.removeCriticalInjury = function(index) {
			$scope.criticalInjuries.splice(index, 1);
		};

		$scope.mentalDisorders = character.character().insanity().disorders();
		$scope.newMentalDisorder;

		$scope.addMentalDisorder = function() {
			if ($scope.newMentalDisorder) {
				$scope.mentalDisorders.push($scope.newMentalDisorder);
				$scope.newMentalDisorder = null;
			}
		};

		$scope.removeMentalDisorder = function(index) {
			$scope.mentalDisorders.splice(index, 1);
		};

		$scope.malignancies = character.character().corruption().malignancies();
		$scope.newMalignancy;

		$scope.addMalignancy = function() {
			if ($scope.newMalignancy) {
				$scope.malignancies.push($scope.newMalignancy);
				$scope.newMalignancy = null;
			}
		};

		$scope.removeMalignancy = function(index) {
			$scope.malignancies.splice(index, 1);
		};

		$scope.mutations = character.character().corruption().mutations();
		$scope.newMutation;

		$scope.addMutation = function() {
			if ($scope.newMutation) {
				$scope.mutations.push($scope.newMutation);
				$scope.newMutation = null;
			}
		};

		$scope.removeMutation = function(index) {
			$scope.mutations.splice(index, 1);
		};
	}
});