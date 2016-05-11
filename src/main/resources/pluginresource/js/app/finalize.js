angular.module("OnlyWar").controller("FinalizeController", function($scope, character){
});

angular.module("OnlyWar").controller("WoundsController", function($scope, character, dice){
	$scope.regimentWounds = character.regiment ? character.regiment.wounds : 0;
	$scope.specialtyWounds= character.specialty ? character.specialty.wounds : 0;
	$scope.woundsRoll = dice.roll(1, 1, 5);
});

angular.module("OnlyWar").controller("FatePointsController", function($scope, character, fatePointRollResults, dice){
	fatePointRollResults.then(function(result){
		var roll = dice.roll(1, 1, 5);
			character.character.fatePoints.total =  result[roll];
			$scope.fpRoll = roll;
			$scope.fp = character.character.fatePoints.total;
	})
});

angular.module("OnlyWar").controller("ExperienceController", function($scope, character, fatePointRollResults, dice, skills, characteristics, aptitudes){
	$scope.availablexp = character.character.experience.available;
	characteristics.then(function(result){
		$scope.characteristicNames = result.map(function(c){return c.name});
	});
	skills.then(function(result){

	})

	aptitudes.then(function(result){
		$scope.aptitudes =result;
	});
});

angular.module("OnlyWar").factory("skills", function($resource, $q){
	var skills = $resource("Character/Skills.json").query();
	var skillRatings = $resource("Character/skillratings.json").query();

	var service = {
		skills : function(){
			return angular.copy(skills);
		},
		skillRatings : function(){
			return angular.copy(skillRatings);
		}
	}

	return $q.all(skills, skillRatings).then(function(){return service;});
})

angular.module("OnlyWar").factory("aptitudes", function($resource, $q){
	var aptitudes = $resource("Character/aptitudes.json").query();

	var service = {
		aptitudes : aptitudes
	}

	return aptitudes.$promise;
})