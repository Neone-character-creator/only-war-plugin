define(function() {
    return function($scope, $state, regimentOptions, regiments, characterService, $q, optionselection, $uibModal, characteroptions, selection) {
        var kitChoices;
        /**
        The chosen elements for regiment creation: the homeworld, commanding officer, regiment type and between 0 and 2
        special equipment and/or training doctrines.

        The homeworld, commander, type and favored weapons are all required to be selected, and all optional items they
        define that must be determined at regiment creation time chosen, to complete the regiment.
        */
        function regimentElementEntry(){
        	this.header = "Please Wait...";
        	this._selected = null;
        };
        regimentElementEntry.prototype = {
                		set selected(value) {
                			this._selected = angular.copy(value);
                			if(value){
                				switch(value.name){
                					case "Hardened Fighters":{
        		        				selection.selectionObject = {
        	        					selections : 1,
            	    					options : [
                							{
        	        							"index" : 0,
        	        							"description" : "Replace standard melee weapon with a Common or more Availability melee weapon"
        	        						},
        		        					{
                								"index" : 1,
                								"description" : "Upgrade standard melee weapon with the Mono upgrade"
                							}
                						]
                					};
        	        					$uibModal.open({
                					controller : "SelectionModalController",
                					templateUrl : "pluginresource/templates/selection-modal.html"
                				}).result.then(function(){
        		        					var result = selection.selected[0];
        		        					switch(result.index){
                						case 0:
                							//Choose one Melee weapon of Common or higher availability.
                							selection.selectionObject = {
                								selections: 1,
                								options: $scope.equipment.weapons.filter(function(weapon){
                									return weapon.class === "Melee"
                										&& (weapon.availability === "Common"
                											|| weapon.availability == "Plentiful"
                											|| weapon.availability == "Abundant"
                											|| weapon.availability == "Ubiquitous")
                								}).map(function(weapon){
                									return {
                										weapon:weapon,
                										description : weapon.name
                									}
                								})
                							};
                							$uibModal.open({
                								controller : "SelectionModalController",
                								templateUrl : "pluginresource/templates/selection-modal.html"
                							}).result.then(function(){
                								//Add selected melee weapon, laspistol + 2 charg packs as main weapons
                								selection.selected[0]['main weapon'] = true;
                								var additions = [
                									{
                										count : 1,
                										item : $scope.equipment.weapons.find(function(weapon){
                											return weapon.name == "Laspistol"
                										})
                									},
                									{
                										count : 1,
                										item : $scope.equipment.items.find(function(item){
                											return item.name == "Charge Pack (Pistol)"
                										})
                									},
                									{
                										count : 1,
                										item : selection.selected[0]
                									}
                								].forEach(function(item){item['main weapon'] = true;})
                								$regiment['fixed modifiers']['character kit']
                									= $regiment['fixed modifiers']['character kit'].filter(function(item){
                										return !item['main weapon'];
                									}).concat(additions);
                							});
                							break;
                						case 1:
                							var standardMeleeWeapon = $scope.regiment['fixed modifiers']['character kit'].find(function(item){
                								return item['standard melee weapon'];
                							});
                							if(!standardMeleeWeapon.item.upgrades){
                								standardMeleeWeapon.item.upgrades = [];
                							}
                							standardMeleeWeapon.item.upgrades.push("Mono");
                							break;
                					}
        	    	    				});
            	    					break;
            	    				}
                					case "Warrior Weapons":{
                					selection.selectionObject = {
                						selections : 1,
                						options : $scope.equipment.weapons.filter(function(weapon){
                							return weapon.class === "Low-Tech"
                								&& (weapon.availability === "Common"
                								|| weapon.availability == "Plentiful"
                								|| weapon.availability == "Abundant"
                								|| weapon.availability == "Ubiquitous")
                						})
                					};
                					$uibModal.open({
                						controller : "SelectionModalController",
                						templateUrl : "pluginresource/templates/selection-modal.html"
                					}).result.then(function(){
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
            doctrine2:new regimentElementEntry()
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
        	$scope.equipment = results['character options'];
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
                switch (choice.effect.type) {
                    case "Add":
                    case "Replace":
                        {
                            $.each(choice.effect.results, function(i, result) {
                                var placeholder = angular.copy(result);
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
                            break;
                        }
                    case "AddAvailability":
                        {
                            var targetAvailability = choice.effect.target;
                            var options = results['character options']['items']
                                .filter(function(item) {
                                    return item.availability === targetAvailability;
                                }).map(function(item) {
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
                    case "doctrine1":
                    case "doctrine2":
                        $scope.regimentElements[section].options = results["equipment"].concat(results["training"]);
                        $scope.regimentElements[section].header = "Special Equipment/Training Doctrine"
                        break;

                }
            };
            reapplyModifiers();
        });

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
            $scope.kitChoices = angular.copy(kitChoices.map(function(choice) {
                choice.unavailableMessage = undefined;
                if (choice.cost > $scope.regiment.remainingKitPoints) {
                    if (!choice.unavailableMessage) {
                        choice.unavailableMessage = "";
                    }
                    choice.unavailableMessage += "\nRequires " + choice.cost + " points but only " + $scope.regiment.remainingKitPoints + " available."
                }
                var timesSelected = 0;
                if ($scope.kitChoices) {
                    timesSelected = $scope.chosenKitModifiers.filter(function(previousChoice) {
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
                                if(choice.limits.regiment.type.length > 1){
                                	var requiredChoices = choice.limits.regiment.type.slice(0, choice.limits.regiment.type.length - 1).join(', ');
                                	requiredChoices += (" or " + choice.limits.regiment.type[choice.limits.regiment.type.length - 1]);
                                } else {
                                	var requiredChoices = choice.limits.regiment.type[0];
                                }
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
                            var combinedDoctrines = [$scope.regimentElements.doctrine1.selected, $scope.regimentElements.doctrine2.selected];
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

                var equipment = $scope.regiment['fixed modifiers']['character kit'];

                //Iterate over the kit choices
                var potentialMessage = "";
                var atLeastOneTargetExists = false;
                //Upgrade and Replace are only available if there is an item they can affect in the kit
                if (choice.effect.type == "Upgrade" || choice.effect.type == "Replace") {
                    var targetExists = false;
                    //Iterate to find possible target items
                    $.each(choice.effect.target, function(i, target) {
                        //Test each item against the effect target.
                        $.each(equipment, function(i, item) {
                            targetExists = testItemMatchesTarget(item.item, target);
                            //Continue iteration if no match found yet.
                            return !targetExists;
                        });
                        //Stop iterating if any of the effects can be applied
                        return !targetExists;
                    });
                    //If no targets were found, add to the possible error string.
                    if (!targetExists) {
                        var message = "item with ";
                        $.each(choice.effect.target, function(i, target){
                        	for(var property in target){
                        		message += property +": " + target[property] + ". ";
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
            $.each($scope.chosenKitModifiers, function(i, chosenModifier) {
                $scope.applyKitModifier(chosenModifier);
            });
            checkReadyToSelectKitModifiers();
        }
        /**
        These watches track the required values for determining when it is possible to complete the creation of the
        regiment and when the player is allowed to choose kit modifiers.
        */
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
        });
        $scope.$watchGroup(["regimentElements.homeworld.selected",
            "regimentElements.commander.selected",
            "regimentElements.type.selected",
            "regimentElements.doctrine1",
            "regimentElements.doctrine2"
        ], function() {
            $scope.chosenKitModifiers = $scope.chosenKitModifiers.filter(function(choice) {
                return choice.type !== "Replace" && choice.type !== "Upgrade";
            });
        });

        function checkReadyToSelectKitModifiers() {
            if ($scope.regiment) {
                var ready = $scope.regimentElements.homeworld.selected !== null;
                ready = $scope.regimentElements.commander.selected !== null && ready;
                ready = $scope.regimentElements.type.selected !== null && ready;
                ready = $scope.regiment['fixed modifiers']['favored weapons'].length == 2 && ready;
                $scope.readyToSelectKitModifiers = ready;
            }
            if ($scope.readyToSelectEquipment) {
                updateAvailableKitChoices();
            }
        }

        function isRegimentCreationComplete() {
            if ($scope.regiment) {
                //Regiment is finished if it has a selected homeworld, commander and type, each has no optional modifiers left, and has selected favored weapons and name.
                var nameReady = $scope.regiment.name !== undefined;
                var homeworldReady = $scope.regimentElements.homeworld.selected &&
                    (!$scope.regimentElements.homeworld.selected['optional modifiers'] ||
                        $scope.regimentElements.homeworld.selected['optional modifiers'].filter(function(e) {
                            return e['selection time'] === "regiment"
                        }).length === 0);
                var commanderReady = $scope.regimentElements.commander.selected &&
                    (!$scope.regimentElements.commander.selected['optional modifiers'] ||
                        $scope.regimentElements.commander.selected['optional modifiers'].filter(function(e) {
                            return e['selection time'] === "regiment"
                        }).length === 0);
                var typeReady = $scope.regimentElements.type.selected &&
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
                                {
                                    if (!regiment['fixed modifiers'][property]) {
                                        regiment['fixed modifiers'].characteristics = {}
                                    }
                                    for (var characteristic in modifier['fixed modifiers']["characteristics"]) {
                                        if (regiment['fixed modifiers'].characteristics[characteristic]) {
                                            regiment['fixed modifiers'].characteristics[characteristic] += modifier['fixed modifiers'][property][characteristic];
                                        } else {
                                            regiment['fixed modifiers'].characteristics[characteristic] = modifier['fixed modifiers'][property][characteristic];
                                        }
                                    }
                                    break;
                                }
                            case "skills":
                                {
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
                                }
                            case "talents":
                                {
                                    if (!regiment['fixed modifiers'][property]) {
                                        regiment['fixed modifiers'][property] = [];
                                    }
                                    var incomingTalents = modifier['fixed modifiers']['talents'];
                                    for (var i = 0; i < incomingTalents.length; i++) {
                                        regiment['fixed modifiers'].talents.push(incomingTalents[i]);
                                    }
                                    break;
                                }
                            case "aptitudes":
                                {
                                    if (!regiment['fixed modifiers'][property]) {
                                        regiment['fixed modifiers'][property] = [];
                                    }
                                    var incomingAptitudes = modifier['fixed modifiers']['aptitudes'];
                                    regiment['fixed modifiers'].aptitudes = regiment['fixed modifiers'].aptitudes.concat(incomingAptitudes);
                                    break;
                                }
                            case "starting power experience":
                                {
                                    regiment['fixed modifiers'][property] += modifier['fixed modifiers']['starting power experience'];
                                    break;
                                }
                            case "psy rating":
                                {
                                    if (regiment['fixed modifiers'][property]) {
                                        console.log(modifier.name + " tried to set the psy rating, but it's already set.")
                                    }
                                    regiment['fixed modifiers'][property] = modifier['fixed modifiers']['psy rating'];
                                    break;
                                }
                            case "special abilities":
                                {
                                    if (regiment['fixed modifiers']['special abilities']) {
                                        regiment['fixed modifiers']['special abilities'] = regiment['fixed modifiers']['special abilities'].concat(modifier['fixed modifiers']['special abilities']);
                                    } else {
                                        regiment['fixed modifiers']['special abilities'] = modifier['fixed modifiers']['special abilities'];
                                    }
                                    break;
                                }
                            case "character kit":
                                {
                                    if (!regiment['fixed modifiers']['character kit']) {
                                        regiment['fixed modifiers']['character kit'] = {};
                                    }
                                    for (var category in modifier['fixed modifiers']['character kit']) {
                                        if (category == "main weapon" ||
                                            category == "armor" ||
                                            !regiment['fixed modifiers']['character kit'][category]) {
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
                                }
                            case "regiment kit points":
                                {
                                    regiment['fixed modifiers'].kitPoints = modifier['fixed modifiers']['regiment kit points'];
                                    break;
                                }
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
                reapplyModifiers();
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
            switch (modifier.effect.type) {
                case "Replace":
                    {
                    	$.each(modifier.effect.target, function(i, target){
                        	var targetIndex = target.section.indexOf(target.value);
                        	target.section.splice(targetIndex, 1);
                        	$.each(modifier.effect.results, function(i, result) {
                        		target.section.push(result);
                        	});
                        });

                        break;
                    }
                case "Upgrade":
                    {
                        $.each(modifier.effect.results, function(i, result) {
                            for (var property in result) {
                                target.value.item[property] = result[property];
                            }
                        });
                        break;
                    }
                case "Add":
                    var target = $scope.regiment['fixed modifiers']['character kit'][modifier.effect.target];
                    var existingItem;
                    $.each(target, function(i, item) {
                        if (angular.equals(item.item, result.item)) {
                            item.count += result.count;
                            existingItem = true;
                            return false;
                        }
                    });
                    if (!existingItem) {
                        $.each(modifier.effect.results, function(i, result) {
                            $scope.regiment['fixed modifiers']['character kit'][modifier.effect.target].push(result.value);
                        })
                    }
                    break;
                case "AddFavored":
                    var favoredWeapon;
                    switch (modifier.effect.target) {
                        case "Basic":
                            favoredWeapon = $scope.regiment['fixed modifiers']['favored weapons'][0];
                            break;
                        case "Heavy":
                            favoredWeapon = $scope.regiment['fixed modifiers']['favored weapons'][1];
                            break;
                    }
                    var existingItem = $scope.regiment['fixed modifiers']['character kit']
                        .find(function(weapon) {
                            return angular.equals(weapon, favoredWeapon);
                        });
                    if (existingItem) {
                        existingItem.count += 1;
                    } else {
                        $scope.regiment['fixed modifiers']['character kit'].push({
                            item: favoredWeapon,
                            count: 1
                        });
                    }
                    break;
            }
            updateAvailableKitChoices();
        };

        //Make any selections for the given kit modifier and add it to the chosen modifiers.
        $scope.addKitModifier = function(choice) {
            //Chained promises of any opened modal. Later used to proceed once all the modal promises successfully resolve.
            var modals;
            //Array containing all items that are eligible at targets for the effect.
            switch (choice.effect.type) {
                //Replace an object with a completely new item
                case "Replace":
                    //Replace the properties of an item with those contained in the effect
                case "Upgrade":
                    {
                        var eligibleItems = [];
                        //Iterate over the items in each of the kit sections and if they match the effect target, add them to the eligible items
                        var equipment = $scope.regiment['fixed modifiers']['character kit'];
                        for (var i = 0; i < equipment.length; i++) {
                            var meetsCondition = true;
                            $.each(choice.effect.target, function(index, target) {
                                if (!testItemMatchesTarget(equipment[i].item, target)) {
                                    meetsCondition = false;
                                }
                            });
                            if (meetsCondition) {
                                eligibleItems.push({
                                    "section": $scope.regiment['fixed modifiers']['character kit'],
                                    "value": equipment[i]
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
                            choice.effect.target = selection.selected
                        });
                        break;
                    }
                    //Add one or more new items to the kit
                case "Add":
                    if (!modals) {
                        var emptyDeferred = $q.defer();
                        emptyDeferred.resolve(null);
                        modals = emptyDeferred.promise;
                    };
                    break;
                    //Add an item of a particular availability to the kit
                case "AddAvailability":
                    selection.selectionObject = {
                        selections: 1,
                        options: choice.effect.results
                    };
                    choice.effect.type = "Add";
                    var currentModal = $uibModal.open({
                        controller: "SelectionModalController",
                        templateUrl: "pluginresource/templates/selection-modal.html"
                    });
                    if (!modals) {
                        modals = currentModal.result;
                    } else {
                        modals = modals.then(currentModal.result);
                    }

                    currentModal.result.then(function() {
                        choice.effect.results = selection.selected;
                    });
                    break;
                    //Add one of the regiments favored weapons to the kit
                case "AddFavored":
                    var deferred = $q.defer();
                    deferred.resolve();
                    if (!modals) {
                        modals = deferred.promise;
                    } else {
                        modals = modals.then(deferred.promise);
                    }
                    break;
            };
            //Application function
            modals.then(function(result) {
                $scope.chosenKitModifiers.push(choice);
                choice.timesSelected++;
                $scope.regiment.remainingKitPoints -= choice.cost;
                $scope.applyKitModifier(choice);
                updateAvailableKitChoices();
            })
        };

        $scope.removeKitModifier = function(modifier) {
            $scope.chosenKitModifiers.splice($scope.chosenKitModifiers.indexOf(modifier), 1);
            $scope.regiment.remainingKitPoints += modifier.cost;
            reapplyModifiers();
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