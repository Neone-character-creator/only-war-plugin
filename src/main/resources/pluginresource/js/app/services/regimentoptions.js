define(function() {
	return function($resource, $q, characteroptions) {
		var homeworlds = $resource("pluginresource/Regiment/Creation/Homeworlds.json").query().$promise.then(function(result) {
			return $q.all(result.map(transformPlaceholders));
		});
		var officers = $resource("pluginresource/Regiment/Creation/Commanding Officers.json").query().$promise.then(function(result) {
			return $q.all(result.map(transformPlaceholders));
		});
		var regimentTypes = $resource("pluginresource/Regiment/Creation/Regiment Type.json").query().$promise.then(function(result) {
			return $q.all(result.map(transformPlaceholders));
		});
		var equipmentDoctrines = $resource("pluginresource/Regiment/Creation/Special Equipment.json").query().$promise.then(function(result) {
			return $q.all(result.map(transformPlaceholders));
		});
		var trainingDoctrines = $resource("pluginresource/Regiment/Creation/Training Doctrines.json").query().$promise.then(function(result) {
			return $q.all(result.map(transformPlaceholders));
		});
		var standardRegimentKit = $resource("pluginresource/Regiment/Creation/Standard Regimental Kit.json").get().$promise.then(function(result) {
			return transformPlaceholders(result);
		});
		var additionalKitChoices = $resource("pluginresource/Regiment/Creation/Additional Kit Choices.json").query();

		/** Goes through the given regiment or specialty modifier and replaces all of the placeholder skill, talent and
		    	equipment names with their actual object versions.
		    	*/
		function transformPlaceholders(modifier) {
			var fixedModifiers = modifier['fixed modifiers'];
			var optionalModifiers = modifier['optional modifiers'];
			var modifierSkills = $q.defer();
			if (fixedModifiers) {
				//Fixed Modifiers
				characteroptions.skills().then(function(result) {
					var replacementSkills = {};
					for (skill in fixedModifiers.skills) {
						var specialization = skill.indexOf("(") < 0 ? null : skill.substring(skill.indexOf("(") + 1, skill.indexOf(")"));
						var baseName = skill.substring(0, skill.indexOf("(") < 0 ? skill.length : skill.indexOf("(")).trim();
						replacementSkills[skill] = angular.copy(result.filter(function(element) {
							return element.name === baseName;
						})[0]);
						replacementSkills[skill].specialization = specialization;
						replacementSkills[skill].advancements = fixedModifiers.skills[skill];
					};
					modifierSkills.resolve(replacementSkills);
				});
				var modifierTalents = $q.defer();
				characteroptions.talents().then(function(result) {
					var replacementTalents = fixedModifiers.talents;
					if (replacementTalents) {
						replacementTalents = replacementTalents.slice();
						replacementTalents = replacementTalents.map(function(element) {
							var name = element;
							var specialization = element.indexOf("(") < 0 ? null : element.substring(element.indexOf("(") + 1, element.indexOf(")"));
							element = element.substring(0, specialization ? element.indexOf("(") : element.length).trim();
							element = angular.copy(result.filter(function(talent) {
								return element === talent.name;
							})[0]);
							if (!element) {
								console.log("Tried to get a talent name " + name + " but couldn't find it.");
							}
							if (specialization) {
								element.name += " (" + specialization + ")";
							}
							return element;
						});
					}
					modifierTalents.resolve(replacementTalents);
				});

				var modifierTraits = $q.defer();
				characteroptions.traits().then(function(result) {
					var replacementTraits = fixedModifiers.traits;
					if (replacementTraits) {
						replacementTraits = replacementTraits.slice();
						replacementTraits = replacementTraits.map(function(element) {
							var name = element;
							var rating = element.indexOf("(") < 0 ? null : element.substring(element.indexOf("(") + 1, element.indexOf(")"));
							element = element.substring(0, rating ? element.indexOf("(") : element.length).trim();
							element = angular.copy(result.filter(function(talent) {
								return element === talent.name;
							})[0]);
							if (!element.name) {
								console.log("Tried to get a trait name " + name + " but couldn't find it.")
							}
							if (rating) {
								element.name += " (" + rating + ")";
								element.rating = rating;
							}
							return element;
						});
					}
					modifierTraits.resolve(replacementTraits);
				});

				var modifierEquipment = $q.defer();

				function replace(placeholder, source) {
					var result = source.find(function(element) {
						return element.name === placeholder.name;
					});
					if(!result){
						result = {"name": placeholder.name}
					} else {
						result = angular.copy(result);
					}
					if(placeholder.craftsmanship){
						result.craftsmanship = placeholder.craftsmanship;
					} else {
						result.craftsmanship = "Common";
					}
					if(placeholder.upgrades){
						result.upgrades = placeholder.upgrades;
					}
					return result;
				};
				 $q.all({"weapons" : characteroptions.weapons(), "armor" : characteroptions.armor(), "items" : characteroptions.items(), "vehicles" : characteroptions.vehicles()}).then(function(results) {
					var characterKit = fixedModifiers['character kit'];
					var replacementMainWeapons;
					var replacementOtherWeapons;
					var replacementArmor;
					var replacementOtherItems;
					var replacementSquadKit;
					if (characterKit) {
						if (characterKit['main weapon']) {
							replacementMainWeapons = characterKit['main weapon'].slice().map(function(weapon) {
								weapon.item = replace(weapon.item, results.weapons);
								if(!weapon.item.craftsmanship){
									weapon.item.craftsmanship = "Common";
								}
								return weapon;
							});
						}
						if (characterKit['other weapons']) {
							replacementOtherWeapons = characterKit['other weapons'].slice().map(function(weapon) {
								weapon.item = replace(weapon.item, results.weapons);
								return weapon;
							});
						}
						if (characterKit['armor']) {
							replacementArmor = characterKit['armor'].slice();
							replacementArmor = replacementArmor.map(function(armor) {
								armor.item = replace(armor.item, results.armor);
								return armor;
							});
						}
						if (characterKit['other gear']) {
							replacementOtherItems = characterKit['other gear'].slice();
							replacementOtherItems = replacementOtherItems.map(function(item) {
								item.item = replace(item.item, results.items.concat(results.vehicles));
								return item;
							});
						};
						if (characterKit['squad kit']) {
							replacementSquadKit = characterKit['squad kit'].slice();
							replacementSquadKit = replacementSquadKit.map(function(item) {
								item.item = replace(item.item, results.weapons.concat(results.armor).concat(results.items).concat(results.vehicles));
								return item;
							});
						};
						modifierEquipment.resolve({
							'main weapon': replacementMainWeapons,
							'other weapons': replacementOtherWeapons,
							'armor': replacementArmor,
							'other gear': replacementOtherItems,
							'squad kit': replacementSquadKit
						});
					} else {
						modifierEquipment.resolve(undefined);
					}
				});
			}
			//Optional Modifiers
			$q.all([characteroptions.talents(),
					characteroptions.skills(),
					characteroptions.weapons(),
					characteroptions.armor(),
					characteroptions.items()
				])
				.then(function(result) {
					$.each(optionalModifiers, function(index, element) {
						$.each(element.options, function(index, elementOption) {
							$.each(elementOption, function(index, option) {
								switch (option.property) {
									case "talents":
									case "traits":
										var name = option.value;
										var specialization = option.value.indexOf("(") < 0 ? null : option.value.substring(option.value.indexOf("(") + 1, option.value.indexOf(")"));
										option.value = option.value.substring(0, specialization ? option.value.indexOf("(") : option.value.length).trim();
										option.value = angular.copy(result[0].filter(function(talent) {
											return option.value === talent.name;
										})[0]);
										if (!option.value) {
											console.log("Tried to get a talent name " + name + " but couldn't find it.")
										}
										if (specialization) {

											option.value.name += " (" + specialization + ")";
										}
										if (!option.value) {
											console.log("Tried to replace talent " + name + " in " + modifier.name + " but no talent by that name was found.")
										}
										break;
									case "skills":
										break;
								};
							});
						});
					});
				});

			return $q.all([modifierSkills, modifierTalents, modifierEquipment]).then(function(results) {
				if (results[0]) {
					results[0].promise.then(function(result) {
						if (result) {
							fixedModifiers['skills'] = result;
						}
					});
				}
				if (results[1]) {
					results[1].promise.then(function(result) {
						if (result) {
							fixedModifiers['talents'] = result;
						}
					});
				}
				if (results[2]) {
					results[2].promise.then(function(result) {
						if (result) {
							fixedModifiers['character kit'] = result;
						}
					});
				}
				return modifier;
			});
		};

		return {
			homeworlds: function() {
				return homeworlds.then(function(result) {
					return result.slice();
				});
			},
			officers: function() {
				return officers.then(function(result) {
					return result.slice();
				});
			},
			types: function() {
				return regimentTypes.then(function(result) {
					return result.slice();
				});
			},
			equipmentDoctrines: function() {
				return equipmentDoctrines.then(function(result) {
					return result.slice();
				});
			},
			trainingDoctrines: function() {
				return trainingDoctrines.then(function(result) {
					return result.slice();
				});
			},
			standardRegimentKit: function() {
				return standardRegimentKit.then(function(result) {
					return angular.copy(result);
				});
			},
			additionalKitChoices: function(){
				return additionalKitChoices.$promise.then(function(result){
					return angular.copy(result);
				})
			}
		}
	};
});