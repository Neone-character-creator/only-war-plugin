define(function() {
	return function($scope, characterService, regiments, specialties, characteroptions, characteristicTooltipService, armorTooltipService, $uibModal) {
		$scope.character = characterService.character;
		characteroptions.characteristics().then(function(result){
			$scope.characteristics = result.map(function(element){return element.name});
		});

		$scope.characteristicTooltip = function(characteristic){
			characteristicTooltipService.displayed = characteristic;
		}

		function updateAvailableSkills(){
			characteroptions.skills().then(function(result){
				$scope.availableSkills = result.filter(function(element){
					for(var skill in characterService.character.skills){
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
					return character && characterService.character && characterService.character.talents &&characterService.character.talents.indexOf(element) === -1;
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
					if (characterService.character.aptitudes.all().indexOf($scope.displayedOption.aptitudes[a]) !== -1) {
						matchingAptitudes++;
					}
				}
				characteroptions.xpCosts().then(function(result) {
					$scope.newSkillXpCost = parseInt(result.skills.advances[0]['cost by aptitudes'][matchingAptitudes]);
				});
			} else {
				$scope.newSkillXpCost = undefined;
			}
		});
		$scope.$watch('newTalent', function(newVal){
			if(newVal){
				var newTalent = angular.copy($scope.availableTalents[$scope.newTalent]);
				var matchingAptitudes = 0;
				for (var a = 0; a < newTalent.aptitudes; a++) {
					if (characterService.character.aptitudes.all().indexOf(newTalent.aptitudes[a]) !== -1) {
						matchingAptitudes++;
					}
				}

				characteroptions.xpCosts().then(function(result) {
					$scope.newTalentXpCost = new Number(result.talents.advances[newTalent.tier-1]['cost by aptitudes'][matchingAptitudes]);
				});
			} else {
				$scope.newTalentXpCost = undefined;
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
				characterService.character.experience.addAdvancement($scope.newSkillXpCost, "skills", newSkill);
				$scope.newSkill = null;
				updateAvailableSkills();
			}
		};

		$scope.setSkillLevel = function(skillName, newRating){
			if(skillName && newRating){
				//If the new rating is an increase, determine how many new levels are needed.
				if((newRating - characterService.character.skills[skillName].advancements) > 0){
					var matchingAptitudes = 0;
					characteroptions.skills().then(function(result){
						var originalSkillName = skillName;
						for(var i = characterService.character.skills[skillName].advancements+1; i <= newRating; i++){
							$.each(result, function(index, element){
								if(skillName.indexOf("(") !== -1){
									skillName = skillName.substring(0, skillName.indexOf("(")).trim();
								}
								if(element.name === skillName){
									var newRating = i;
									for (var a = 0; a < element.aptitudes; a++) {
										if (characterService.character.aptitudes.all().indexOf($scope.displayedOption.aptitudes[a]) !== -1) {
											matchingAptitudes++;
										};
									};
									characteroptions.xpCosts().then(function(result) {
										var xpCost = new Number(result.skills.advances[newRating - 1]['cost by aptitudes'][matchingAptitudes]);
										if($scope.newSkillSpecialization){
											skillName += " (" + $scope.newSkillSpecialization + ")";
										};
										var newSkill = {
											name : originalSkillName,
											rating : newRating
										};
										characterService.character.experience.addAdvancement(xpCost, "skills", newSkill);
									});
									return false;
								};
							});
						}
				});
			} else if((newRating - characterService.character.skills[skillName].advancements) < 0){
				for(var i = characterService.character.skills[skillName].advancements; i >= newRating; i--){
					//Look for any advancements that increased the skill between the current rating and the new one
					var indexesToRemove =[];
					$.each(characterService.character.experience.advancements, function(index, element){
						if(element.property === "skills" && element.value.rating > newRating){
							indexesToRemove.push(index);
						}
					});
					//Sort and reverse the array. Removing elements backwards means that each change to the array  won't affect the index of the next item to remove.
					indexesToRemove = indexesToRemove.sort(function(a, b){
						return b-a;
					})
					$.each(indexesToRemove, function(loopIndex, indexToRemove){
						characterService.character.experience.removeAdvancement(indexToRemove);
					})
				}
			}
		}
	}
		$scope.removeSkill = function(skillName){
			var indexesToRemove = [];
			$.each(characterService.character.experience._advancementsBought, function(index, element){
				if(element.property === "skills" && element.value.name == skillName){
					indexesToRemove.push(index);
				}
			});
			indexesToRemove = indexesToRemove.sort(function(a, b){
				return b-a;
			});
			$.each(indexesToRemove, function(index, indexToRemove){
				characterService.character.experience.removeAdvancement(indexToRemove);
			});
			updateAvailableSkills();
		}

		$scope.newTalent;

		$scope.addTalent = function(){
			if($scope.newTalent){
				var newTalent = $scope.availableTalents[$scope.newTalent];
				var matchingAptitudes = 0;
				var xpCost;
				for (var a = 0; a < newTalent.aptitudes; a++) {
					if (characterService.character.aptitudes.all().indexOf($scope.displayedOption.aptitudes[a]) !== -1) {
						matchingAptitudes++;
					}
				}
				newTalent.boughtAsAdvancement = true;
				characteroptions.xpCosts().then(function(result) {
					xpCost = new Number(result.talents.advances[newTalent.tier - 1]['cost by aptitudes'][matchingAptitudes]);
					characterService.character.experience.addAdvancement(xpCost, "talents", newTalent);
					$scope.newTalent = null;
				});
			}
		}

		$scope.removeTalent = function(index){
			var talent = $scope.availableTalents[index];
			characterService.character.experience.removeAdvancement(characterService.character.experience._advancementsBought)
		}

		$scope.criticalInjuries = characterService.character.wounds ? characterService.character.wounds.criticalInjuries : [];
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

		$scope.mentalDisorders = characterService.character.insanity ? characterService.character.insanity.disorders : [];
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

		if(!characterService.character.corruption){
			characterService.character.corruption = {};
		}
		if(!characterService.character.corruption.malignancies){
			characterService.character.corruption.malignancies = [];
		}
		$scope.malignancies = characterService.character.corruption.malignancies;
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

		$scope.mutations = characterService.character.corruption.mutations;
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
		$.each(characterService.character.equipment.armor.map(function(element){return element.item}), function(index, armor){
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
			armorTooltipService.location =location;
			armorTooltipService.modifiers($scope.armor[location].providers);
		}

		$scope.$watch('character.psychicPowers.psyRating', function(newVal, oldVal){
			if(newVal > oldVal){
				for(var i = oldVal+1; i <= newVal; i++){
					characterService.character.experience.addAdvancement(i*200, "psy rating", i);
				}
			} else if(newVal < oldVal){
				var indexesToRemove = [];
				$.each(characterService.character.experience._advancementsBought, function(index, element){
					if(element.property === "psy rating" && element.value > newVal){
						indexesToRemove.push(index);
					};
				});
				indexesToRemove = indexesToRemove.sort(function(a,b){return b-a;})
				$.each(indexesToRemove, function(index, element){
					characterService.character.experience.removeAdvancement(element);
				});
			}
		});

		updateAvailableWeapons = function(){
			characteroptions.weapons().then(function(result){
				$scope.availableWeapons = result.filter(function(element){
					var weapons = characterService.character.equipment.weapons.map(function(weapon){
						return weapon.item;
					});
					return weapons.indexOf(element) === -1;
				});
			});
		};
		updateAvailableWeapons();

		$scope.addNewWeapon = function(){
			characterService.character.equipment.weapons.push({item : $scope.availableWeapons[$scope.newWeapon],count : 1});
			updateAvailableweapons;
		};
		$scope.removeWeapon = function(index){
			characterService.character.equipment.weapons.splice(index);
			$scope.newWeapon = null;
			updateAvailableWeapons();
		}
	};
});