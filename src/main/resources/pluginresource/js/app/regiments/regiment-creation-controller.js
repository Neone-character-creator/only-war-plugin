define(function() {
    return function($scope, $state, regimentOptions, regiments, characterService, $q, optionselection, $uibModal, characteroptions, selection) {
        var kitChoices;
        $scope.regimentElements = {
            homeworld: {
                header: "Please Wait...",
                _selected: null,
                set selected(value) {
                    this._selected = angular.copy(value);
                    $scope.reapplyModifiers()
                },
                get selected() {
                    return this._selected;
                }
            },
            commander: {
                header: "Please Wait...",
                _selected: null,
                set selected(value) {
                    this._selected = angular.copy(value);
                    $scope.reapplyModifiers()
                },
                get selected() {
                    return this._selected;
                }
            },
            type: {
                header: "Please Wait...",
                _selected: null,
                set selected(value) {
                    this._selected = angular.copy(value);
                    $scope.reapplyModifiers()
                },
                get selected() {
                    return this._selected;
                }
            },
            'doctrines[0]': {
                header: "Please Wait...",
                _selected: null,
                set selected(value) {
                    this._selected = angular.copy(value);
                    $scope.reapplyModifiers()
                },
                get selected() {
                    return this._selected;
                }
            },
            'doctrines[1]': {
                header: "Please Wait...",
                _selected: null,
                set selected(value) {
                    this._selected = angular.copy(value);
                    $scope.reapplyModifiers()
                },
                get selected() {
                    return this._selected;
                }
            }
        }
        $q.all({
            "origins": regimentOptions.homeworlds(),
            "officers": regimentOptions.officers(),
            "types": regimentOptions.types(),
            "equipment": regimentOptions.equipmentDoctrines(),
            "training": regimentOptions.trainingDoctrines(),
            "regiment kit": regimentOptions.standardRegimentKit(),
            "additional kit choices": regimentOptions.additionalKitChoices(),
            "character options": $q.all({
                "weapons": characteroptions.weapons(),
                "armor": characteroptions.armor(),
                "items": characteroptions.items()
            })
        }).then(function(results) {
            $scope.basicWeapons = results['character options'].weapons.filter(function(weapon) {
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
            $scope.heavyWeapons = results['character options'].weapons.filter(function(weapon) {
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
            $scope.regimentKit = results['regiment kit']['fixed modifiers']['character kit'];
            kitChoices = angular.copy(results["additional kit choices"]);
            $.each(kitChoices, function(i, choice) {
                $.each(choice.effects, function(i, effect) {
                    if (effect.type === "Add" || effect.type === "Replace") {
                        $.each(effect.results, function(i, result) {
                            var placeholder = result;
                            result.item = results['character options'].weapons.find(function(item) {
                                for (var property in placeholder.item) {
                                    if (item[property] !== placeholder.item[property]) {
                                        return false;
                                    }
                                }
                                return true;
                            });
                            if (!result.item) {
                                result.item = results['character options'].items.find(function(item) {
                                    for (var property in placeholder.item) {
                                        if (item[property] !== placeholder.item[property]) {
                                            return false;
                                        }
                                    }
                                    return true;
                                });
                            }
                            if (!result.item) {
                                result.item = results['character options'].armor.find(function(item) {
                                    for (var property in placeholder.item) {
                                        if (item[property] !== placeholder.item[property]) {
                                            return false;
                                        }
                                    }
                                    return true;
                                });
                            }
                        });
                    }
                })
            })
            $scope.regiment = new createdRegiment();
            updateAvailableKitChoices();
            for (var section in $scope.regimentElements) {
                switch (section) {
                    case "homeworld":
                        $scope.regimentElements[section].options = results["origins"];
                        $scope.regimentElements[section].header = "Homeworld/Origin"
                        break;
                    case "commander":
                        $scope.regimentElements[section].options = results["officers"];
                        $scope.regimentElements[section].header = "Commanding Officer"
                        break;
                    case "type":
                        $scope.regimentElements[section].options = results["types"];
                        $scope.regimentElements[section].header = "Regiment Type"
                        break;
                    case "doctrines[0]":
                    case "doctrines[1]":
                        $scope.regimentElements[section].options = results["equipment"].concat(results["training"]);
                        $scope.regimentElements[section].header = "Special Equipment/Training Doctrine"
                        break;

                }
            };
            $scope.reapplyModifiers();
        });

        function updateAvailableKitChoices() {
            $scope.kitChoices = angular.copy(kitChoices.map(function(choice) {
                if (choice.cost > $scope.regiment.remainingKitPoints) {
                    if (!choice.unavailableMessage) {
                        choice.unavailableMessage = "";
                    }
                    choice.unavailableMessage += "\nRequires " + choice.cost + " points but only " + $scope.regiment.remainingKitPoints + " available."
                }
                if (choice.limits) {
                    if (choice.limits.maxSelectCount && choice.limits.MaxSelectCount <= choice.timesSelected) {
                        if (!choice.unavailableMessage) {
                            choice.unavailableMessage = "";
                        }
                        choice.unavailableMessage += "\nAlready selected the maximum number of times."
                    }
                    if (choice.limits.regiment) {
                        if (choice.limits.regiment.type) {
                            if (!$scope.regimentElements.type.selected || $scope.regimentElements.type.selected.name !== choice.limits.regiment.type) {
                                if (!choice.unavailableMessage) {
                                    choice.unavailableMessage = "";
                                }
                                var requiredChoices = choice.limits.regiment.type.slice(0, choice.limits.regiment.type.length - 1).join(', ');
                                requiredChoices += (" or " + choice.limits.regiment.type[choice.limits.regiment.type.length - 1]);
                                choice.unavailableMessage += "\nRequires Regiment Type to be " + requiredChoices + ".";
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
                            var combinedDoctrines = [$scope.regimentElements['doctrines[0]'].selected, $scope.regimentElements['doctrines[1]'].selected];
                            if (combinedDoctrines.length == 0 || combinedDoctrines.find(function(doctrine) {
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

                var mainWeapon = $scope.regiment['fixed modifiers']['character kit']['main weapon'];
                var otherWeapons = $scope.regiment['fixed modifiers']['character kit']['other weapons'];
                var armor = $scope.regiment['fixed modifiers']['character kit']['armor'];
                var otherGear = $scope.regiment['fixed modifiers']['character kit']['other gear'];
                var combinedKit = mainWeapon.concat(otherWeapons).concat(armor).concat(otherGear);

                //Iterate over the kit choices
                var potentialMessage = "";
                var atLeastOneTargetExists = false;
                $.each(choice.effects, function(i, effect) {
                    //Upgrade and Replace are only available if there is an item they can affect in the kit
                    if (effect.type == "Upgrade" || effect.type == "Replace") {
                        var targetExists = false;
                        //Iterate to find possible target items
                        $.each(effect.target, function(i, target) {
                            //Test each item against the effect target.
                            $.each(combinedKit, function(i, item) {
                                targetExists = testItemMatchesTarget(item.item, target);
                                //Continue iteration if no match found yet.
                                return !targetExists;
                            });
                            //Stop iterating if any of the effects can be applied
                            return !targetExists;
                        });
                        //If no targets were found, add to the possible error string.
                        if (!targetExists) {
                            var message;
                            if (effect.target.length == 1) {
                                message = effect.target[0].name;
                            } else {
                                message = effect.target.map(function(target) {
                                    return target.name
                                }).slice(0, effect.target.length - 1).join(', ') + " ";
                                message += " or " + effect.target[effect.target.length - 1] + ".";
                            }
                            potentialMessage += "\nRequires " + message + ".";
                        } else {
                            atLeastOneTargetExists = true;
                            return false;
                        }
                        if (!atLeastOneTargetExists) {
                            if (!choice.unavailableMessage) {
                                choice.unavailableMessage = ""
                            }
                            choice.unavailableMessage += "\n" + potentialMessage;
                        }
                    }
                });
                return choice;
            }));
        }

        $scope.chosenKitModifiers = [];
        $scope.readyToSelectKitModifiers = false;

        $scope.reapplyModifiers = function() {
            var favoredWeapons = $scope.regiment['fixed modifiers']['favored weapons'];
            $scope.regiment = new createdRegiment();
            $scope.regiment['fixed modifiers']['favored weapons'] = favoredWeapons;
            for (var regimentModifierSection in $scope.regimentElements) {
                if ($scope.regimentElements[regimentModifierSection].selected) {
                    $scope.regiment.remainingRegimentPoints -= $scope.regimentElements[regimentModifierSection].selected.cost;
                    $scope.regiment.addModifier($scope.regimentElements[regimentModifierSection].selected);
                }
            }
            $scope.readyToSelectEquipment = $scope.regimentElements['homeworld'] &&
                $scope.regimentElements['commander'] &&
                $scope.regimentElements['type'];
            $scope.regiment.remainingKitPoints = 30 + $scope.regiment.remainingRegimentPoints * 2;
            checkReadyToSelectKitModifiers();
        }

        $scope.$watchCollection("regiment['fixed modifiers']['favored weapons']", function(newVal, oldVal) {
            checkReadyToSelectKitModifiers();
            isRegimentCreationComplete();
        });

        $scope.$watchCollection("regimentElements.homeworld.selected['optional modifiers']", function() {
            isRegimentCreationComplete();
        });
        $scope.$watchCollection("regimentElements.commander.selected['optional modifiers']", function() {
            isRegimentCreationComplete();
        });
        $scope.$watchCollection("regimentElements.type.selected['optional modifiers']", function() {
            isRegimentCreationComplete();
        });
        $scope.$watch("regiment.name", function() {
            isRegimentCreationComplete();
        });

        $scope.$watchGroup(["regimentElements.homeworld.selected",
            "regimentElements.commander.selected",
            "regimentElements.type.selected"
        ], function() {
            checkReadyToSelectKitModifiers();
            isRegimentCreationComplete();
        })

        function checkReadyToSelectKitModifiers() {
            if ($scope.regiment) {
                var ready = $scope.regimentElements.homeworld.selected !== null;
                ready = $scope.regimentElements.commander.selected !== null && ready;
                ready = $scope.regimentElements.type.selected !== null && ready;
                ready = $scope.regiment['fixed modifiers']['favored weapons'].length == 2 && ready;
                $scope.readyToSelectKitModifiers = ready;
            }
        }

        function isRegimentCreationComplete() {
            if ($scope.regiment) {
                //Regiment is finished if it has a selected homeworld, commander and type and each has no optional modifiers left and has selected favored weapons and name.
                var nameReady = $scope.regiment.name !== undefined;
                var homeworldReady = $scope.regimentElements.homeworld.selected !== null &&
                    (!$scope.regimentElements.homeworld.selected['optional modifiers'] ||
                        $scope.regimentElements.homeworld.selected['optional modifiers'].filter(function(e) {
                            return e['selection time'] === "regiment"
                        }).length === 0);
                var commanderReady = $scope.regimentElements.commander.selected !== null &&
                    (!$scope.regimentElements.commander.selected['optional modifiers'] ||
                        $scope.regimentElements.commander.selected['optional modifiers'].filter(function(e) {
                            return e['selection time'] === "regiment"
                        }).length === 0);
                var typeReady = $scope.regimentElements.type.selected !== null &&
                    (!$scope.regimentElements.type.selected['optional modifiers'] ||
                        $scope.regimentElements.type.selected['optional modifiers'].filter(function(e) {
                            return e['selection time'] === "regiment"
                        }).length === 0);
                var favoredWeaponsReady = $scope.regiment['fixed modifiers']['favored weapons'].length === 2;
                $scope.isRegimentCreationComplete = homeworldReady && commanderReady && typeReady && favoredWeaponsReady && nameReady;
            }
        }

        function createdRegiment() {
            this.isCustom = true;
            this['fixed modifiers'] = {
                'character kit': angular.copy($scope.regimentKit),
                'favored weapons': []
            };
            this['optional modifiers'] = [];
            this.addModifier = function(modifier) {
                //Needed for scoping issues
                var regiment = this;
                for (var property in modifier['fixed modifiers']) {
                    if (modifier['fixed modifiers'].hasOwnProperty(property)) {
                        switch (property) {
                            case "characteristics":
                                if (!regiment['fixed modifiers'][property]) {
                                    regiment['fixed modifiers'].characteristics = {}
                                }
                                for (var characteristic in modifier['fixed modifiers']["characteristics"]) {
                                    if (regiment['fixed modifiers'].characteristics.characteristic) {
                                        regiment['fixed modifiers'].characteristics[characteristic] += modifier['fixed modifiers'][property][characteristic];
                                    } else {
                                        regiment['fixed modifiers'].characteristics[characteristic] = modifier['fixed modifiers'][property][characteristic];
                                    }
                                }
                                break;

                            case "skills":
                                if (!regiment['fixed modifiers'][property]) {
                                    regiment['fixed modifiers'].skills = {};
                                }
                                var incomingSkills = modifier['fixed modifiers']['skills'];
                                for (var skill in incomingSkills) {
                                    var existingSkill = regiment['fixed modifiers'].skills[skill.name];
                                    if (existingSkill) {
                                        existingSkill.advancements = existingSkill.advancements() + incomingSkills[skill];
                                    } else {
                                        regiment['fixed modifiers'].skills[skill] = incomingSkills[skill];
                                    }
                                }
                                break;
                            case "talents":
                                if (!regiment['fixed modifiers'][property]) {
                                    regiment['fixed modifiers'][property] = [];
                                }
                                var incomingTalents = modifier['fixed modifiers']['talents'];
                                for (var i = 0; i < incomingTalents.length; i++) {
                                    regiment['fixed modifiers'].talents.push(incomingTalents[i]);
                                }
                                break;
                            case "aptitudes":
                                if (!regiment['fixed modifiers'][property]) {
                                    regiment['fixed modifiers'][property] = [];
                                }
                                var incomingAptitudes = modifier['fixed modifiers']['aptitudes'];
                                regiment['fixed modifiers'].aptitudes.push(incomingAptitudes);
                                break;
                            case "starting power experience":
                                regiment['fixed modifiers'][property] += modifier['fixed modifiers']['starting power experience'];
                                break;
                            case "psy rating":
                                if (regiment['fixed modifiers'][property]) {
                                    console.log(modifier.name + " tried to set the psy rating, but it's already set.")
                                }
                                regiment['fixed modifiers'][property] = modifier['fixed modifiers']['psy rating'];
                                break;
                            case "special abilities":
                                if (regiment['fixed modifiers']['special abilities']) {
                                    regiment['fixed modifiers']['special abilities'] = regiment['fixed modifiers']['special abilities'].concat(modifier['fixed modifiers']['special abilities']);
                                } else {
                                    regiment['fixed modifiers']['special abilities'] = modifier['fixed modifiers']['special abilities'];
                                }
                                break;
                            case "character kit":
                                if (!regiment['fixed modifiers']['character kit']) {
                                    regiment['fixed modifiers']['character kit'] = {};
                                }
                                for (var category in modifier['fixed modifiers']['character kit']) {
                                    if (!regiment['fixed modifiers']['character kit'][category]) {
                                        regiment['fixed modifiers']['character kit'][category] = [];
                                    }
                                    $.each(modifier['fixed modifiers']['character kit'][category], function(index, element) {
                                        var existingItem = regiment['fixed modifiers']['character kit'][category].find(function(item) {
                                            return angular.equals(element.item, item);
                                        });
                                        if (existingItem) {
                                            element.count++;
                                        } else {
                                            regiment['fixed modifiers']['character kit'][category].push(element);
                                        }
                                    });
                                }
                                break;
                            case "regiment kit points":
                                regiment['fixed modifiers'].kitPoints = modifier['fixed modifiers']['regiment kit points'];
                                break;
                        }
                    }
                }
                if (modifier['optional modifiers']) {
                    for (var optionalModifier in modifier['optional modifiers'].filter(function(e) {
                            return e['selection time'] === "regiment"
                        })) {
                        this['optional modifiers'].push(optionalModifier);
                    }
                }
            };
            this.remainingRegimentPoints = 12;
            this.remainingKitPoints = this['fixed modifiers']['regiment kit points'] ? this['fixed modifiers']['regiment kit points'] : 0 + this.remainingRegimentPoints * 2;
        };

        $scope.openSelectionModal = function(selectedObject, modifier) {
            selection.selectionObject = selectedObject;
            $uibModal.open({
                controller: "SelectionModalController",
                templateUrl: 'pluginresource/templates/selection-modal.html'
            }).result.then(function() {
                optionselection.target = modifier;
                optionselection.selected = selection.selected;
                optionselection.selectionObject = selectedObject;
                optionselection.associatedService = {
                    selected: function() {
                        return modifier;
                    },
                    remainingSelections: function() {
                        return modifier['optional modifiers'];
                    },
                    complete: function() {
                        return modifier && _remainingSelections.length === 0;
                    },
                    select: function(modifier) {
                        _selected = angular.copy(modifier);
                    }
                };
                optionselection.applySelection();
                $scope.reapplyModifiers();
            });
        };

        $scope.finish = function() {
            if ($scope.regiment.remainingRegimentPoints >= 0 &&
                $scope.regiment.remainingKitPoints >= 0 &&
                $scope.regimentElements['homeworld'].selected &&
                $scope.regimentElements['type'].selected &&
                $scope.regimentElements['commander'].selected
            ) {
                regiments.selected = $scope.regiment;
                $state.go("regiment");
            }
        };

		//Apply the effects of the given kit modifier to the regimental kit.
        $scope.applyKitModifier = function(modifier) {
            $.each(modifier.effects, function(i, effect) {
                switch (effect.type) {
                    case "Replace": {
                    	//Get all the items that will be removed
                        var itemsToRemove = effect.affectedItems;
                        //Find where each item is located and remove them
                        $.each($scope.regiment['fixed modifiers']['character kit']['main weapon'], function(i, weapons){

                        });
                        break;
                    }
                    case "Upgrade": {
                        //Find all the target items and apply the effects
                        $.each(selection.selected, function(i, selected) {
                            //Upgrade only upgrades a single instance of an item, if the selected item has more than one, move 1 into a separate item and modify the separate one.
                            var copy = selected.value;
                            if (copy.count > 1) {
                                selection.value.count--;
                                copy = angular.copy(selection.value);
                                copy.count = 1;
                            }
                            //Apply the upgrades
                            $.each(effect.effectsToApply, function(i, upgrade) {
                                for (var property in upgrade) {
                                    selected.value.item[property] = upgrade[property]
                                }
                            });
                        })
                        break;
                        }
                    case "Add":
                        var existingItem = false;
                        $.each($scope.regiment['fixed modifiers']['character kit'][effect.target], function(i, item) {
                            if (angular.equals(item.item, selection.item)) {
                                item.count += selection.count;
                                existingItem = true;
                                return false;
                            }
                        });
                        if (!existingItem) {
                            $scope.regiment['fixed modifiers']['character kit'][effect.target].push(selection);
                        }
                        break;
                }
            });
        }

		//Make any selections for the given kit modifier and add it to the chosen modifiers.
        $scope.addKitModifier = function(choice) {
            //Keep track of all the effects that will be applied at the end
            var effectsToApply = [];
            var modals;
            //Iterate over each of the effects of the chosen modifier
            $.each(choice.effects, function(index, effect) {
                    //Array containing all items that are eligible at targets for the effect.
                    switch (effect.type) {
                        //Replace an object with a completely new item
                        case "Replace":
                            //Replace the properties of an item with those contained in the effect
                        case "Upgrade": {
                            var eligibleItems = [];
                            //Iterate over the items in each of the kit sections and if they match the effect target, add them to the eligible items
                            var combinedItems = $scope.regiment['fixed modifiers']['character kit']['main weapon']
                            	.concat($scope.regiment['fixed modifiers']['character kit']['other weapons'])
                            	.concat($scope.regiment['fixed modifiers']['character kit']['armor'])
                            	.concat($scope.regiment['fixed modifiers']['character kit']['other gear']);
                            for (var i = 0; i < combinedItems.length; i++) {
                                var meetsCondition = true;
                                $.each(effect.target, function(index, target) {
                                    if (!testItemMatchesTarget(combinedItems[i].item, target)) {
                                        meetsCondition = false;
                                    }
                                });
                                if (meetsCondition) {
                                    eligibleItems.push({
                                        "section": "main weapon",
                                        "value": combinedItems[i]
                                    });
                                };
                            };

                            //Create the selection object with the eligible items
                            selection.selectionObject = {
                                selections: 1,
                                options: eligibleItems
                            };
                            //Open the modal
                            var currentModal = $uibModal.open({
                                controller: "SelectionModalController",
                                templateUrl: "pluginresource/templates/selection-modal.html"
                            });
                            //Chain all the modal results together. This allows waiting for all the modals to complete
                            //successfully before applying any of their results, in case the user cancels in the middle.
                            if (!modals) {
                                modals = currentModal.result;
                            } else {
                                modals = modals.then(currentModal.result);
                            }
                            //After closing the current modal, add its effect to the effects to be applied at the end.
                            currentModal.result.then(function() {
                                effectsToApply.push({
                                	//The items that will be modified/replaced
                                    affectedItems: selection.selected,
                                    //The replacement items/upgrades that will be applied
                                    effectsToApply: effect.results,
                                    type : effect.type
                                });
                            });
                            break;
                            }
                            //Add one or more new items to the kit
                        case "Add":
                            //Get the selected targets from the selection service and save them to be applied later.
                            effectsToApply.push({
                                effectsToApply: effect,
                                type : effect.type
                            });
                            break;
                            //Add an item of a particular availability to the kit
                        case "AddAvailability":
                            break;
                            //Add one of the regiments favored weapons to the kit
                        case "AddFavored":
                    };
                })
                //Application function
            modals.then(function(result) {
                choice.effects = effectsToApply;
                $scope.chosenKitModifiers.push(choice);
                $scope.applyKitModifier(choice);
                choice.timesSelected++;
                $scope.regiment.remainingKitPoints -= choice.cost;
                updateAvailableKitChoices();
            })
        };

        $scope.removeKitModifier = function(modifier) {
            var mainWeapon = $scope.regiment['fixed modifiers']['character kit']['main weapon'];
            var otherWeapons = $scope.regiment['fixed modifiers']['character kit']['other weapons'];
            var armor = $scope.regiment['fixed modifiers']['character kit']['armor'];
            var otherGear = $scope.regiment['fixed modifiers']['character kit']['other gear'];
            $.each(modifier.affectedItems, function(i, item) {
                switch (item.original.section) {
                    case "main weapon":
                        mainWeapon.splice(mainWeapon.indexOf(item.final), 1, item.original.value);
                        break;
                    case "other weapons":
                        break;
                    case "armor":
                        break;
                    case "other gear":
                        break;
                }
                if (item.original) {

                }
            });
            $scope.chosenKitModifiers.splice($scope.chosenKitModifiers.indexOf(modifier), 1);
            $scope.regiment.remainingKitPoints += modifier.cost;
            updateAvailableKitChoices();
        };

        //See if the properties on the given object match those of the given target object
        function testItemMatchesTarget(item, target) {
            for (var property in target) {
                if (item[property] !== target[property]) {
                    return false;
                };
            }
            return true;
        };

        //Filters creation options so that items with too high a cost are hidden
        $scope.costFilter = function(item) {
            return item.cost <= $scope.regiment.remainingRegimentPoints;
        }
    }
});