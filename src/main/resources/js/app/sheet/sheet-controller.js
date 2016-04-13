define(function() {
	return function($scope, character, regiments, specialties, characteroptions, characteristicTooltipService, armorTooltipService) {
		$scope.character = character.character;
		characteroptions.characteristics().then(function(result){
			$scope.characteristics = result.map(function(element){return element.name});
		});

		$scope.characteristicTooltip = function(characteristic){
			characteristicTooltipService.displayed = characteristic;
		}

		function updateAvailableSkills(){
			characteroptions.skills().then(function(result){
				$scope.availableSkills = result.filter(function(element){
					for(var skill in character.character.skills){
						if(skill === element.name){
							return false;
						}
					}
					return true;
				});
			});
		};
		updateAvailableSkills();

		function updateAvailableTalents(){
			characteroptions.talents().then(function(result){
				$scope.availableTalents = result.filter(function(element){
					return character.character.talents.indexOf(element) === -1;
				});
			});
		};
		updateAvailableTalents();
		$scope.newSkillSpecialization;

		$scope.$watch('character.skills', function(){
			updateAvailableTalents();
		});

		$scope.$watch('character.talents.all().length', function(newVal, oldVal){
			updateAvailableTalents();
		});

		$scope.$watch('newSkill', function(newVal, oldVal){
			if(newVal){
				var newSkill = angular.copy($scope.availableSkills[$scope.newSkill]);
				var matchingAptitudes = 0;
				for (var a = 0; a < newSkill.aptitudes; a++) {
					if (character.character.aptitudes.all().indexOf($scope.displayedOption.aptitudes[a]) !== -1) {
						matchingAptitudes++;
					}
				}
				characteroptions.xpCosts().then(function(result) {
					$scope.newSkillXpCost = new Number(result.skills.advances[0]['cost by aptitudes'][matchingAptitudes]);
				});
			}
		});
		$scope.addSkill = function(){
			if($scope.newSkill){
				var selectedSkill = $scope.availableSkills[$scope.newSkill];
				var name = selectedSkill.name;
				if($scope.newSkillSpecialization){
					name += " (" + $scope.newSkillSpecialization + ")";
				}
				var newSkill = {
					name : name,
					rating : 1
				};
				character.character.experience.addAdvancement($scope.newSkillXpCost, "skills", newSkill);
				$scope.newSkill = null;
			}
		};

		$scope.setSkillLevel = function(skillName, newRating){
			if(skillName && newRating){
				//If the new rating is an increase, determine how many new levels are needed.
				if(newRating - character.character.skills[skillName] > 0){
					if(skillName.indexOf("(") !== -1){
						skillName = skillName.substring(0, skillName.indexOf("(")).trim();
					};
					var matchingAptitudes = 0;
					characteroptions.skills().then(function(result){
						for(var i = character.character.skills[skillName]+1; i <= newRating; i++){
							$.each(result, function(index, element){
								if(element.name === skillName){
									var newRating = i;
									for (var a = 0; a < element.aptitudes; a++) {
										if (character.character.aptitudes.all().indexOf($scope.displayedOption.aptitudes[a]) !== -1) {
											matchingAptitudes++;
										};
									};
									characteroptions.xpCosts().then(function(result) {
										var xpCost = new Number(result.skills.advances[newRating - 1]['cost by aptitudes'][matchingAptitudes]);
										if($scope.newSkillSpecialization){
											skillName += " (" + $scope.newSkillSpecialization + ")";
										};
										var newSkill = {
											name : skillName,
											rating : newRating
										};
										character.character.experience.addAdvancement(xpCost, "skills", newSkill);
									});
									return false;
								};
							});
						}
				});
			} else if(newRating - character.character.skills[skillName] < 0){
				for(var i = character.character.skills[skillName]; i >= newRating; i--){
					//Look for any advancements that increased the skill between the current rating and the new one
					var indexesToRemove =[];
					$.each(character.character.experience._advancementsBought, function(index, element){
						if(element.property === "skills" && element.value.rating > newRating){
							indexesToRemove.push(index);
						}
					});
					//Sort and reverse the array. Removing elements backwards means that each change to the array  won't affect the index of the next item to remove.
					indexesToRemove = indexesToRemove.sort(function(a, b){
						return b-a;
					})
					$.each(indexesToRemove, function(loopIndex, indexToRemove){
						character.character.experience.removeAdvancement(indexToRemove);
					})
				}
			}
		}
	}


		$scope.newTalent;

		$scope.addTalent = function(){
			if($scope.newTalent){
				var newTalent = $scope.availableTalents[$scope.newTalent];
				var matchingAptitudes = 0;
				var xpCost;
				for (var a = 0; a < newTalent.aptitudes; a++) {
					if (character.character.aptitudes.all().indexOf($scope.displayedOption.aptitudes[a]) !== -1) {
						matchingAptitudes++;
					}
				}
				characteroptions.xpCosts().then(function(result) {
					xpCost = new Number(result.talents.advances[newTalent.tier - 1]['cost by aptitudes'][matchingAptitudes]);
					character.character.experience.addAdvancement(xpCost, "talents", newTalent);
					$scope.newTalent = null;
				});
			}
		}

		$scope.removeTalent = function(index){
			$scope.talents.splice(index, 1);
		}

		$scope.criticalInjuries = character.character.wounds.criticalInjuries;
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

		$scope.mentalDisorders = character.character.insanity.disorders;
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

		$scope.malignancies = character.character.corruption.malignancies;
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

		$scope.mutations = character.character.corruption.mutations;
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

		$scope.armor = {
			head:{rating:0, providers:[]},
			body:{rating:0, providers:[]},
			leftArm:{rating:0, providers:[]},
			rightArm:{rating:0, providers:[]},
			leftLeg:{rating:0, providers:[]},
			rightLeg:{rating:0, providers:[]}
		};
		$.each(character.character.equipment.armor.map(function(element){return element.item}), function(index, armor){
			$.each(armor.locations, function(index, location){
				switch(location){
					case "Left Arm":
						$scope.armor.leftArm.rating += armor.ap
						$scope.armor.leftArm.providers.push(armor);
						break;
					case "Right Arm":
						$scope.armor.rightArm.rating += armor.ap
						$scope.armor.rightArm.providers.push(armor);
						break;
					case "Head":
						$scope.armor.head.rating += armor.ap
						$scope.armor.head.providers.push(armor);
						break;
					case "Body":
						$scope.armor.body.rating += armor.ap
						$scope.armor.body.providers.push(armor);
						break;
					case "Left Leg":
						$scope.armor.leftLeg.rating += armor.ap
						$scope.armor.leftLeg.providers.push(armor);
						break;
					case "Right Leg":
						$scope.armor.rightLeg.rating += armor.ap
						$scope.armor.rightLeg.providers.push(armor);
						break;
				}
			});
		});

		$scope.armorTooltip = function(location){
			armorTooltipService.location(location);
			armorTooltipService.modifiers($scope.armor[location].providers);
		}
	}
});