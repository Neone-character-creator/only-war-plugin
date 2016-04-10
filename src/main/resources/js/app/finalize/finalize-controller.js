define(function() {
	return function($scope, character, characteroptions, regiments, specialties, dice) {
		$scope.character = character.character();
		$scope.selectedSpecialty = specialties.selected();
		$scope.selectedRegiment = regiments.selected();
		$scope.rolledWounds = character.character().wounds().fromRoll;
		$scope.woundsTotal = character.character().wounds().total;

		$scope.rollWounds = function() {
			character.character().wounds().fromRoll(dice.roll(1, 5));
			$scope.rolledWounds = character.character().wounds().fromRoll();
			$scope.woundsTotal = character.character().wounds().total();
		};

		$scope.rollFP = function() {
			$scope.fpRoll = dice.roll(1, 10);
			characteroptions.fatePointRolls().then(function(result) {
				character.character().fatePoints().total(result.forRoll($scope.fpRoll));
			});

			$scope.character = character.character();
		};

		$scope.availableXp = character.character().experience().available();
		$scope.categories = [{
			id: 1,
			value: "Characteristics"
		}, {
			id: 2,
			value: "Skills"
		}, {
			id: 3,
			value: "Talents"
		}, {
			id: 4,
			value: "Psychic Powers"
		}].filter(function(element){
			return element.value !== "Psychic Powers" || character.character().traits().all().find(function(trait){
				return trait.name === "Psyker";
			});
		});
		$scope.selectedCategory;
		$scope.options;
		$scope.displayedOption;

		function setDisplayedOptions(options) {
			$scope.options = options;
		};

		$scope.toggleDisplayedCategory = function() {
			switch ($scope.selectedCategory.value) {
				case "Skills":
					characteroptions.skills().then(setDisplayedOptions);
					break;
				case "Talents":
					characteroptions.talents().then(setDisplayedOptions);
					break;
				case "Psychic Powers":
					characteroptions.powers().then(setDisplayedOptions);
					break;
				case "Characteristics":
					characteroptions.characteristics().then(setDisplayedOptions);
			};
		}

		$scope.displayXpCost = function() {
			if ($scope.displayedOption) {
				characteroptions.xpCosts().then(function(result) {

					var matchingAptitudes = 0;
					if ($scope.selectedCategory.value !== 'Psychic Powers'){
						for (var a = 0; a < $scope.displayedOption.aptitudes.length; a++) {
							if (character.character().aptitudes().all().indexOf($scope.displayedOption.aptitudes[a]) !== -1) {
								matchingAptitudes++;
							}
						}
					}
					switch ($scope.selectedCategory.value) {
						case "Characteristics":
							var currentAdvancements = character.character().characteristics().byName($scope.displayedOption.name.toLowerCase()).advancements;
							characteroptions.xpCosts().then(function(result) {
								$scope.optionXpCost = new Number(result.characteristics.advances[currentAdvancements + 1]['cost by aptitudes'][matchingAptitudes]);
							});
							break;
						case "Skills":
							var currentAdvancements = character.character().skills().byName($scope.displayedOption.name.toLowerCase()) | -1;
							characteroptions.xpCosts().then(function(result) {
								$scope.optionXpCost = new Number(result.skills.advances[currentAdvancements + 1]['cost by aptitudes'][matchingAptitudes]);
							});
							break;
						case "Talents":
							var tier = $scope.displayedOption.tier;
							characteroptions.xpCosts().then(function(result) {
								$scope.optionXpCost = new Number(result.talents.advances[tier - 1]['cost by aptitudes'][matchingAptitudes]);
							});
							break;
						case "Psychic Powers":
							$scope.optionXpCost = $scope.displayedOption.value;
							break;
					};
				});
			}
		};

		$scope.buyAdvancement = function() {
			var property = [$scope.selectedCategory.value];
			var value;
			switch ($scope.selectedCategory.value) {
				case "Characteristics":
					property.push($scope.displayedOption.name);
					value = character.character().characteristics().byName($scope.displayedOption.name.toLowerCase()).advancements + 1;
					break;
				case "Skills":
					value = (character.character().skills().byName($scope.displayedOption.name.toLowerCase()) | -1) + 1;
					break;
				case "Talents":
					value = $scope.displayedOption.name;
			};
			var advancement = new Advancement($scope.optionXpCost, property, value);
			character.character().experience().addAdvancement(advancement);
			$scope.availableXp = character.character().experience().available();
		};

		$scope.numBonusAptitudes = character.character().aptitudes().all().reduce(function(previous, current, index, array){
			if(array.slice(index+1).indexOf(current) !== -1){
				previous++;
			}
			return previous;
		}, 0);

		characteroptions.characteristics().then(function(result){
			$scope.availableAptitudes = result.filter(function(element, index, array){
				var possessedAptitudes = character.character().aptitudes().all();
				return possessedAptitudes.indexOf(element.name) === -1;
			}).map(function(element){
				return element.name;
			});
		});

		$scope.chosenBonusAptitudes = [];
		$scope.addBonusAptitudes = function(){
			var filteredAptitudes = character.character().aptitudes().all().filter(function(element, index,array){
				return array.slice(index+1).indexOf(element) === -1;
			});
			for(var i = 0; i < $scope.chosenBonusAptitudes.length; i++){
				filteredAptitudes.push($scope.availableAptitudes[Number(i)]);
			}
			character.character().aptitudes().all(filteredAptitudes);
			$scope.numBonusAptitudes = character.character().aptitudes().all().reduce(function(previous, current, index, array){
            			if(array.slice(index+1).indexOf(current) !== -1){
            				previous++;
            			}
            			return previous;
            		}, 0);
		}

	};
});