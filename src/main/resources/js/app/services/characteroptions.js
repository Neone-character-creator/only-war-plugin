/**
Represents a requirement that a character must meet. Property is an array of property names that represents the
properties of the character that will be traversed.

Value represents the comparison to make to determine if the tested character meets the prerequisite.
*/
function Prerequisite(properties, value) {
	var _properties = properties;
	var _value = value;
	var prerequisite = {
		properties: _properties,
		value: value,
		check: function(character) {
			var testValue = character;
			$.each(_properties, function(index, property) {
				testValue = testValue[property];
			});
			switch (value.comparison) {
				case "at least":
					return testValue >= _value;
					break;
				default:
					return testValue === _value;
			}
		}
	};
	Object.freeze(prerequisite);
	return prerequisite;
};

define(function() {
	function createPrerequisites(element) {
		if (element.prerequisites) {
			element.prerequisites = element.prerequisites.map(function(element) {
				return new Prerequisite(element.property, element.name, element.value);
			});
		};
		return element;
	};

	return function($resource, $q) {
		/** Goes through the given regiment or specialty modifier and replaces all of the placeholder skill, talent and
    	equipment names with their actual object versions.
    	*/
		function transformPlaceholders(modifier) {
			var fixedModifiers = modifier['fixed modifiers'];
			var optionalModifiers = modifier['optional modifiers'];
			var modifierSkills = $q.defer();
			//Fixed Modifiers
			skills.$promise.then(function(result) {
				var replacementSkills = {};
				for (skill in fixedModifiers.skills) {
					var specialization = skill.indexOf("(") < 0 ? null : skill.substring(skill.indexOf("(") + 1, skill.indexOf(")"));
					var baseName = skill.substring(0, skill.indexOf("(") < 0 ? skill.length : skill.indexOf("(")).trim();
					replacementSkills[skill] = result.filter(function(element) {
						return element.name === baseName;
					})[0];
					if (specialization) {
						replacementSkills[skill].specialization = specialization;
					}
				};
				modifierSkills.resolve(replacementSkills);
			});
			var modifierTalents = $q.defer();
			talents.then(function(result) {
				var replacementTalents = fixedModifiers.talents;
				if (replacementTalents) {
					replacementTalents = replacementTalents.slice();
					replacementTalents = replacementTalents.map(function(element) {
						var specialization = element.indexOf("(") < 0 ? null : element.substring(element.indexOf("(") + 1, element.indexOf(")"));
						element = element.substring(0, specialization ? element.indexOf("(") : element.length).trim();
						element = Object.clone(result.filter(function(talent) {
							return element === talent.name;
						})[0]);
						if (specialization) {
							element.name += " (" + specialization + ")";
						}
						return element;
					});
				}
				modifierTalents.resolve(replacementTalents);
			});
			var modifierEquipment = $q.defer();
			function replace(name, source) {
				return source.filter(function(element) {
					return element.name === name;
				})[0];
			};
			$q.all([weapons, armor, items, vehicles]).then(function(results) {
				var characterKit = fixedModifiers['character kit'];
				var replacementMainWeapons;
				var replacementOtherWeapons;
				var replacementArmor;
				var replacementOtherItems;
				if (characterKit) {
					if (characterKit['main weapon']) {
						replacementMainWeapons = characterKit['main weapon'].slice().map(function(weapon) {
							weapon.item = replace(weapon.item.name, results[0]);
							return weapon;
						});
					}
					if (characterKit['other weapon']) {
						replacementOtherWeapons = characterKit['other weapons'].slice().map(function(weapon) {
							weapon.item = replace(weapon.item.name, results[0]);
							return weapon;
						});
					}
					if (characterKit['armor']) {
						 replacementArmor = characterKit['armor'].slice();
						replacementArmor = replacementArmor.map(function(armor) {
							armor.item = replace(armor.item.name, results[1]);
							return armor;
						});
					}
					if (characterKit['other gear']) {
						replacementOtherItems = characterKit['other gear'].slice();
						replacementOtherItems = replacementOtherItems.map(function(item) {
							item.item = replace(item.item.name, results[2].concat(results[3]));
							return item;
						});
					}
					modifierEquipment.resolve({
						'main weapon': replacementMainWeapons,
						'other weapons': replacementOtherWeapons,
						'armor': replacementArmor,
						'other gear': replacementOtherItems
					});
				} else {
					modifierEquipment.resolve(undefined);
				}
			});
			//Optional Modifiers
			$q.all([talents,skills,weapons,armor,items]).then(function(result){
				$.each(optionalModifiers, function(index, element){
					$.each(element.options, function(index, elementOption){
						$.each(elementOption, function(index, option){
						switch(option.property){
							case "talents":
							var specialization = option.value.indexOf("(") < 0 ? null : option.value.substring(option.value.indexOf("(") + 1, option.value.indexOf(")"));
							option.value= option.value.substring(0, specialization ? option.value.indexOf("(") : option.value.length).trim();
                            option.value= Object.clone(result[0].filter(function(talent) {
                            	return option.value === talent.name;
                            	})[0]);
                            	if (specialization) {
                            		option.value.name += " (" + specialization + ")";
                            	}
							if(!option.value){
								throw "Tried to replace talent " + name + " in " + modifier.name + " but no talent by that name was found."
							}
							break;
							case "skills":
							break;
						};});
					});
				});
			});

			return $q.all([modifierSkills, modifierTalents, modifierEquipment]).then(function(results) {
				results[0].promise.then(function(result) {
					if(result){
						fixedModifiers['skills'] = result;
					}
				});
				results[1].promise.then(function(result) {
					if(result){
						fixedModifiers['talents'] = result;
					}
				});
				results[2].promise.then(function(result) {
					if(result){
						fixedModifiers['character kit'] = result;
					}
				});
				return modifier;
			});
		};
		var characteristics = $resource("Character/characteristics.json").query();
		var talents = $resource("Character/Talents.json").query().$promise.then(function(result) {
			return $q.resolve(result.map(createPrerequisites));
		});
		var skills = $resource("Character/Skills.json").query();
		var powers = $resource("Character/Psychic Powers.json").query().$promise.then(function(result) {
			return $q.resolve(result.map(createPrerequisites));
		});
		var fatePointRolls = $resource("Character/fatepoints.json").get();
		var xpCosts = $resource("Character/advancementcosts.json").get();
		var weapons = $resource("Character/Weapons.json").query();
		var armor = $resource("Character/Armor.json").query();
		var items = $resource("Character/Items.json").query();
		var specialties = $resource("Character/Specialties.json").query().$promise.then(function(result) {
			return $q.all(result.map(transformPlaceholders));
		});
		var regiments = $resource("Regiment/regiments.json").query().$promise.then(function(result) {
			return $q.all(result.map(transformPlaceholders));
		});
		var vehicles = $resource("Character/Vehicles.json").query();

		return {
			talents: function() {
				return talents.then(function(result) {
					return result.slice();
				});
			},
			skills: function() {
				return skills.$promise.then(function(result) {
					return result.slice();
				});
			},
			powers: function() {
				return powers.then(function(result) {
					return result.slice();
				});
			},
			characteristics: function() {
				return characteristics.$promise.then(function(result) {
					return result.slice();
				});
			},
			fatePointRolls: function() {
				return fatePointRolls.$promise.then(function(result) {
					return {
						forRoll: function(roll) {
							return result[roll];
						}
					}
					return result.slice();
				});
			},
			xpCosts: function() {
				return xpCosts.$promise.then(function(result) {
					return result;
				})
			},
			weapons: function() {
				return weapons.$promise.then(function(result) {
					return result.slice();
				});
			},
			armor: function() {
				return armor.$promise.then(function(result) {
					return result.slice();
				});
			},
			items: function() {
				return items.$promise.then(function(result) {
					return result.slice();
				});
			},
			regiments: function() {
				return regiments.then(function(result) {
					return result.slice();
				});
			},
			specialties: function() {
				return specialties.then(function(result) {
					return result.slice();
				});
			}
		}
	};
});