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
				$.each(_properties, function(index, property){
					testValue = testValue[property];
				});
				switch(value.comparison){
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
        								item = weapons.filter(function(weapon) {
        									return element.item.name === weapon.name;
        								})[0];
        								break;
        							case "armor":
        								item = armor.filter(function(weapon) {
        									return element.item.name === weapon.name;
        								})[0];
        								break;
        							case "item":
        								item = items.filter(function(weapon) {
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
				return weapons.$promise.then(function(result){
					return result.slice();
				});
			},
			armor: function() {
				return armor.$promise.then(function(result){
					return result.slice();
				});
			},
			items: function() {
				return items.$promise.then(function(result){
					return result.slice();
				});
			},
			regiments : function(){
				return regiments.$promise.then(function(result){
					return result.slice();
				});
			}
		}
	};
});