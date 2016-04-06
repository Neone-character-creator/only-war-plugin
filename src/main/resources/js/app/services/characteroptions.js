define(function(){
	function Prerequisite(property, name, value){
			var _property = property;
			var _name = name;
			var _value = value;
			var prerequisite = {
				property : property,
				name : name,
				value : value,
				check : function(character){
					var testValue;
					switch(_property){
						case "characteristic":
							switch(value.comparison){
								case "at least" :
									return character.characteristics().byName(_name.toLowerCase()) >= value.value;
							};
						break;
						case "power":
							return character.powers().all().filter(function(element){
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
	function transform(element){
		if(element.prerequisites){
			element.prerequisites = element.prerequisites.map(function(element){
				return new Prerequisite(element.property, element.name, element.value);
			});
		};
		return element;
	};
	return function($resource, $q){
		var characteristics = $resource("Character/characteristics.json").query();
		var talents = $resource("Character/Talents.json").query().$promise.then(function(result){
			return $q.resolve(result.map(transform));
		});
		var skills = $resource("Character/Skills.json").query();
		var powers = $resource("Character/Psychic Powers.json").query().$promise.then(function(result){
			return $q.resolve(result.map(transform));
		});
		var fatePointRolls = $resource("Character/fatepoints.json").get();
		var xpCosts = $resource("Character/advancementcosts.json").get();

		return {
			talents: function(){
			if (talents.$promise.resolved)
				return talents.then(function(result){
					return result.slice();
				});
			},
			skills : function(){
				return skills.$promise.then(function(result){
					return result.slice();
				});
			},
			powers : function(){
				return powers.then(function(result){
					return result.slice();
				});
			},
			characteristics : function(){
				return characteristics.$promise.then(function(result){
					return result.slice();
				});
			},
			fatePointRolls : function(){
				return fatePointRolls.$promise.then(function(result){
					return {
						forRoll: function(roll){
							return result[roll];
						}
					}
					return result.slice();
				});
			},
			xpCosts : function(){
				return xpCosts.$promise.then(function(result){
					return result;
				})
			}
		};
	};
});