define(function(){
	return function($scope, character, regiments, specialties, characteristics) {
    $scope.character = character.character;
    $scope.selectedRegiment = regiments.selected;
    $scope.selectedSpecialty = specialties.selected;
    var characteristics = characteristics.characteristics();
    $scope.characteristics = characteristics;
    }
});