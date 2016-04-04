define(function(){
	return function($resource){
		var characteristics = $resource("Character/characteristics.json").query();
		var talents = $resource("Character/Talents.json").query();
		var skills = $resource("Character/Skills.json").query();
		var powers = $resource("Character/Psychic Powers.json").query();
		var fatePointRolls = $resource("Character/fatepoints.json").get();
		var xpCosts = $resource("Character/advancementcosts.json").get();

		return {
			talents: function(){
				return talents.$promise.then(function(result){
					return result.slice();
				});
			},
			skills : function(){
				return skills.$promise.then(function(result){
					return result.slice();
				});
			},
			powers : function(){
				throw "Not implemented.";
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