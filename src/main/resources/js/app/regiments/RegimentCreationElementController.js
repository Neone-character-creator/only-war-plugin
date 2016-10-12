define(["require", "exports", "angular", "../types/regiment/creation/RegimentCreationModifier"], function (require, exports, angular, RegimentCreationModifier_1) {
    "use strict";
    function RegimentCreationElementController($scope, selection, $uibModal, optionselection) {
        $scope.openSelectionModal = function (selectedObject, modifier) {
            selection.selectionObject = selectedObject;
            $uibModal.open({
                controller: "SelectionModalController",
                templateUrl: '//templates/selection-modal.html'
            }).result.then(function () {
                optionselection.target = modifier;
                optionselection.selected = selection.selected;
                optionselection.selectionObject = selectedObject;
                optionselection.associatedService = {
                    _selected: null,
                    selected: function () {
                        return modifier;
                    },
                    remainingSelections: function () {
                        return modifier['optional modifiers'];
                    },
                    complete: function () {
                        return modifier && modifier['optional modifiers'].length === 0;
                    },
                    select: function (modifier) {
                        this._selected = angular.copy(modifier);
                    }
                };
                optionselection.applySelection();
            });
        };
        //Filters creation options so that items with too high a cost are hidden
        $scope.costFilter = function (item) {
            return item.cost <= $scope.$parent.$parent.regimentElements.remainingRegimentPoints;
        };
        $scope.$watch(() => {
            return $scope.element ? $scope.element.selected : null;
        }, () => {
            if ($scope.element && $scope.element.selected) {
                $scope.elementCharacteristics = Array.from($scope.element.selected.characteristics.entries()).map(entry => {
                    return { name: entry[0].name, rating: entry[1] };
                });
                $scope.elementSkills = Array.from($scope.element.selected.skills.entries()).map(entry => {
                    return { skill: entry[0], rating: entry[1] };
                });
                $scope.elementKit = Array.from($scope.element.selected.kit.entries()).map(entry => {
                    return { item: entry[0], count: entry[1] };
                });
                $scope.$parent.$parent.regimentElements[$scope.category];
            }
        }, true);
        $scope.select = function (selected) {
            switch ($scope.element.category) {
                case "homeworld":
                    $scope.element.selected = new RegimentCreationModifier_1.Homeworld(selected);
                    break;
                case "commander":
                    $scope.element.selected = new RegimentCreationModifier_1.CommandingOfficer(selected);
                    break;
                case "regimentType":
                    $scope.element.selected = new RegimentCreationModifier_1.RegimentType(selected);
                    break;
                case "firstSpecialDoctrine":
                case "secondSpecialDoctrine":
                    $scope.element.selected = new RegimentCreationModifier_1.SpecialEquipmentorTrainingDoctrine(selected);
                    break;
            }
        };
    }
    exports.RegimentCreationElementController = RegimentCreationElementController;
});
//# sourceMappingURL=RegimentCreationElementController.js.map