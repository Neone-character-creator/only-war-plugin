define(function() {
	return function($scope, $state, regimentOptions, regiments, character, $q, optionselection, $uibModal, characteroptions, selection) {
		var kitChoices;
		$q.all({
			"origins": regimentOptions.homeworlds(),
			"officers": regimentOptions.officers(),
			"types": regimentOptions.types(),
			"equipment": regimentOptions.equipmentDoctrines(),
			"training": regimentOptions.trainingDoctrines(),
			"regiment kit": regimentOptions.standardRegimentKit(),
			"additional kit choices": regimentOptions.additionalKitChoices(),
			"character options" : $q.all({
				"weapons" : characteroptions.weapons(),
				"armor" : characteroptions.armor(),
				"items" : characteroptions.items()
			})
		}).then(function(results) {
			$scope.origins = results["origins"];
			$scope.commanders = results["officers"];
			$scope.regimentTypes = results["types"];
			$scope.equipment = results["equipment"];
			$scope.training = results["training"];
			$scope.regimentKit = results['regiment kit']['fixed modifiers']['character kit'];
			kitChoices = angular.copy(results["additional kit choices"]);
			$.each(kitChoices, function(i, choice){
				$.each(choice.effects, function(i, effect){
					if(effect.type === "Add" || effect.type === "Replace"){
						$.each(effect.results, function(i, result){
							var placeholder = result;
							result.item = results['character options'].weapons.find(function(item){
								for(var property in placeholder.item){
									if (item[property] !== placeholder.item[property]){
										return false;
									}
								}
								return true;
							});
							if(!result.item){
								result.item = results['character options'].items.find(function(item){
									for(var property in placeholder.item){
										if (item[property] !== placeholder.item[property]){
											return false;
										}
									}
									return true;
								});
							};
							if(!result.item){
								result.item = results['character options'].armor.find(function(item){
									for(var property in placeholder.item){
										if (item[property] !== placeholder.item[property]){
											return false;
										}
									}
									return true;
								});
							}
						});
					}
				})
			});
			$scope.regiment = new createdRegiment();
			updateAvailableKitChoices();
		});

		function updateAvailableKitChoices(){
			$scope.kitChoices = kitChoices.filter(function(choice){
				var isAvailable = (choice.cost <= $scope.regiment.remainingKitPoints);
				if(isAvailable){
					var mainWeapon = $scope.regiment['fixed modifiers']['character kit']['main weapon'];
					var otherWeapons = $scope.regiment['fixed modifiers']['character kit']['other weapons'];
					var armor = $scope.regiment['fixed modifiers']['character kit']['armor'];
					var otherGear = $scope.regiment['fixed modifiers']['character kit']['other gear'];
					var combinedKit = mainWeapon.concat(otherWeapons).concat(armor).concat(otherGear);

					//Iterate over the kit choices
					$.each(choice.effects, function(i, effect){
					//Upgrades and replacement only available if a valid target item exists
					if(effect.type == "Upgrade" || effect.type == "Replace"){
						var targetExists = false;
						//Iterate over the effects to find possible target items
						$.each(effect.target, function(i, target){
							//Test each item against the effect.
							$.each(combinedKit, function(i, item){
								//If a matching item has not yet been found
								if(!targetExists){
									targetExists = compareItemToTarget(item.item, target);
								};
								//Continue iteration if no match found yet.
								return !targetExists;
							});
							return !targetExists;
						});
						isAvailable= targetExists;
					}
				});
				}
				return isAvailable;
			});
		}

		$scope.chosenKitModifiers = [];

		function reapplyModifiers() {
			$scope.regiment = new createdRegiment();
			if ($scope.homeworld) {
				$scope.regiment.remainingRegimentPoints -= $scope.homeworld.cost;
				$scope.regiment.addModifier($scope.homeworld);
			}
			if ($scope.commander) {
				$scope.regiment.remainingRegimentPoints -= $scope.commander.cost;
				$scope.regiment.addModifier($scope.commander)
			}
			if ($scope.type) {
				$scope.regiment.remainingRegimentPoints -= $scope.type.cost;
				$scope.regiment.addModifier($scope.type);
			}
			if ($scope.doctrines) {
				$.each($scope.doctrines, function(index, element) {
					if (element) {
						$scope.regiment.remainingRegimentPoints -= $scope.doctrines[index].cost;
						$scope.regiment.addModifier($scope.doctrines[index]);
					}
				});
			}
			$scope.regiment.remainingKitPoints = 30 + $scope.regiment.remainingRegimentPoints * 2;
		}

		function createdRegiment() {
			this['fixed modifiers'] = {
				'character kit': $scope.regimentKit
			};
			this['optional modifiers'] = [];
			this.addModifier = function(modifier, type) {
				for (var property in modifier['fixed modifiers']) {
					if (modifier['fixed modifiers'].hasOwnProperty(property)) {
						switch (property) {
							case "characteristics":
								if (!this['fixed modifiers'][property]) {
									this['fixed modifiers'].characteristics = {}
								}
								for (var characteristic in modifier['fixed modifiers']["characteristics"]) {
									if (this['fixed modifiers'].characteristics.characteristic) {
										this['fixed modifiers'].characteristics[characteristic.toLowerCase()] += modifier['fixed modifiers'][property][characteristic];
									} else {
										this['fixed modifiers'].characteristics[characteristic.toLowerCase()] = modifier['fixed modifiers'][property][characteristic];
									}
								};
								break;

							case "skills":
								if (!this['fixed modifiers'][property]) {
									this['fixed modifiers'].skills = {};
								}
								var incomingSkills = modifier['fixed modifiers']['skills'];
								for (var skill in incomingSkills) {
									var existingSkill = this['fixed modifiers'].skills[skill.name];
									if (existingSkill) {
										existingSkill.advancements = existingSkill.advancements() + incomingSkills[skill];
									} else {
										this['fixed modifiers'].skills[skill] = incomingSkills[skill];
									}
								}
								break;
							case "talents":
								if (!this['fixed modifiers'][property]) {
									this['fixed modifiers'][property] = [];
								}
								var incomingTalents = modifier['fixed modifiers']['talents'];
								for (var i = 0; i < incomingTalents.length; i++) {
									this['fixed modifiers'].talents.push(incomingTalents[i]);
								}
								break;
							case "aptitudes":
								if (!this['fixed modifiers'][property]) {
									this['fixed modifiers'][property] = [];
								}
								var incomingAptitudes = modifier['fixed modifiers']['aptitudes'];
								this['fixed modifiers'].aptitudes.push(incomingAptitudes);
								break;
							case "starting power experience":
								this['fixed modifiers'][property] += modifier['fixed modifiers']['starting power experience'];
								break;
							case "psy rating":
								if (this['fixed modifiers'][property]) {
									console.log(modifier.name + " tried to set the psy rating, but it's already set.")
								}
								this['fixed modifiers'][property] = modifier['fixed modifiers']['psy rating'];
								break;
							case "character kit":
								if (!this['fixed modifiers']['character kit']) {
									this['fixed modifiers']['character kit'] = {}; {}
								}
								for (var category in modifier['fixed modifiers']['character kit']) {
									if (!this['fixed modifiers']['character kit'][category]) {
										this['fixed modifiers']['character kit'][category] = {};
									};
									$.each(modifier['fixed modifiers']['character kit'][category], function(index, element) {
										if (this['fixed modifiers']['character kit'][category][element.name]) {
											this['fixed modifiers']['character kit'][category][element.name] = element;
										} else {
											this['fixed modifiers']['character kit'][category][element.name] = element;
										}
									});
									break;
								}
								break;
							case "regiment kit points":
								this['fixed modifiers'].kitPoints = modifier['fixed modifiers']['regiment kit points'];
						}
					}
				}
				for (var optionalModifier in modifier['optional modifiers']) {
					this['optional modifiers'].push(optionalModifier);
				};
			};
			this.remainingRegimentPoints = 12;
			this.remainingKitPoints = 30 + this.remainingRegimentPoints * 2;
		}

		$scope.openSelectionModal = function(selectedObject, modifier) {
			optionselection.target = modifier;
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
			optionselection.selectionObject = selectedObject;
			$uibModal.open({
				controller: "SelectionModalController",
				templateUrl: 'pluginresource/templates/selection-modal.html',
			}).result.then(function() {
				reapplyModifiers();
			});
		};

		$scope.selecthomeworld = function(homeworld) {
			if ($scope.homeworld) {
				$scope.regiment.remainingRegimentPoints += $scope.homeworld.cost;
			}
			$scope.homeworld = angular.copy(homeworld);
			reapplyModifiers();
		}

		$scope.selectcommander = function(commander) {
			if ($scope.commander) {
				$scope.regiment.remainingRegimentPoints += $scope.commander.cost;
			}
			$scope.commander = angular.copy(commander);
			reapplyModifiers();
		}

		$scope.selecttype = function(type) {
			if ($scope.type) {
				$scope.regiment.remainingRegimentPoints += $scope.type.cost;
			}
			$scope.type = angular.copy(type);
			reapplyModifiers();
		}

		$scope.selectdoctrine = function(doctrine, index) {
			if (!$scope.doctrines) {
				$scope.doctrines = [];
			}
			if ($scope.doctrines[index]) {
				$scope.regiment.remainingRegimentPoints$ += $scope.doctrines[index].cost;
			}
			$scope.doctrines[index] = angular.copy(doctrine);
			reapplyModifiers();
		}

		$scope.finish = function() {
			if (remainingRegimentPoints >= 0 &&
				$scope.origin &&
				$scope.commander &&
				$scope.type) {
				character.regiment = $scope.regiment;
				$state.go("regiment");
			}
		}

		$scope.applyKitModifier = function(choice) {
			//Iterate over each of the effects of the chosen modifier
			$.each(choice.effects, function(index, effect) {
				//Keep all of the items that this effect can apply to.
				var eligible = [];
				switch (effect.type) {
					//Replace an object with a completely new item
					case "Replace":
					//Change the properties of an item
					case "Upgrade":
						//Iterate over the items in each of the kit sections and if they match the target, add them to the array of eligible items
						var mainWeapon = $scope.regiment['fixed modifiers']['character kit']['main weapon'];
						for (var i = 0; i < mainWeapon.length; i++) {
							var meetsCondition = true;
							$.each(effect.target, function(index, target) {
								if (!compareItemToTarget(mainWeapon[i].item, target)) {
									meetsCondition = false;
								}
							});
							if (meetsCondition) {
								eligible.push({
									"section": "main weapon",
									"value": mainWeapon[i]
								});
							}
						}
						var otherWeapons = $scope.regiment['fixed modifiers']['character kit']['other weapons'];
						for (var i = 0; i < otherWeapons.length; i++) {
							var meetsCondition = true;
							$.each(effect.target, function(index, target) {
								if (!compareItemToTarget(otherWeapons[i].item, target)) {
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
							$.each(effect.target, function(index, target) {
								if (!compareItemToTarget(armor[i].item, target)) {
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
							$.each(effect.target, function(index, target) {
								if (!compareItemToTarget(otherGear[i].item, target)) {
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
						break;
					//Add a completely new item to the kit
					case "Add":
						break;
					case "AddAvailability":
						break;
					case "AddFavored":
				};
				selection.selectionObject = {
					selections: 1,
					options: eligible
				};
				$uibModal.open({
					controller: "SelectionModalController",
					templateUrl: "pluginresource/templates/selection-modal.html"
				}).result.then(function() {
					choice.choiceCount = choice.choiceCount ? choice.choiceCount + 1 : 1;
					var result = {
						description: choice.description,
						affectedItems : []
					};
					$scope.chosenKitModifiers.push(result);
					//For each selected choice
					$.each(selection.selected, function(index, selection) {
						switch (effect.type) {
							case "Replace":
								$.each(effect.results, function(i, replacement) {
									//If the affected item has had upgrades applied to it, apply them to the replacement item
									var upgradesToSelectedItem = [].concat.apply(
										[],
										$scope.chosenKitModifiers.filter(function(modifier){
											//Determine if this modifier affects the item being replaced
											var items = modifier.affectedItems.filter(function(item){
												return item.value.item ===
											})
											.map(function(item){return item.upgrade});
											return items.indexOf(selection.value.item) !== -1;
										})).map(function(effect){
											//Replace the modifier with its affected items
											return effect.affectedItems.filter(function(item){
												return item.effect === "Upgrade"
											});
										});
										$.each(upgradesToSelectedItem, function(i, upgrade){
											for(var property in upgrade){
												replacement[property] = upgrade[property];
											}
										});
									result.affectedItems.push({
										"original": angular.copy(selection),
										"replacement" : replacement
									});
									switch(selection.section){
											case "main weapon":
												var index = -1;
												for(var i = 0; i < mainWeapon.length; i++){
													if(mainWeapon[i] === selection.value){
														index = i;
														break;
													}
												}
												mainWeapon.splice(index,1, replacement);
											break;
											case "other weapons":
												var index = -1;
												for(var i = 0; i < otherWeapons.length; i++){
													if(otherWeapons[i] === selection.value){
														index = i;
														break;
													}
												}
												otherWeapons.splice(index,1, replacement);
											break;
											case "armor":
												var index = -1;
												for(var i = 0; i < armor.length; i++){
													if(armor[i] === selection.value){
														index = i;
														break;
													}
												}
												armor.splice(index,1, replacement);
											break;
											case "other gear":
												var index = -1;
												for(var i = 0; i < otherGear.length; i++){
													if(otherGear[i] === selection.value){
														index = i;
														break;
													}
												}
												otherGear.splice(index,1, replacement);
											break;
										}
								});
								break;
							case "Upgrade":
								$.each(effect.results, function(i, upgrade) {
									result.affectedItems.push({
										"original": angular.copy(selection),
										"upgrade": upgrade,
										"affected" : selection.value
									});
									for (var property in upgrade) {
										selection.value.item[property] = upgrade[property];
									}
								});
								break;
							case "Add":
								result.affectedItems.push({
									"type": effect.type,
									"added": angular.copy(selection)
								});
						}
					});
				});
			});
			updateAvailableKitChoices();
		}

		$scope.removeKitModifier = function(modifier) {
			var mainWeapon = $scope.regiment['fixed modifiers']['character kit']['main weapon'];
			var otherWeapons = $scope.regiment['fixed modifiers']['character kit']['other weapons'];
			var armor = $scope.regiment['fixed modifiers']['character kit']['armor'];
			var otherGear= $scope.regiment['fixed modifiers']['character kit']['other gear'];
			$.each(modifier.affectedItems, function(i, item) {
				switch(item.original.section){
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
				if(item.original){

				}
			});
			$scope.chosenKitModifiers.splice($scope.chosenKitModifiers.indexOf(modifier),1);

			updateAvailableKitChoices();
		};

		//See if the properties on the given object match those of the given target object
		function compareItemToTarget(item, target) {
			for (var property in target) {
				if (item[property] !== target[property]) {
					return false;
				};
			}
			return true;
		}
	}
})