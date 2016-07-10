define(["../types/Prerequisite"], function (Prerequisite) {
	function createPrerequisites(element) {
		if (element.prerequisites) {
			element.prerequisites = element.prerequisites.map(function(element) {
				return new Prerequisite.Prerequisites(element.property, element.name, element.value);
			});
		};
		return element;
	};

	return function($resource, $q) {
		var characteristics = $resource("pluginresource/Character/characteristics.json").query().$promise;
		var talents = $resource("pluginresource/Character/Talents.json").query().$promise.then(function(result) {
			return $q.resolve(result.map(createPrerequisites));
		});
		var skills = $resource("pluginresource/Character/Skills.json").query().$promise;
		var powers = $resource("pluginresource/Character/Powers.json").query().$promise.then(function(result) {
			return $q.resolve(result.map(createPrerequisites));
		});
		var fatePointRolls = $resource("pluginresource/Character/fatepoints.json").get().$promise;
		var xpCosts = $resource("pluginresource/Character/advancementcosts.json").get().$promise;
		var weapons = $resource("pluginresource/Character/Weapons.json").query().$promise;
		var armor = $resource("pluginresource/Character/Armor.json").query().$promise;
		var items = $resource("pluginresource/Character/Items.json").query().$promise;

		var vehicles = $resource("pluginresource/Character/Vehicles.json").query().$promise;
		var traits = $resource("pluginresource/Character/Traits.json").query().$promise;
		return $q.all({
			characteristics: characteristics,
			talents: talents,
			skills: skills,
			powers: powers,
			fatePointsRolls: fatePointRolls,
			xpCosts: xpCosts,
			weapons: weapons,
			armor: armor,
			items: items,
			vehicles: vehicles,
			traits: traits
		}).then(function (results) {
			return {
				get talents() {
					return results.talents;
				},
				get skills() {
					return results.skills;
				},
				get powers() {
					return results.powers;
				},
				get characteristics() {
					return results.characteristics;
				},
				get fatePointRolls() {
					return {
						forRoll: function (roll) {
							results.fatePointRolls[roll];
						}
					}
				},
				get xpCosts() {
					return results.xpCosts;
				},
				get weapons() {
					return results.weapons;
				},
				get armor() {
					return results.armor;
				},
				get items() {
					return results.items;
				},
				get traits() {
					return results.traits;
				},
				get vehicles() {
					return results.vehicles;
				}
			}
		});
	};
});