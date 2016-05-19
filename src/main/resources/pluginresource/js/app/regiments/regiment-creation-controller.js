define(function() {
	return function($scope, $state, regimentOptions, regiments, character, $q, selection, $uibModal, characteroptions) {
		$q.all({
			"origins": regimentOptions.homeworlds(),
			"officers": regimentOptions.officers(),
			"types": regimentOptions.types(),
			"equipment": regimentOptions.equipmentDoctrines(),
			"training": regimentOptions.trainingDoctrines(),
			"regiment kit": regimentOptions.standardRegimentKit(),
			"additional kit choices": regimentOptions.additionalKitChoices()
		}).then(function(results) {
			$scope.origins = results["origins"];
			$scope.commanders = results["officers"];
			$scope.regimentTypes = results["types"];
			$scope.equipment = results["equipment"];
			$scope.training = results["training"];
			$scope.regimentKit = results['regiment kit']['fixed modifiers']['character kit'];
			$scope.kitChoices = results["additional kit choices"];
		});

		$scope.regiment = new createdRegiment();

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
		}

		function createdRegiment() {
			this['fixed modifiers'] = {};
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
		}

		$scope.openSelectionModal = function(selectedObject, modifier) {
			selection.target = modifier;
			selection.target = modifier;
			selection.associatedService = {
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
			selection.selectionObject = selectedObject;
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

		//See if the properties on the given object match those of the given target object
		function compareItemToTarget(item, target) {
			switch (typeof item) {
				case "object":
					if (Array.isArray(item)) {
						for(var i=0;i<target.length;i++){
							if(item.indexOf(target[i]) === -1){
								return false;
							}
						}
					}
					for (var property in item) {
						if (!compareItemToTarget(item[property], target[property]) {
								return false;
							};
						}
					return true;
				case "string":
				case "number":
				case "boolean"
					return item === target;
			}
		}

			$scope.applyKitModifier(choice) {
				switch (choice.type) {
					case "Replace":
						var replaceable = [];
						for (var effect in choice.effects) {
							//Iterate over the items in the regimental kit
							for (var weapon in $regiment['fixed modifiers']['character kit']['main weapon']) {
								if(compareItemToTarget(weapon, effect.target)){
									replaceable.push(weapon)
								}
							}
							for (var weapon in $regiment['fixed modifiers']['character kit']['other weapons']) {
								if(compareItemToTarget(weapon, effect.target)){
									replaceable.push(weapon)
								}
							}
							for (var armor in $regiment['fixed modifiers']['character kit']['armor']) {
								if(compareItemToTarget(armor, effect.target)){
									replaceable.push(armor)
								}
							}
							for (var item in $regiment['fixed modifiers']['character kit']['other gear']) {
								if(compareItemToTarget(item, effect.target)){
									replaceable.push(item)
								}
							}
						}
						$uibModal.open
						break;
					case "Upgrade":
					case "Add":
				}
			}
		}
	}
})