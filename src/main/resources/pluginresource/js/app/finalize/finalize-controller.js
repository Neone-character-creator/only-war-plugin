define(function() {
	return function($scope, characterService, characteroptions, regiments, specialties, dice) {
		$scope.character = characterService.character;
		$scope.selectedSpecialty = specialties.selected;
		$scope.selectedRegiment = regiments.selected;

		$scope.rollWounds = function() {
			characterService.character.wounds.fromRoll = dice.roll(1, 5);
		};

		$scope.rollFP = function() {
			$scope.fpRoll = dice.roll(1, 10);
			characteroptions.fatePointRolls().then(function(result) {
				characterService.character.fatePoints.total=result.forRoll($scope.fpRoll);
			});

			$scope.character = characterService.character;
		};

		$scope.availableXp = characterService.character.experience.available;
		$scope.categories = [{
			id: 1,
			value: "Characteristics"
		},
		{
			id: 2,
			value: "Skills"
		},
		{
			id: 3,
			value: "Talents"
		},
		{
			id: 4,
			value: "Psychic Powers"
		}]
		.filter(function(element){
			return element.value !== "Psychic Powers" || characterService.character.traits.find(function(trait){
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
					characteroptions.skills().then(function(result){
						return result.filter(function(skill){
							var characterSkill= characterService.character.skills[skill.name];
								return !characterSkill || characterSkill.advancements < 4;
						});
					}).then(setDisplayedOptions);
					break;
				case "Talents":
					characteroptions.talents().then(function(result){
						return result.filter(function(talent){
							return characterService.character.talents().all().indexOf(result) === -1;
						});
					}).then(setDisplayedOptions);
					break;
				case "Psychic Powers":
					characteroptions.powers().then(function(result){
						return result.filter(function(power){
							return characterService.character.powers().all().indexOf(power) === -1;
						})
					}).then(setDisplayedOptions);
					break;
				case "Characteristics":
					characteroptions.characteristics().then(function(result){
						return result.filter(function(characteristic){
							return characterService.character.characteristics[characteristic.name.toLowerCase()].advancements < 4;
						})
					}).then(setDisplayedOptions);
			};
		}

		$scope.displayXpCost = function() {
			if ($scope.displayedOption) {
				characteroptions.xpCosts().then(function(result) {

					var matchingAptitudes = 0;
					if ($scope.selectedCategory.value !== 'Psychic Powers'){
						for (var a = 0; a < $scope.displayedOption.aptitudes.length; a++) {
							if (characterService.character.aptitudes.all.indexOf($scope.displayedOption.aptitudes[a]) !== -1) {
								matchingAptitudes++;
							}
						}
					}
					switch ($scope.selectedCategory.value) {
						case "Characteristics":
							var currentAdvancements = characterService.character.characteristics[$scope.displayedOption.name.toLowerCase()].advancements;
							characteroptions.xpCosts().then(function(result) {
								$scope.optionXpCost = new Number(result.characteristics.advances[currentAdvancements + 1]['cost by aptitudes'][matchingAptitudes]);
							});
							break;
						case "Skills":
							var currentAdvancements = characterService.character.skills[$scope.displayedOption.name.toLowerCase()] | -1;
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
					value = characterService.character.characteristics().byName($scope.displayedOption.name.toLowerCase()).advancements + 1;
					break;
				case "Skills":
					value = (characterService.character.skills().byName($scope.displayedOption.name.toLowerCase()) | -1) + 1;
					break;
				case "Talents":
					value = $scope.displayedOption.name;
			};
			var advancement = new Advancement($scope.optionXpCost, property, value);
			characterService.character.experience().addAdvancement(advancement);
			$scope.availableXp = characterService.character.experience().available();
		};

		$scope.numBonusAptitudes = characterService.character.aptitudes.reduce(function(previous, current, index, array){
			if(array.slice(index+1).indexOf(current) !== -1){
				previous++;
			}
			return previous;
		}, 0);

		characteroptions.characteristics().then(function(result){
			$scope.availableAptitudes = result.filter(function(element, index, array){
				var possessedAptitudes = characterService.character.aptitudes;
				return possessedAptitudes.indexOf(element.name) === -1;
			}).map(function(element){
				return element.name;
			});
		});

		$scope.chosenBonusAptitudes = [];
		$scope.addBonusAptitudes = function(){
			var filteredAptitudes = characterService.character.aptitudes().all().filter(function(element, index,array){
				return array.slice(index+1).indexOf(element) === -1;
			});
			for(var i = 0; i < $scope.chosenBonusAptitudes.length; i++){
				filteredAptitudes.push($scope.availableAptitudes[Number(i)]);
			}
			characterService.character.aptitudes().all(filteredAptitudes);
			$scope.numBonusAptitudes = characterService.character.aptitudes().all().reduce(function(previous, current, index, array){
            			if(array.slice(index+1).indexOf(current) !== -1){
            				previous++;
            			}
            			return previous;
            		}, 0);
		}

	};
});