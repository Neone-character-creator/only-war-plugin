define(function () {
    return function (associatedServiceName) {
        var associatedServiceName = associatedServiceName;
        return function ($scope, $state, $injector, $q, characterService, selection, optionselection, $uibModal, characteroptions) {
            $q.all({
                service: $injector.get(associatedServiceName),
                characteroptions: characteroptions
            }).then(function (results) {
                    switch (associatedServiceName) {
                        case "regiments":
                            $scope.selected = characterService.character.regiment;
                            $scope.selectionType = "regiments";
                            results.service.regiments.then(function (regiments) {
                                $scope.available = regiments;
                            });
                            break;
                        case "specialties":
                            $scope.selected = characterService.character.specialty;
                            $scope.selectionType = "specialties";
                            results.service.specialties.then(function (specialties) {
                                $scope.available = specialties;
                            });
                            break;
                    }
                    $scope.character = characterService.character;

                    var suppressDialog = false;

                    $scope.select = function (selected) {
                        var confirm;
                        var proceed = function () {
                            switch ($scope.selectionType) {
                                case "regiments":
                                    characterService.character.regiment = selected;
                                    break;
                                case "specialties":
                                    characterService.character.specialty = selected;
                                    break;
                            }
                            $scope.selected = selected;
                        }
                        if ($scope.selected && $state.$current.data.dirty) {
                            confirm = $uibModal.open({
                                controller: "ConfirmationController",
                                templateUrl: "pluginresource/templates/confirm-discard-changes-modal.html"
                            }).result.then(function () {
                                proceed();
                            });
                        } else {
                            proceed();
                        }

                    };

                    $scope.openSelectionModal = function (selectedObject) {
                        //Prepare the selection service
                        selection.selectionObject = selectedObject;
                        optionselection.target = $scope.selected;
                        optionselection.selectionObject = selectedObject;
                        var stateTransition = $state.go("modal.selection.modifier", {
                            "on-completion-callback": function () {
                                if ($scope.requiredSelections.length == 0) {
                                    $state.previous.data.complete = true;
                                }
                                switch (associatedServiceName) {
                                    case "regiments":
                                        characterService.character.regiment = $scope.selected;
                                        break;
                                    case "specialties":
                                        characterService.character.specialty = $scope.selected;
                                        break;
                                }
                            }
                        });

                    };

                    $scope.openStartingPowersModal = function () {
                        $uibModal.open({
                            controller: "StartingPowersController",
                            templateUrl: 'pluginresource/templates/starting-powers-modal.html'
                        });
                    }

                    $scope.$watch("selected", function () {
                        if ($scope.selected) {
                            $scope.selectedCharacteristics = Array.from($scope.selected.characteristics.entries()).map(function (entry) {
                                return {name: entry[0].name, value: entry[1]};
                            });

                            $scope.kit = Array.from($scope.selected.kit.entries()).map(function (entry) {
                                return {name: entry[0].name, count: entry[1]};
                            });

                            $scope.requiredSelections = $scope.selected.optionalModifiers;
                            if ($scope.requiredSelections.length > 0) {
                                $state.$current.data.complete = false;
                            }
                        }
                    });
                }
            );
        }
    }
});