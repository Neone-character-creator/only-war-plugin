define(function() {
	function Prerequisite(property, name, value) {
		var _property = property;
		var _name = name;
		var _value = value;
		var prerequisite = {
			property: property,
			name: name,
			value: value,
			check: function(character) {
				var testValue;
				switch (_property) {
					case "characteristic":
						switch (value.comparison) {
							case "at least":
								return character.characteristics().byName(_name.toLowerCase()) >= value.value;
						};
						break;
					case "power":
						return character.powers().all().filter(function(element) {
							return element.name === _value;
						}).length > 0;
						break;
					case "skill":
						return character.skills().byName(_name);
						break;
					case "talent":
						return character.talents().byName(_name);
						break;
				};
			}
		};
		Object.freeze(prerequisite);
		return prerequisite;
	};

	function createPrerequisites(element) {
		if (element.prerequisites) {
			element.prerequisites = element.prerequisites.map(function(element) {
				return new Prerequisite(element.property, element.name, element.value);
			});
		};
		return element;
	};

	return function($resource, $q) {
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
			function convertEquipment(items, type) {
        					return items.map(function(element) {
        						var item;
        						switch (type) {
        							case "weapon":
        								item = characteroptions.weapons().filter(function(weapon) {
        									return element.item.name === weapon.name;
        								})[0];
        								break;
        							case "armor":
        								item = characteroptions.armor().filter(function(weapon) {
        									return element.item.name === weapon.name;
        								})[0];
        								break;
        							case "item":
        								item = characteroptions.items().filter(function(weapon) {
        									return element.item.name === weapon.name;
        								})[0];
        								break;
        						}
        						if (!item) {
        							console.log("Tried to load item " + element.item.name + " but it wasn't found!");
        							item = element;
        						}
        						item.craftsmanship = element.item.craftsmanship ? element.item.craftsmanship : "Common";
        						item.upgrades = element.item.upgrades ? element.item.upgraded : [];
        						return item;
        					});
        				};
        	for (var i = 0; i < result.length; i++) {
        					var equipment = result[i]['fixed modifiers']['character kit'];
        					if (equipment) {
        						for (var category in equipment) {
        							var type;
        							switch (category) {
        								case "main weapon":
        								case "other weapons":
        									type = "weapon";
        									break;
        								case "other gear":
        									type = "item";
        									break;
        								case "armor":
        									type = "armor";
        							}
        							result[i]['fixed modifiers']['character kit'][category] = convertEquipment(equipment[category], type);
        						}
        					};
        					$.each(result[i]['optional modifiers'], function(index, selection) {
        						$.each(selection.options, function(index, option) {
        							if (Array.isArray(option.property) && option.property[0] === "character kit") {
        								var type;
        								switch (element.options[o].property[1]) {
        									case "main weapon":
        									case "other weapons":
        										type = "weapon";
        										break;
        									case "other gear":
        										type = "item";
        										break;
        									case "armor":
        										type = "armor";
        								}
        								option.value = con;
        							}
        						})
        					});
        				};
        	return result;
        });
        var regiments = $resource("Regiment/regiments.json").query();

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
				return weapons.slice();
			},
			armor: function() {
				return armor.slice();
			},
			items: function() {
				return items.slice();
			},
			regiments : function(){
				return regiments.slice();
			}
		}
	};
});