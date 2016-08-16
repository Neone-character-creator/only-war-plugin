import * as $ from "jquery";
import * as angular from "angular";
import {RegimentCreationElementsContainer} from "../types/regiment/creation/RegimentCreationElementsContainer";
import {Regiment, RegimentBuilder} from "../types/character/Regiment";
import {Characteristic} from "../types/character/Characteristic";
import {KitModifierType, AddSpecificItemKitModifier, KitModifierResult} from "../types/regiment/creation/KitModifier";
import {Item} from "../types/character/items/Item";
import {Talent} from "../types/character/Talent";
/**
 * Created by Damien on 8/1/2016.
 */
export function RegimentCreationController($scope, $state, regimentOptions, characterService, characteroptions, $q, optionselection, $uibModal, selection) {
    $q.all({
        "characterOptions": $q.all({
            weapons: characteroptions.weapons,
            armor: characteroptions.armor,
            items: characteroptions.items,
            vehicles: characteroptions.vehicles,
        }),
        "regimentOptions": $q.all({
            "homeworlds": regimentOptions.homeworlds,
            "officers": regimentOptions.commandingOfficers,
            "types": regimentOptions.regimentTypes,
            "equipmentDoctrines": regimentOptions.equipmentDoctrines,
            "trainingDoctrines": regimentOptions.trainingDoctrines,
            "standardRegimentalKit": regimentOptions.standardRegimentalKit,
            "additionalKitChoices": regimentOptions.additionalKitChoices
        })
    }).then(
        function (results) {
            $scope.regimentName = "";
            var kitChoices;

            /**
             The chosen elements for regiment creation: the homeworld, commanding officer, regiment type and between 0 and 2
             special equipment and/or training doctrines.

             The homeworld, commander, type and favored weapons are all required to be selected, and all optional items they
             define that must be determined at regiment creation time chosen, to complete the regiment.
             */
            $scope.regimentElements = new RegimentCreationElementsContainer();

            /**
             * All of the basic weapons available to be chosen as Regiment favored Basic Weapon.
             * @type {T[]}
             */
            $scope.basicWeapons = results.characterOptions.weapons.filter(function (weapon) {
                var availability = false;
                switch (weapon.availability) {
                    case "Ubiquitous":
                    case "Abundant":
                    case "Plentiful":
                    case "Common":
                    case "Average":
                    case "Scarce":
                    case "Rare":
                    case "Very Rare":
                        availability = true;
                }
                return weapon.class == "Basic" && availability;
            });

            /**
             * All of heavy basic weapons available to be chosen as Regiment favored Heavy Weapon.
             * @type {T[]}
             */
            $scope.heavyWeapons = results.characterOptions.weapons.filter(function (weapon) {
                var availability = false;
                switch (weapon.availability) {
                    case "Ubiquitous":
                    case "Abundant":
                    case "Plentiful":
                    case "Common":
                    case "Average":
                    case "Scarce":
                    case "Rare":
                    case "Very Rare":
                        availability = true;
                }
                return weapon.class == "Heavy" && availability;
            });
            kitChoices = results.regimentOptions.additionalKitChoices;
            $scope.regimentElements.homeworld['options'] = results.regimentOptions.homeworlds;
            $scope.regimentElements.homeworld['header'] = "Homeworld/Origin";
            $scope.regimentElements.homeworld['category'] = "homeworld";
            $scope.regimentElements.commander['options'] = results.regimentOptions.officers;
            $scope.regimentElements.commander['header'] = "Commanding Officer";
            $scope.regimentElements.commander['category'] = "commander";
            $scope.regimentElements.regimentType['options'] = results.regimentOptions.types;
            $scope.regimentElements.regimentType['header'] = "Regiment Type";
            $scope.regimentElements.regimentType['category'] = "regimentType";
            $scope.regimentElements.firstSpecialDoctrine['options'] = results.regimentOptions.equipmentDoctrines.concat(results.regimentOptions.trainingDoctrines);
            $scope.regimentElements.firstSpecialDoctrine['header'] = "Special Equipment/Training Doctrine";
            $scope.regimentElements.firstSpecialDoctrine['category'] = "firstSpecialDoctrine";
            $scope.regimentElements.secondSpecialDoctrine['options'] = results.regimentOptions.equipmentDoctrines.concat(results.regimentOptions.trainingDoctrines);
            $scope.regimentElements.secondSpecialDoctrine['header'] = "Special Equipment/Training Doctrine";
            $scope.regimentElements.secondSpecialDoctrine['category'] = "secondSpecialDoctrine";
            $scope.regimentElements.standardRegimentalKit = results.regimentOptions.standardRegimentalKit.kit;

            /**
             Determines the availability of each of the regimental kit modifier choices, based on the current state of the
             regiment.

             Choices may be limited to being selected a maximum number of times, require the kit to already contain an item
             matching certain properties or require certain regiment creation options to be selected.

             When an item is unavailable, a message is attached to it describing why it is unavailable. Multiple such messages
             may be present if there are multiple reasons it is unavailable. These messages are displayed in the front end as
             tooltips.
             */
            function updateAvailableKitChoices() {
                $scope.kitChoices = results.regimentOptions.additionalKitChoices.map(function (choice) {
                    choice.unavailableMessage = undefined;
                    if (choice.cost > $scope.remainingKitPoints) {
                        if (!choice.unavailableMessage) {
                            choice.unavailableMessage = "";
                        }
                        choice.unavailableMessage += "\nRequires " + choice.cost + " points but only " + $scope.remainingKitPoints + " available."
                    }
                    var timesSelected = 0;
                    if ($scope.kitChoices) {
                        timesSelected = $scope.regimentElements.kitModifiers.filter(function (previousChoice) {
                            return previousChoice.description === choice.description;
                        }).length;
                    }
                    if (choice.limits) {
                        if (choice.limits.maxSelectCount && choice.limits.maxSelectCount <= timesSelected) {
                            if (!choice.unavailableMessage) {
                                choice.unavailableMessage = "";
                            }
                            choice.unavailableMessage += "\nAlready selected the maximum number of times."
                        }
                        if (choice.limits.regiment) {
                            if (choice.limits.regiment.type) {
                                if (!$scope.regimentElements.regimentType.selected || choice.limits.regiment.type.indexOf($scope.regimentElements.regimentType.selected.name) === -1) {
                                    if (!choice.unavailableMessage) {
                                        choice.unavailableMessage = "";
                                    }
                                    if (choice.limits.regiment.type.length > 1) {
                                        var requiredChoices = choice.limits.regiment.type.slice(0, choice.limits.regiment.type.length - 1).join(', ');
                                        requiredChoices += (" or " + choice.limits.regiment.type[choice.limits.regiment.type.length - 1]);
                                    } else {
                                        var requiredChoices = choice.limits.regiment.type[0];
                                    }
                                    choice.unavailableMessage += "\nRequires Regiment ItemType to be " + requiredChoices + ".";
                                }
                            }
                            if (choice.limits.regiment.commander) {
                                if (!$scope.regimentElements.commander.selected || $scope.regimentElements.commander.selected.name !== choice.limits.regiment.commander) {
                                    if (!choice.unavailableMessage) {
                                        choice.unavailableMessage = "";
                                    }
                                    var requiredChoices = choice.limits.regiment.commander.slice(0, choice.limits.regiment.type.length).join(', ');
                                    requiredChoices += " or " + choice.limits.regiment.commander[choice.limits.regiment.commander.length];
                                    choice.unavailableMessage += "\nRequires Commander to be " + requiredChoices + " but is " + $scope.regimentElements.commander.selected.name + ".";
                                }
                            }
                            if (choice.limits.regiment.homeworld) {
                                if (!$scope.regimentElements.homeworld.selected || $scope.regimentElements.homeworld.selected.name !== choice.limits.regiment.homeworld) {
                                    if (!choice.unavailableMessage) {
                                        choice.unavailableMessage = "";
                                    }
                                    var requiredChoices = choice.limits.regiment.homeworld.slice(0, choice.limits.regiment.type.length).join(', ');
                                    requiredChoices += " or " + choice.limits.regiment.homeworld[choice.limits.regiment.homeworld.length];
                                    choice.unavailableMessage += "\nRequires Homeworld/Origin to be " + requiredChoices + " but is " + $scope.regimentElements.homeworld.selected.name + ".";
                                }
                            }
                            if (choice.limits.regiment.doctrine) {
                                var combinedDoctrines = [$scope.regimentElements.firstSpecialDoctrine.selected, $scope.regimentElements.secondSpecialDoctrine.selected];
                                if (combinedDoctrines.length == 0 || combinedDoctrines.find(function (doctrine) {
                                        return doctrine != null && choice.limits.regiment.doctrine.indexOf(doctrine.name) !== -1;
                                    })) {
                                    if (!choice.unavailableMessage) {
                                        choice.unavailableMessage = "";
                                    }
                                    var requiredChoices = choice.limits.regiment.doctrine.slice(0, choice.limits.regiment.doctrine.length).join(', ');
                                    requiredChoices += (" or " + choice.limits.regiment.doctrine[choice.limits.regiment.doctrine.length]);
                                    choice.unavailableMessage += "\nRequires Doctrine " + requiredChoices + ".";
                                }
                            }
                        }
                    }

                    var equipment = $scope.regimentElements.regimentKit;

                    //Iterate over the kit choices
                    var potentialMessage = "";
                    var atLeastOneTargetExists = false;
                    //Upgrade and Replace are only available if there is an item they can affect in the kit
                    if (choice.type == KitModifierType.Upgrade || choice.type == KitModifierType.Replace) {
                        var targetExists = false;
                        //Test each item against the effect target.
                        $.each(Array.from(equipment.keys()), function (i, item) {
                            targetExists = choice.matches(item);
                            //Continue iteration if no match found yet.
                            return !targetExists;
                        });
                        //If no targets were found, add to the possible error string.
                        if (!targetExists) {
                            var message = "item with ";
                            for (let property in choice.matcher) {
                                message += property + ": " + choice.matcher[property] + ".";
                            }
                            potentialMessage += "\nRequires " + message;
                        } else {
                            atLeastOneTargetExists = true;
                        }
                        if (!atLeastOneTargetExists) {
                            if (!choice.unavailableMessage) {
                                choice.unavailableMessage = ""
                            }
                            choice.unavailableMessage += "\n" + potentialMessage;
                        }
                    }

                    return choice;
                });
            };
            $scope.readyToSelectKitModifiers = false;

            function reapplyModifiers() {
                $scope.readyToSelectEquipment = $scope.regimentElements['homeworld'] &&
                    $scope.regimentElements['commander'] &&
                    $scope.regimentElements['type'];
                checkReadyToSelectKitModifiers();
                updateAvailableKitChoices();
                $scope.regiment = $scope.regimentElements.build();
            }

            /**
             These watches track the required values for determining when it is possible to complete the creation of the
             regiment and when the player is allowed to choose kit modifiers.
             */
            $scope.$watchCollection("regimentElements.homeworld.selected['optional modifiers']", function () {
                isRegimentCreationComplete();
            });
            $scope.$watchCollection("regimentElements.commander.selected['optional modifiers']", function () {
                isRegimentCreationComplete();
            });
            $scope.$watchCollection("regimentElements.regimentType.selected['optional modifiers']", function () {
                isRegimentCreationComplete();
            });
            $scope.$watch("regimentElements.name", function () {
                isRegimentCreationComplete();
            });
            $scope.$watch(()=> {
                return $scope.regimentElements;
            }, function () {
                reapplyModifiers();
                checkReadyToSelectKitModifiers();
                isRegimentCreationComplete();
            }, true);

            function checkReadyToSelectKitModifiers() {
                if ($scope.regiment) {
                    var ready = $scope.regimentElements.homeworld !== null;
                    ready = $scope.regimentElements.commander !== null && ready;
                    ready = $scope.regimentElements.regimentType !== null && ready;
                    ready = $scope.regimentElements.basicFavoredWeapons !== null && $scope.regimentElements.basicFavoredWeapons !== null && ready;
                    $scope.readyToSelectKitModifiers = ready;
                }
                if ($scope.readyToSelectEquipment) {
                    updateAvailableKitChoices();
                }
            }

            function isRegimentCreationComplete() {
                $scope.regimentCompletionStepsRequiredMessage = null;
                if ($scope.regiment) {
                    //Regiment is finished if it has a selected homeworld, commander and type, each has no optional modifiers left, and has selected favored weapons and name.
                    var nameReady = $scope.regimentElements.name;

                    var homeworldReady = $scope.regimentElements.homeworld.selected &&
                        (!$scope.regimentElements.homeworld.selected['optional modifiers'] ||
                        $scope.regimentElements.homeworld.selected['optional modifiers'].filter(function (e) {
                            return e['selection time'] === "regiment"
                        }).length === 0);

                    var commanderReady = $scope.regimentElements.commander.selected &&
                        (!$scope.regimentElements.commander.selected['optional modifiers'] ||
                        $scope.regimentElements.commander.selected['optional modifiers'].filter(function (e) {
                            return e['selection time'] === "regiment"
                        }).length === 0);

                    var typeReady = $scope.regimentElements.regimentType.selected &&
                        (!$scope.regimentElements.regimentType.selected['optional modifiers'] ||
                        $scope.regimentElements.regimentType.selected['optional modifiers'].filter(function (e) {
                            return e['selection time'] === "regiment"
                        }).length === 0);

                    var favoredWeaponsReady = $scope.regimentElements.basicFavoredWeapons && $scope.regimentElements.heavyFavoredWeapons;
                    if (!(homeworldReady && commanderReady && typeReady && favoredWeaponsReady && nameReady)) {
                        $scope.regimentCompletionStepsRequiredMessage = "";
                        if (!nameReady) {
                            $scope.regimentCompletionStepsRequiredMessage += "The regiment requires a name first. "
                        }
                        if (!homeworldReady) {
                            $scope.regimentCompletionStepsRequiredMessage += "The Homeworld/Origin has not been set or all the regiment creation time options haven't been chosen. "
                        }
                        if (!commanderReady) {
                            $scope.regimentCompletionStepsRequiredMessage += "The Commanding Officer has not been set or all the regiment creation time options haven't been chosen. "
                        }
                        if (!typeReady) {
                            $scope.regimentCompletionStepsRequiredMessage += "The Regiment Type has not been set or all the regiment creation time options haven't been chosen. "
                        }
                        if (!favoredWeaponsReady) {
                            $scope.regimentCompletionStepsRequiredMessage += "Both favored weapons haven't been set. "
                        }
                    }
                    $scope.isRegimentCreationComplete = homeworldReady && commanderReady && typeReady && favoredWeaponsReady && nameReady;
                }
            }

            $scope.finish = function () {
                if ($scope.isRegimentCreationComplete) {
                    characterService.character.regiment = $scope.regiment;
                    $state.go("regiment");
                }
            };

            //Make any selections for the given kit modifier and add it to the chosen modifiers.
            $scope.addKitModifier = function (choice) {
                $scope.remainingKitPoints -= choice.kitPointCost;
                switch (choice.type) {
                    case KitModifierType.AddSpecific:
                        choice = <AddSpecificItemKitModifier>choice;
                        $scope.regimentElements.kitModifiers.push(choice.apply($scope.regimentElements.regimentKit));
                        updateAvailableKitChoices();
                        break;
                    case KitModifierType.Replace:
                    case KitModifierType.Upgrade:
                    {
                        var potentialTargets = Array.from($scope.regimentElements.regimentKit).filter((item)=> {
                            var match = choice.matches(item[0]);
                            return match;
                        }).map(item=> {
                            return [{property: "character kit", value: {item: item[0], count: 1}}];
                        });
                        selection.selectionObject = {
                            numSelectionsNeeded: 1,
                            options: potentialTargets
                        };
                        $state.go("createRegiment.kitModifier", {
                            "on-completion-callback": function (result) {
                                var selectedItems = selection.selected.reduce((previous, current)=> {
                                    return previous.concat(current);
                                }).map(e=> {
                                    return e.value.item;
                                });
                                $scope.regimentElements.kitModifiers.push(
                                    choice.apply($scope.regimentElements.regimentKit, selectedItems));
                                updateAvailableKitChoices();
                            }
                        });
                        break;
                    }
                    case KitModifierType.AddMatching:
                    {
                        let options = results.characterOptions.weapons.concat(
                            results.characterOptions.items
                        ).concat(
                            results.characterOptions.armor
                        ).filter(option=> {
                            return choice.matches(option);
                        });
                        selection.selectionObject = {
                            numSelectionsNeeded: 1,
                            options: options
                        };
                        $state.go("modal.selection.kitModifier", {
                            "on-completion-callback": function (result) {
                                var selectedItems = selection.selected.reduce((previous, current)=> {
                                    return previous.concat(current);
                                }).map(e=> {
                                    return e.value.item;
                                });
                                $scope.regimentElements.kitModifiers.push(
                                    choice.apply($scope.regimentElements.regimentKit, selectedItems));
                                updateAvailableKitChoices();
                            }
                        });
                    }
                    case KitModifierType.AddFavored:
                    {
                        switch (choice.category) {
                            case "Basic":
                                selection.selectionObject = {
                                    numSelectionsNeeded: 1,
                                    options: $scope.basicWeapons.map(weapon=> {
                                        return [{
                                            property: "character kit", value: {
                                                item: weapon,
                                                count: 1
                                            }
                                        }]
                                    })
                                };
                                break;
                            case "Heavy":
                                selection.selectionObject = {
                                    numSelectionsNeeded: 1,
                                    options: $scope.heavyWeapons.map(weapon=> {
                                        return [{
                                            property: "character kit", value: {
                                                item: weapon,
                                                count: 1
                                            }
                                        }]
                                    })
                                };
                                break;
                        }
                        $state.go("createRegiment.kitModifier", {
                            "on-completion-callback": function (result) {
                                $scope.regimentElements.kitModifiers.push(
                                    choice.apply($scope.regimentElements.regimentKit));
                                updateAvailableKitChoices();
                                switch (choice.category) {
                                    case "Basic":
                                        $scope.regimentElements.basicFavoredWeapons = $scope.regimentElements.basicFavoredWeapons.concat(selection.selected);
                                        break;
                                    case "Heavy":
                                        $scope.regimentElements.heavyFavoredWeapons = $scope.regimentElements.heavyFavoredWeapons.concat(selection.selected);
                                        break;
                                }
                            }
                        });
                    }
                }
            };

            $scope.removeKitModifier = function (index) {
                /*
                 When removing a given kit modifier, it is possible for the effects of a modifier
                 to make changes that depend on a previous modifier being applied, for
                 example, modifying the craftsmanship of an object that was added by another
                 modifier.

                 To ensure that no inconsistencies occur, when removing a modifier all
                 other modifiers that were applied afterwards are also removed and their
                 point cost refunded.
                 */
                var removed:Array<KitModifierResult> = $scope.regimentElements.kitModifiers.splice(index).reverse();
                $scope.regimentElements.kitModifiers = $scope.regimentElements.kitModifiers.slice(0, index);
                removed.forEach(modifier=> {
                    for (let addedItemEntry of modifier.itemsAdded.entries()) {
                        if ($scope.regimentElements.regimentKit.has(addedItemEntry[0])) {
                            if ($scope.regimentElements.regimentKit.get(addedItemEntry[0]) == addedItemEntry[1]) {
                                $scope.regimentElements.regimentKit.delete(addedItemEntry[0]);
                            } else {
                                $scope.regimentElements.regimentKit.set(addedItemEntry[0], $scope.regimentElements.regimentKit.get(addedItemEntry[0]) - addedItemEntry[1]);
                            }
                        }
                    }
                    for (let removedItemEntry of modifier.itemsAdded.entries()) {
                        let existingCount = $scope.regimentElements.regimentKit.get(removedItemEntry[0]);
                        if (!existingCount) {
                            existingCount = 0;
                        }
                        $scope.regimentElements.regimentKit.set(removedItemEntry[0], removedItemEntry[1] + existingCount);
                    }
                });
                reapplyModifiers();
            };

            //See if the properties on the given object match those of the given target object
            function testItemMatchesTarget(item, target) {
                for (var property in target) {
                    if (item[property] !== target[property]) {
                        return false;
                    }
                }
                return true;
            };
            $scope.basicFavoredWeapon;
            $scope.$watch("basicFavoredWeapon", (newVal, oldVal)=> {
                var index = $scope.regimentElements.basicFavoredWeapons.findIndex(i=> {
                    return i === oldVal;
                });
                if (index > -1) {
                    $scope.regimentElements.basicFavoredWeapons.splice(index, 1);
                }
                if (newVal) {
                    $scope.regimentElements.basicFavoredWeapons.push(newVal);
                }
            });

            $scope.basicFavoredWeapon;
            $scope.$watch("heavyFavoredWeapon", (newVal, oldVal)=> {
                var index = $scope.regimentElements.heavyFavoredWeapons.findIndex(i=> {
                    return i === oldVal;
                });
                if (index > -1) {
                    $scope.regimentElements.heavyFavoredWeapons.splice(index, 1).push(newVal);
                }
                if (newVal) {
                    $scope.regimentElements.heavyFavoredWeapons.push(newVal);
                }
            });

            $scope.$watch("regiment", function () {
                if ($scope.regiment) {
                    $scope.regimentCharacteristics = Array.from($scope.regiment.characteristics.entries());
                    $scope.regimentSkills = Array.from($scope.regiment.skills.entries()).map((entry)=> {
                        return {skill: entry[0], rating: entry[1]};
                    });
                    $scope.regimentKit = Array.from($scope.regimentElements.regimentKit.entries())
                        .sort((a, b)=> {
                            if (a[0].type != b[0].type) {
                                return a[0].type - b[0].type;
                            }
                            return a[0].name.localeCompare(b[0].name);
                        });
                    $scope.regimentFavoredWeapons = Array.from($scope.regiment.favoredWeapons.entries()).map(entry=> {
                        return {category: entry[0], weapon: entry[1]};
                    });
                }
            });

            reapplyModifiers();
            updateAvailableKitChoices();

            $scope.favoredWeaponsFilter = (element)=> {
                return element.name;
            }

            $scope.setSpecialization = (element, talent)=> {
                selection.selectionObject.numSelectionsNeeded = 0;
                selection.selectionObject.options = [];
                $state.go("createRegiment.setSpecialization", {
                    "on-completion-callback": function () {
                        element.talents = element.talents.splice(element.talents.findIndex(t=> {
                            return t === talent;
                        }));
                        talent = new Talent(talent.name, talent.source, talent.tier, talent.aptitudes, selection.selected)
                    }
                })
            }
        }
    )
}