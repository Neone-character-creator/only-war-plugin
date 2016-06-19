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
            $scope.kitChoices = kitChoices.filter(function(choice) {
                var isAvailable = (choice.cost <= $scope.regiment.remainingKitPoints);
                if (isAvailable) {
                    var mainWeapon = $scope.regiment['fixed modifiers']['character kit']['main weapon'];
                    var otherWeapons = $scope.regiment['fixed modifiers']['character kit']['other weapons'];
                    var armor = $scope.regiment['fixed modifiers']['character kit']['armor'];
                    var otherGear = $scope.regiment['fixed modifiers']['character kit']['other gear'];
                    var combinedKit = mainWeapon.concat(otherWeapons).concat(armor).concat(otherGear);

                    //Iterate over the kit choices
                    $.each(choice.effects, function(i, effect) {
                        //Upgrade and Replace are only available if there is an item they can affect in the kit
                        if (effect.type == "Upgrade" || effect.type == "Replace") {
                            var targetExists = false;
                            //Iterate over the effects to find possible target items
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
                            //Mark this choice as available if targets exist
                            isAvailable = targetExists;
                        }
                    });
                }
                return isAvailable;
            });
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

        $scope.$watchCollection("regiment['fixed modifiers']['favored weapons']", function(newVal, oldVal){
        	checkReadyToSelectKitModifiers();
        	isRegimentCreationComplete();
        });

        $scope.$watchCollection("regimentElements.homeworld.selected['optional modifiers']", function(){
        	isRegimentCreationComplete();
        });
        $scope.$watchCollection("regimentElements.commander.selected['optional modifiers']", function(){
        	isRegimentCreationComplete();
        });
        $scope.$watchCollection("regimentElements.type.selected['optional modifiers']", function(){
        	isRegimentCreationComplete();
        });
        $scope.$watch("regiment.name", function(){
        	isRegimentCreationComplete();
        });

        $scope.$watchGroup(["regimentElements.homeworld.selected",
        					"regimentElements.commander.selected",
        					"regimentElements.type.selected"], function(){
        	checkReadyToSelectKitModifiers();
        	isRegimentCreationComplete();
		})

        function checkReadyToSelectKitModifiers(){
        	if($scope.regiment){
        		var ready = $scope.regimentElements.homeworld.selected !== null;
        		ready = $scope.regimentElements.commander.selected  !== null && ready;
        		ready = $scope.regimentElements.type.selected  !== null && ready;
        		ready = $scope.regiment['fixed modifiers']['favored weapons'].length == 2 && ready;
				$scope.readyToSelectKitModifiers = ready;
			}
        }

        function isRegimentCreationComplete(){
        	if($scope.regiment){
        		//Regiment is finished if it has a selected homeworld, commander and type and each has no optional modifiers left and has selected favored weapons and name.
        		var nameReady = $scope.regiment.name !== undefined;
        		var homeworldReady = $scope.regimentElements.homeworld.selected !== null
        			&& (!$scope.regimentElements.homeworld.selected['optional modifiers']
        			|| $scope.regimentElements.homeworld.selected['optional modifiers'].filter(function(e){return e['selection time'] === "regiment"}).length === 0);
        		var commanderReady = $scope.regimentElements.commander.selected !== null
        			&& (!$scope.regimentElements.commander.selected['optional modifiers']
        			|| $scope.regimentElements.commander.selected['optional modifiers'].filter(function(e){return e['selection time'] === "regiment"}).length === 0);
        		var typeReady = $scope.regimentElements.type.selected !== null
        			&& (!$scope.regimentElements.type.selected['optional modifiers']
        			|| $scope.regimentElements.type.selected['optional modifiers'].filter(function(e){return e['selection time'] === "regiment"}).length === 0);
        		var favoredWeaponsReady = $scope.regiment['fixed modifiers']['favored weapons'].length === 2;
        		$scope.isRegimentCreationComplete =  homeworldReady && commanderReady && typeReady && favoredWeaponsReady && nameReady;
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
                if(modifier['optional modifiers']){
	                for (var optionalModifier in modifier['optional modifiers'].filter(function(e){return e['selection time'] === "regiment"})) {
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

        $scope.applyKitModifier = function(choice) {
            //Iterate over each of the effects of the chosen modifier
            $.each(choice.effects, function(index, choiceEffect) {
                //Keep all of the items that this effect can apply to.
                var eligible = [];
                switch (choiceEffect.type) {
                    //Replace an object with a completely new item
                    case "Replace":
                        //Change the properties of an item
                    case "Upgrade":
                        //Iterate over the items in each of the kit sections and if they match the target, add them to the array of eligible items
                        var mainWeapon = $scope.regiment['fixed modifiers']['character kit']['main weapon'];
                        for (var i = 0; i < mainWeapon.length; i++) {
                            var meetsCondition = true;
                            $.each(choiceEffect.target, function(index, target) {
                                if (!testItemMatchesTarget(mainWeapon[i].item, target)) {
                                    meetsCondition = false;
                                }
                            });
                            if (meetsCondition) {
                                eligible.push({
                                    "section": "main weapon",
                                    "value": mainWeapon[i]
                                });
                            };
                        };
                        var otherWeapons = $scope.regiment['fixed modifiers']['character kit']['other weapons'];
                        for (var i = 0; i < otherWeapons.length; i++) {
                            var meetsCondition = true;
                            $.each(choiceEffect.target, function(index, target) {
                                if (!testItemMatchesTarget(otherWeapons[i].item, target)) {
                                    meetsCondition = false;
                                }
                            });
                            if (meetsCondition) {
                                eligible.push({
                                    "section": "other weapons",
                                    "value": otherWeapons[i]
                                });
                            }
                        }
                        var armor = $scope.regiment['fixed modifiers']['character kit']['armor'];
                        for (var i = 0; i < armor.length; i++) {
                            var meetsCondition = true;
                            $.each(choiceEffect.target, function(index, target) {
                                if (!testItemMatchesTarget(armor[i].item, target)) {
                                    meetsCondition = false;
                                }
                            });
                            if (meetsCondition) {
                                eligible.push({
                                    "section": "armor",
                                    "value": armor[i]
                                });
                            }
                        }
                        var otherGear = $scope.regiment['fixed modifiers']['character kit']['other gear'];
                        for (var i = 0; i < otherGear.length; i++) {
                            var meetsCondition = true;
                            $.each(choiceEffect.target, function(index, target) {
                                if (!testItemMatchesTarget(otherGear[i].item, target)) {
                                    meetsCondition = false;
                                }
                            });
                            if (meetsCondition) {
                                eligible.push({
                                    "section": "other gear",
                                    "value": otherGear[i]
                                });
                            }
                        }
                        selection.selectionObject = {
                            selections: 1,
                            options: eligible
                        };
                        break;
                        //Add a completely new item to the kit
                    case "Add":
                        $.each(choice.effects, function(i, effect) {
                            $.each(effect.results, function(i, result) {
                                eligible.push(result);
                            });
                        });
                        selection.selected = eligible;
                        break;
                        //Add an item of a particular availability to the kit
                    case "AddAvailability":
                        break;
                        //Add one of the regiments favored weapons to the kit
                    case "AddFavored":
                };
                var apply = function() {
                    choice.choiceCount = choice.choiceCount ? choice.choiceCount + 1 : 1;
                    var result = {
                        description: choice.description,
                        itemEffects: []
                    };
                    //For each selected choice
                    $.each(selection.selected, function(index, selection) {
                        switch (choiceEffect.type) {
                            case "Replace":
                                var replacement = choiceEffect.results;
                                //Find all the upgrades that have been applied to the selected item from other kit modifiers
                                var upgradesToSelectedItem = $scope.chosenKitModifiers.reduce(function(previous, current, currentIndex, array) {
                                    return previous.concat(current.itemEffects);
                                }, []);
                                upgradesToSelectedItem = upgradesToSelectedItem.filter(function(effect) {
                                    return angular.equals(effect.affected, selection.value);
                                });
                                //Apply all the upgrades to the replacement item, in reverse order because they are stored in FILO order.
                                $.each(upgradesToSelectedItem.reverse(), function(i, upgrade) {
                                    for (var property in upgrade.upgrade) {
                                        $.each(replacement, function(i, replacementItem) {
                                            replacementItem.item[property] = upgrade.upgrade[property];
                                        });
                                    };
                                    upgrade.original = angular.copy(replacement);
                                    upgrade.affected = replacement;
                                });
                                //Remove the selected item and add the replacement item in its place
                                switch (selection.section) {
                                    case "main weapon":
                                        mainWeapon.splice(mainWeapon.indexOf(selection.value), 1, replacement);
                                        break;
                                    case "other weapons":
                                        otherWeapons.splice(mainWeapon.indexOf(selection.value), 1, replacement);
                                        break;
                                    case "armor":
                                        armor.splice(mainWeapon.indexOf(selection.value), 1, replacement);
                                        break;
                                    case "other gear":
                                        otherGear.splice(mainWeapon.indexOf(selection.value), 1, replacement);
                                        break;
                                }
                                break;
                            case "Upgrade":
                                $.each(choiceEffect.results, function(i, effect) {
                                    //Upgrade only upgrades a single instance of an item, if the selected item has multiples, move 1 into a separate item and modify the separate one.
                                    var copy = selection.value;
                                    if (copy.count > 1) {
                                        selection.value.count--;
                                        copy = angular.copy(selection.value);
                                        copy.count = 1;
                                    }
                                    result.itemEffects.push({
                                        "original": angular.copy(copy),
                                        "effectType": choiceEffect.type,
                                        "upgrade": effect,
                                        "affected": copy
                                    });
                                    //Apply the upgrade
                                    for (var property in effect) {
                                        selection.value.item[property] = effect[property]
                                    }
                                })
                                break;
                            case "Add":
                                var existingItem = false;
                                $.each($scope.regiment['fixed modifiers']['character kit'][choiceEffect.target], function(i, item) {
                                    if (angular.equals(item.item, selection.item)) {
                                        item.count += selection.count;
                                        existingItem = true;
                                        return false;
                                    }
                                });
                                if (!existingItem) {
                                    $scope.regiment['fixed modifiers']['character kit'][choiceEffect.target].push(selection);
                                }
                                break;
                        }
                    });
                    $scope.chosenKitModifiers.push(result);
                }
                switch (choiceEffect.type) {
                    case "Replace":
                    case "Upgrade":
                        $uibModal.open({
                            controller: "SelectionModalController",
                            templateUrl: "pluginresource/templates/selection-modal.html"
                        }).result.then(apply);
                        break;
                    default:
                        apply();
                }
            })
            $scope.regiment.remainingKitPoints -= choice.cost;
            updateAvailableKitChoices();
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

        $scope.costFilter = function(item) {
            return item.cost <= $scope.regiment.remainingRegimentPoints;
        }
    }
})