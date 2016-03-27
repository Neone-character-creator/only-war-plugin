app.controller("SheetController", function($scope, character, regiments, specialties, characteristics) {
    $scope.character = character.character;
    $scope.selectedRegiment = regiments.selected;
    $scope.selectedSpecialty = specialties.selected;
    var characteristics = characteristics.query();
    $scope.characteristics = characteristics;
});