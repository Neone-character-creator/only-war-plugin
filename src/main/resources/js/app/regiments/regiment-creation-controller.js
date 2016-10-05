define(["../types/character/Regiment", "../types/character/Characteristic", "../types/regiment/creation/RegimentCreationElementsContainer"], function (Regiment, Characteristic, RegimentCreationElementContainer) {
    return function ($scope, $state, regimentOptions, regiments, characterService, $q, optionselection, $uibModal, characteroptions, selection) {
        $q.all({
            "characterOptions": $q.all({
                weapons: characteroptions.weapons,
                armor: characteroptions.armor,
                items: characteroptions.items,
                vehicles: characteroptions.vehicles,
            }),
            "regimentOptions": regimentOptions.then(function (regimentOptions) {
                    return $q.all({
                        "homeworlds": regimentOptions.homeworlds,
                        "officers": regimentOptions.officers,
                        "types": regimentOptions.types,
                        "equipmentDoctrines": regimentOptions.equipmentDoctrines,
                        "trainingDoctrines": regimentOptions.trainingDoctrines,
                        "standardRegimentalKit": regimentOptions.standardRegimentalKit,
                        "additionalKitChoices": regimentOptions.additionalKitChoices
                    });
                }
            )
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
                function regimentElementEntry() {
                    this.header = "Please Wait...";
                    this._selected = null;
                };
                regimentElementEntry.prototype = {
                    set selected(value) {
                        this._selected = angular.copy(value);
                        if (value) {
                            switch (value.name) {
                                case "Hardened Fighters":
                                {
                                    selection.selectionObject = {
                                        selections: 1,
                                        options: [
                                            {
                                                "index": 0,
                                                "description": "Replace standard melee weapon with a Common or more Availability melee weapon"
                                            },
                                            {
                                                "index": 1,
                                                "description": "Upgrade standard melee weapon with the Mono upgrade"
                                            }
                                        ]
                                    };
                                    $uibModal.open({
                                        controller: "SelectionModalController",
                                        templateUrl: "/templates/selection-modal.html"
                                    }).result.then(function () {
                                        var result = selection.selected[0];
                                        switch (result.index) {
                                            case 0:
                                                //Choose one Melee weapon of Common or higher availability.
                                                selection.selectionObject = {
                                                    selections: 1,
                                                    options: $scope.equipment.weapons.filter(function (weapon) {
                                                        return weapon.class === "Melee"
                                                            && (weapon.availability === "Common"
                                                            || weapon.availability == "Plentiful"
                                                            || weapon.availability == "Abundant"
                                                            || weapon.availability == "Ubiquitous")
                                                    }).map(function (weapon) {
                                                        return {
                                                            weapon: weapon,
                                                            description: weapon.name
                                                        }
                                                    })
                                                };
                                                $uibModal.open({
                                                    controller: "SelectionModalController",
                                                    templateUrl: "/templates/selection-modal.html"
                                                }).result.then(function () {
                                                    //Add selected melee weapon, laspistol + 2 charg packs as main weapons
                                                    selection.selected[0]['main weapon'] = true;
                                                    var additions = [
                                                        {
                                                            count: 1,
                                                            item: $scope.equipment.weapons.find(function (weapon) {
                                                                return weapon.name == "Laspistol"
                                                            })
                                                        },
                                                        {
                                                            count: 1,
                                                            item: $scope.equipment.items.find(function (item) {
                                                                return item.name == "Charge Pack (Pistol)"
                                                            })
                                                        },
                                                        {
                                                            count: 1,
                                                            item: selection.selected[0]
                                                        }
                                                    ].forEach(function (item) {
                                                        item['main weapon'] = true;
                                                    })
                                                    $regiment['character kit']
                                                        = $regiment['character kit'].filter(function (item) {
                                                        return !item['main weapon'];
                                                    }).concat(additions);
                                                });
                                                break;
                                            case 1:
                                                var standardMeleeWeapon = $scope.regiment['character kit'].find(function (item) {
                                                    return item['standard melee weapon'];
                                                });
                                                if (!standardMeleeWeapon.item.upgrades) {
                                                    standardMeleeWeapon.item.upgrades = [];
                                                }
                                                standardMeleeWeapon.item.upgrades.push("Mono");
                                                break;
                                        }
                                    });
                                    break;
                                }
                                case "Warrior Weapons":
                                {
                                    selection.selectionObject = {
                                        selections: 1,
                                        options: $scope.equipment.weapons.filter(function (weapon) {
                                            return weapon.class === "Low-Tech"
                                                && (weapon.availability === "Common"
                                                || weapon.availability == "Plentiful"
                                                || weapon.availability == "Abundant"
                                                || weapon.availability == "Ubiquitous")
                                        })
                                    };
                                    $uibModal.open({
                                        controller: "SelectionModalController",
                                        templateUrl: "/templates/selection-modal.html"
                                    }).result.then(function () {
                                        value;
                                    });
                                }
                            }
                            reapplyModifiers()
                        }
                    },
                    get selected() {
                        return this._selected;
                    }
                };
                $scope.regimentElements = {
                    homeworld: new regimentElementEntry(),
                    commander: new regimentElementEntry(),
                    type: new regimentElementEntry(),
                    doctrine1: new regimentElementEntry(),
                    doctrine2: new regimentElementEntry()
                }
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
                kitChoices = angular.copy(results.regimentOptions.additionalKitChoices);
                $.each(kitChoices, function (i, choice) {
                    switch (choice.effect.type) {
                        case "Add":
                        case "Replace":
                        {
                            $.each(choice.effect.results, function (i, result) {
                                var placeholder = angular.copy(result);
                                result.item = results.characterOptions.weapons.find(function (item) {
                                    for (var property in placeholder.item) {
                                        if (item[property] !== placeholder.item[property]) {
                                            return false;
                                        }
                                    }
                                    return true;
                                    s
                                });
                                if (!result.item) {
                                    result.item = results.characterOptions.items.find(function (item) {
                                        for (var property in placeholder.item) {
                                            if (item[property] !== placeholder.item[property]) {
                                                return false;
                                            }
                                        }
                                        return true;
                                    });
                                }
                                if (!result.item) {
                                    result.item = results.characterOptions.armor.find(function (item) {
                                        for (var property in placeholder.item) {
                                            if (item[property] !== placeholder.item[property]) {
                                                return false;
                                            }
                                        }
                                        return true;
                                    });
                                }
                            });
                            break;
                        }
                        case "AddAvailability":
                        {
                            var targetAvailability = choice.effect.target;
                            var options = results.characterOptions.items
                                .filter(function (item) {
                                    return item.availability === targetAvailability;
                                }).map(function (item) {
                                    return {
                                        value: {
                                            item: item,
                                            count: 1
                                        }
                                    }
                                });
                            choice.effect.target = "other gear";
                            choice.effect.results = options;
                        }
                    }
                });
                $scope.chosenKitModifiers = [];
                for (var section in $scope.regimentElements) {
                    switch (section) {
                        case "homeworld":
                            $scope.regimentElements[section].options = results.regimentOptions.homeworlds;
                            $scope.regimentElements[section].header = "Homeworld/Origin"
                            break;
                        case "commander":
                            $scope.regimentElements[section].options = results.regimentOptions.officers;
                            $scope.regimentElements[section].header = "Commanding Officer"
                            break;
                        case "type":
                            $scope.regimentElements[section].options = results.regimentOptions.types;
                            $scope.regimentElements[section].header = "Regiment Type"
                            break;
                        case "doctrine1":
                        case "doctrine2":
                            $scope.regimentElements[section].options = results.regimentOptions.equipmentDoctrines.concat(results.regimentOptions.trainingDoctrines);
                            $scope.regimentElements[section].header = "Special Equipment/Training Doctrine"
                            break;

                    }
                }
                reapplyModifiers();
                updateAvailableKitChoices();

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
                    $scope.kitChoices = angular.copy(results.regimentOptions.additionalKitChoices.map(function (choice) {
                        choice.unavailableMessage = undefined;
                        if (choice.cost > $scope.remainingKitPoints) {
                            if (!choice.unavailableMessage) {
                                choice.unavailableMessage = "";
                            }
                            choice.unavailableMessage += "\nRequires " + choice.cost + " points but only " + $scope.remainingKitPoints + " available."
                        }
                        var timesSelected = 0;
                        if ($scope.kitChoices) {
                            timesSelected = $scope.chosenKitModifiers.filter(function (previousChoice) {
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
                                    if (!$scope.regimentElements.type.selected || choice.limits.regiment.type.indexOf($scope.regimentElements.type.selected.name) === -1) {
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
                                    var combinedDoctrines = [$scope.regimentElements.doctrine1.selected, $scope.regimentElements.doctrine2.selected];
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

                        var equipment = $scope.regiment.kit;

                        //Iterate over the kit choices
                        var potentialMessage = "";
                        var atLeastOneTargetExists = false;
                        //Upgrade and Replace are only available if there is an item they can affect in the kit
                        if (choice.effect.type == "Upgrade" || choice.effect.type == "Replace") {
                            var targetExists = false;
                            //Iterate to find possible target items
                            $.each(choice.effect.target, function (i, target) {
                                //Test each item against the effect target.
                                $.each(equipment, function (i, item) {
                                    targetExists = testItemMatchesTarget(item.value, target);
                                    //Continue iteration if no match found yet.
                                    return !targetExists;
                                });
                                //Stop iterating if any of the effects can be applied
                                return !targetExists;
                            });
                            //If no targets were found, add to the possible error string.
                            if (!targetExists) {
                                var message = "item with ";
                                $.each(choice.effect.target, function (i, target) {
                                    for (var property in target) {
                                        message += property + ": " + target[property] + ". ";
                                    }
                                });
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
                    }));
                };
                /**
                 Contains all of the kit modifier choices that have already been selected by the user and applied.
                 */
                $scope.chosenKitModifiers = [];
                $scope.readyToSelectKitModifiers = false;

                function reapplyModifiers() {
                    var favoredWeapons = $scope.regiment ? $scope.regiment.favoredWeapons : [null, null];
                    $scope.regiment = new Regiment.RegimentBuilder();
                    $scope.regiment.setFavoredWeapons(favoredWeapons);
                    $scope.regiment.addModifier = function (modifier) {
                        //Needed for scoping issues
                        var regiment = this;
                        for (var property in modifier['fixed modifiers']) {
                            if (modifier['fixed modifiers'].hasOwnProperty(property)) {
                                switch (property) {
                                    case "characteristics":
                                    {
                                        for (var characteristic in modifier['fixed modifiers']["characteristics"]) {
                                            var previousValue = $scope.regiment.characteristics.get(Characteristic.Characteristic.characteristics.get(characteristic));
                                            if (previousValue) {
                                                $scope.regiment.characteristics.set(Characteristic.Characteristic.characteristics.get(characteristic), previousValue + modifier['fixed modifiers']["characteristics"][characteristic]);
                                            } else {
                                                $scope.regiment.characteristics.set(Characteristic.Characteristic.characteristics.get(characteristic), modifier['fixed modifiers']["characteristics"][characteristic]);
                                            }
                                        }
                                        break;
                                    }
                                    case "skills":
                                    {
                                        var incomingSkills = modifier['fixed modifiers'].skills;
                                        for (var skill in incomingSkills) {
                                            var existingSkill = incomingSkills[skill.name];
                                            if (existingSkill) {
                                                existingSkill.advancements = existingSkill.advancements() + incomingSkills[skill];
                                            } else {
                                                regiment.skills[skill] = incomingSkills[skill];
                                            }
                                        }
                                        break;
                                    }
                                    case "talents":
                                    {
                                        if (!regiment[property]) {
                                            regiment[property] = [];
                                        }
                                        var incomingTalents = modifier['fixed modifiers']['talents'];
                                        for (var i = 0; i < incomingTalents.length; i++) {
                                            regiment.talents.push(incomingTalents[i]);
                                        }
                                        break;
                                    }
                                    case "aptitudes":
                                    {
                                        if (!regiment[property]) {
                                            regiment[property] = [];
                                        }
                                        var incomingAptitudes = modifier['fixed modifiers']['aptitudes'];
                                        regiment.aptitudes = regiment.aptitudes.concat(incomingAptitudes);
                                        break;
                                    }
                                    case "starting power experience":
                                    {
                                        regiment[property] += modifier['fixed modifiers']['starting power experience'];
                                        break;
                                    }
                                    case "psy rating":
                                    {
                                        if (regiment[property]) {
                                            console.log(modifier.name + " tried to set the psy rating, but it's already set.")
                                        }
                                        regiment[property] = modifier['fixed modifiers']['psy rating'];
                                        break;
                                    }
                                    case "special abilities":
                                    {
                                        regiment.specialAbilities.push(modifier['fixed modifiers']['special abilities']);
                                        break;
                                    }
                                    case "character kit":
                                    {
                                        var replacementMainWeapons = modifier['fixed modifiers']['character kit'].filter(function (item) {
                                            return item['main weapon'];
                                        });
                                        var replacementArmor = modifier['fixed modifiers']['character kit'].filter(function (item) {
                                            return item.armor;
                                        });
                                        var otherItems = modifier['fixed modifiers']['character kit'].filter(function (item) {
                                            return !item.armor && !item['main weapon'];
                                        });
                                        if (replacementMainWeapons.length > 1) {
                                            //Remove all main weapons and insert the replacement ones
                                            var mainWeapons = Array.from(regiment.kit.keys()).filter(function (weapon) {
                                                return weapon['main weapon'];
                                            });
                                            $.each(mainWeapons, function (i, weapon) {
                                                regiment.kit.delete(weapon);
                                            })
                                            $.each(replacementMainWeapons, function (i, replacement) {
                                                regiment.kit.set(replacement.item, replacement.count);
                                            });
                                        }
                                        if (replacementArmor.length > 1) {
                                            //Remove all main weapons and insert the replacement ones
                                            var armor = Array.from(regiment.kit.keys()).filter(function (armor) {
                                                return armor.item;
                                            });
                                            $.each(armor, function (i, armor) {
                                                regiment.kit.delete(armor);
                                            })
                                            $.each(armor, function (i, armor) {
                                                regiment.kit.set(armor.item, armor.count);
                                            });
                                        }
                                        $.each(otherItems, function (i, otherItemEntry) {
                                            var existingItem = Array.from(regiment.kit.values()).find(function (item) {
                                                return angular.equals(otherItemEntry.item, item);
                                            });
                                            if (existingItem) {
                                                regiment.kit.set(existingItem, regiment.kit.get(existingItem) + otherItemEntry.count);
                                            } else {
                                                regiment.kit.set(otherItemEntry.item, otherItemEntry.count);
                                            }
                                        });
                                        break;
                                    }
                                }
                            }
                        }
                        if (modifier['optional modifiers']) {
                            var regiment = regiment;
                            $.each(modifier['optional modifiers'].filter(function (e) {
                                return e['selection time'] === "regiment"
                            }), function (i, optionalModifier) {
                                regiment.optionalModifiers.push(optionalModifier);
                            });
                        }
                    }
                    $scope.regiment.addModifier(results.regimentOptions.standardRegimentalKit);
                    $scope.remainingRegimentPoints = 12;
                    for (var regimentModifierSection in $scope.regimentElements) {
                        if ($scope.regimentElements[regimentModifierSection].selected) {
                            $scope.remainingRegimentPoints -= $scope.regimentElements[regimentModifierSection].selected.cost;
                            $scope.regiment.addModifier($scope.regimentElements[regimentModifierSection].selected);
                        }
                    }
                    $scope.readyToSelectEquipment = $scope.regimentElements['homeworld'] &&
                        $scope.regimentElements['commander'] &&
                        $scope.regimentElements['type'];
                    $scope.remainingKitPoints = 30 + ($scope.regiment.remainingRegimentPoints ? $scope.regiment.remainingRegimentPoints : 0 * 2);
                    $.each($scope.chosenKitModifiers, function (i, chosenModifier) {
                        $scope.applyKitModifier(chosenModifier);
                    });
                    checkReadyToSelectKitModifiers();
                }

                /**
                 These watches track the required values for determining when it is possible to complete the creation of the
                 regiment and when the player is allowed to choose kit modifiers.
                 */
                $scope.$watchCollection("regiment['favored weapons']", function (newVal, oldVal) {
                    checkReadyToSelectKitModifiers();
                    isRegimentCreationComplete();
                });
                $scope.$watchCollection("regimentElements.homeworld.selected['optional modifiers']", function () {
                    isRegimentCreationComplete();
                });
                $scope.$watchCollection("regimentElements.commander.selected['optional modifiers']", function () {
                    isRegimentCreationComplete();
                });
                $scope.$watchCollection("regimentElements.type.selected['optional modifiers']", function () {
                    isRegimentCreationComplete();
                });
                $scope.$watch("regiment.name", function () {
                    isRegimentCreationComplete();
                });
                $scope.$watchGroup(["regimentElements.homeworld.selected",
                    "regimentElements.commander.selected",
                    "regimentElements.type.selected"
                ], function () {
                    checkReadyToSelectKitModifiers();
                    isRegimentCreationComplete();
                });
                $scope.$watchGroup(["regimentElements.homeworld.selected",
                    "regimentElements.commander.selected",
                    "regimentElements.type.selected",
                    "regimentElements.doctrine1",
                    "regimentElements.doctrine2"
                ], function () {
                    $scope.chosenKitModifiers = $scope.chosenKitModifiers.filter(function (choice) {
                        return choice.type !== "Replace" && choice.type !== "Upgrade";
                    });
                });

                function checkReadyToSelectKitModifiers() {
                    if ($scope.regiment) {
                        var ready = $scope.regimentElements.homeworld.selected !== null;
                        ready = $scope.regimentElements.commander.selected !== null && ready;
                        ready = $scope.regimentElements.type.selected !== null && ready;
                        ready = $scope.regiment.favoredWeapons[0] !== null && $scope.regiment.favoredWeapons[1] !== null && ready;
                        $scope.readyToSelectKitModifiers = ready;
                    }
                    if ($scope.readyToSelectEquipment) {
                        updateAvailableKitChoices();
                    }
                }

                function isRegimentCreationComplete() {
                    if ($scope.regiment) {
                        //Regiment is finished if it has a selected homeworld, commander and type, each has no optional modifiers left, and has selected favored weapons and name.
                        var nameReady = $scope.regimentName;
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
                        var typeReady = $scope.regimentElements.type.selected &&
                            (!$scope.regimentElements.type.selected['optional modifiers'] ||
                            $scope.regimentElements.type.selected['optional modifiers'].filter(function (e) {
                                return e['selection time'] === "regiment"
                            }).length === 0);
                        var favoredWeaponsReady = $scope.regiment.favoredWeapons[0] !== null && $scope.regiment.favoredWeapons[1] !== null;
                        $scope.isRegimentCreationComplete = homeworldReady && commanderReady && typeReady && favoredWeaponsReady && nameReady;
                    }
                }

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
                            selected: function () {
                                return modifier;
                            },
                            remainingSelections: function () {
                                return modifier['optional modifiers'];
                            },
                            complete: function () {
                                return modifier && _remainingSelections.length === 0;
                            },
                            select: function (modifier) {
                                _selected = angular.copy(modifier);
                            }
                        };
                        optionselection.applySelection();
                        reapplyModifiers();
                    });
                };

                $scope.finish = function () {
                    if ($scope.regiment.remainingRegimentPoints >= 0 &&
                        $scope.remainingKitPoints >= 0 &&
                        $scope.regimentElements['homeworld'].selected &&
                        $scope.regimentElements['type'].selected &&
                        $scope.regimentElements['commander'].selected
                    ) {
                        $scope.regiment.setName($scope.regimentName);
                        regiments.selected = $scope.regiment.build();
                        $state.go("regiment");
                    }
                };

                //Apply the effects of the given kit modifier to the regimental kit.
                $scope.applyKitModifier = function (modifier) {
                    switch (modifier.effect.type) {
                        case "Replace":
                        {
                            $.each(modifier.effect.target, function (i, target) {
                                var targetIndex = target.section.indexOf(target.value);
                                target.section.splice(targetIndex, 1);
                                $.each(modifier.effect.results, function (i, result) {
                                    target.section.push(result);
                                });
                            });

                            break;
                        }
                        case "Upgrade":
                        {
                            $.each(modifier.effect.results, function (i, result) {
                                for (var property in result) {
                                    modifier.effect.target[i].item.value.item[property] = result[property];
                                }
                            });
                            break;
                        }
                        case "Add":
                            var target = $scope.regiment['character kit'][modifier.effect.target];
                            var existingItem;
                            $.each(target, function (i, item) {
                                if (angular.equals(item.item, result.item)) {
                                    item.count += result.count;
                                    existingItem = true;
                                    return false;
                                }
                            });
                            if (!existingItem) {
                                $.each(modifier.effect.results, function (i, result) {
                                    $scope.regiment['character kit'][modifier.effect.target].push(result.value);
                                })
                            }
                            break;
                        case "AddFavored":
                            var favoredWeapon;
                            switch (modifier.effect.target) {
                                case "Basic":
                                    favoredWeapon = $scope.regiment['favored weapons'][0];
                                    break;
                                case "Heavy":
                                    favoredWeapon = $scope.regiment['favored weapons'][1];
                                    break;
                            }
                            var existingItem = $scope.regiment['character kit']
                                .find(function (weapon) {
                                    return angular.equals(weapon, favoredWeapon);
                                });
                            if (existingItem) {
                                existingItem.count += 1;
                            } else {
                                $scope.regiment['character kit'].push({
                                    item: favoredWeapon,
                                    count: 1
                                });
                            }
                            break;
                    }
                    updateAvailableKitChoices();
                };

                //Make any selections for the given kit modifier and add it to the chosen modifiers.
                $scope.addKitModifier = function (choice) {
                    //Chained promises of any opened modal. Later used to proceed once all the modal promises successfully resolve.
                    var modals;
                    //Array containing all items that are eligible at targets for the effect.
                    //Application function
                    modals.then(function (result) {
                        $scope.chosenKitModifiers.push(choice);
                        choice.timesSelected++;
                        $scope.remainingKitPoints -= choice.cost;
                        $scope.applyKitModifier(choice);
                        updateAvailableKitChoices();
                    })
                };

                $scope.removeKitModifier = function (modifier) {
                    /*
                     When removing a given kit modifier, it is possible for the effects of a modifier
                     to make changes that depend on a previous modifier being applied, for
                     example, modifying the craftsmanship of an object that was added by another
                     modifier.

                     To ensure that no inconsistencies occur, when removing a modifier all
                     other modifiers that were applied afterwards are also removed and their
                     point cost refunded.
                     */
                    $scope.chosenKitModifiers = $scope.chosenKitModifiers.slice(0, $scope.chosenKitModifiers.indexOf(modifier));
                    $scope.remainingKitPoints += modifier.cost;
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

                //Filters creation options so that items with too high a cost are hidden
                $scope.costFilter = function (item) {
                    return item.cost <= $scope.remainingRegimentPoints;
                }

                $scope.$watch("regiment", function () {
                    if ($scope.regiment) {
                        $scope.regimentCharacteristics = Array.from($scope.regiment.characteristics.entries());
                        $scope.regimentKit = Array.from($scope.regiment.kit.entries());
                    }
                });
            }
        )
    }
});
