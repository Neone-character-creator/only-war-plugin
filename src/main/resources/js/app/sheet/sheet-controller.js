define(function() {
	return function($scope, character, regiments, specialties, characteroptions) {
		$scope.character = character.character();
		characteroptions.characteristics().then(function(result){
			$scope.characteristics = result;
		});

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
		$scope.mutations = character.character().corruption().mutations();
		$scope.newMalignancy;
		$scope.newMutation;
		$scope.addMalignancy = function() {
			if ($scope.newMalignancy) {
				$scope.malignancies.push($scope.newMalignancy);
				$scope.newMalignancy = null;
			}
		};

		$scope.newMalignancy = function(index) {
			$scope.malignancies.splice(index, 1);
		};

		$scope.addMutation = function() {
			if ($scope.newMutation) {
				$scope.malignancies.push($scope.newMutation);
				$scope.newMutation = null;
			}
		};

		$scope.newMutation = function(index) {
			$scope.malignancies.splice(index, 1);
		};
	}
});