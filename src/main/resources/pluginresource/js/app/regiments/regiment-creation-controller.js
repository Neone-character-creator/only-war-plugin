define(function() {
    return function($scope, $state, regimentOptions, regiments, $q) {
        $q.all({
            "origins": regimentOptions.homeworlds(),
            "officers": regimentOptions.officers(),
            "types": regimentOptions.types(),
            "equipment": regimentOptions.equipmentDoctrines(),
            "training": regimentOptions.trainingDoctrines()
        }).then(function(results) {
            $scope.origins = results["origins"];
            $scope.commanders = results["officers"];
            $scope.regimentTypes = results["types"];
            $scope.equipment = results["equipment"];
            $scope.training = results["training"];
        });

        $scope.regiment = {
            fixedModifiers: {},
            optionalModifiers: [],
            addModifier: function(modifier, type) {
                for (var property in modifier['fixed modifiers']) {
                    if (modifier['fixed modifiers'].hasOwnProperty(property)) {
                        switch (property) {
                            case "characteristics":
                                if (!this.fixedModifiers.hasOwnProperty(property)) {
                                    this.fixedModifiers.characteristics = {}
                                }
                                for (var characteristic in modifier['fixed modifiers']["characteristics"]) {
                                    if(this.fixedModifiers.characteristics.characteristic){
                                        this.fixedModifiers.characteristics[characteristic.toLowerCase()] += modifier['fixed modifiers'][property][characteristic];
                                    } else {
                                        this.fixedModifiers.characteristics[characteristic.toLowerCase()] = modifier['fixed modifiers'][property][characteristic];
                                    }
                                };
                                break;

                            case "skills":
                                if (!this.fixedModifiers.hasOwnProperty(property)) {
                                    this.fixedModifiers.skills = {};
                                }
                                var incomingSkills = modifier['fixed modifiers']['skills'];
                                for (var skill in incomingSkills) {
                                    var existingSkill = this.fixedModifiers.skills[skill.name];
                                    if (existingSkill) {
                                        existingSkill.advancements = existingSkill.advancements() + incomingSkills[skill];
                                    } else {
                                        this.fixedModifiers.skills[skill] = incomingSkills[skill];
                                    }
                                }
                                break;
                            case "talents":
                                if (!this.fixedModifiers[property]) {
                                    this.fixedModifiers[property] = [];
                                }
                                var incomingTalents = modifier['fixed modifiers']['talents'];
                                for (var i = 0; i < incomingTalents.length; i++) {
                                    this.fixedModifiers.talents.push(incomingTalents[i]);
                                }
                                break;
                            case "aptitudes":
                                if (!this.fixedModifiers[property]) {
                                    this.fixedModifiers[property] = [];
                                }
                                var incomingAptitudes = modifier['fixed modifiers']['aptitudes'];
                                this.fixedModifiers.aptitudes.push(incomingAptitudes);
                                break;
                            case "starting power experience":
                                this.fixedModifiers[property] += modifier['fixed modifiers']['starting power experience'];
                                break;
                            case "psy rating":
                                if (this.fixedModifiers[property]) {
                                    console.log(modifier.name + " tried to set the psy rating, but it's already set.")
                                }
                                this.fixedModifiers[property] = modifier['fixed modifiers']['psy rating'];
                                break;
                            case "character kit":
                                if (!this.fixedModifiers['character kit']) {
                                    this.fixedModifiers['character kit'] = {}; {}
                                }
                                for (var category in modifier['fixed modifiers']['character kit']) {
                                    if (!this.fixedModifiers['character kit'][category]) {
                                        this.fixedModifiers['character kit'][category] = {};
                                    };
                                    $.each(weapons, function(index, element) {
                                        if(this.fixedModifiers['character kit'][category][element.name]){
                                            this.fixedModifiers['character kit'][category][element.name] = element;
                                        } else {
                                            this.fixedModifiers['character kit'][category][element.name] = element;
                                        }
                                    });
                                    break;
                                }
                                break;
                        }
                    }
                }
            },
            removeModifier: function(modifier, type) {
                for (var property in modifier['fixed modifiers']) {
                    if (modifier['fixed modifiers'].hasOwnProperty(property)) {
                        switch (property) {
                            case "characteristics":
                                for (var characteristic in modifier['fixed modifiers']["characteristics"]) {
                                    this.fixedModifiers.characteristics[characteristic.toLowerCase()] -= modifier['fixed modifiers'][property][characteristic];
                                    if (this.fixedModifiers.characteristics[characteristic.toLowerCase()] === 0){
                                        delete this.fixedModifiers.characteristics[characteristic.toLowerCase()];
                                    }
                                };
                                break;
                            case "skills":
                                var incomingSkills = modifier['fixed modifiers']['skills'];
                                for (var skill in incomingSkills) {
                                    var existingSkill = this.fixedModifiers.skills[skill];
                                    existingSkill.advancements -= incomingSkills[skill].advancements;
                                    if(existingSkill.advancements === 0){
                                        delete this.fixedModifiers.skills[skill];
                                    }
                                }
                                break;
                            case "talents":
                                var incomingTalents = modifier['fixed modifiers']['talents'];
                                for (var i = 0; i < incomingTalents.length; i++) {
                                    this.fixedModifiers.talents.splice(this.fixedModifiers.talents.indexOf(incomingTalents[i]),1);
                                }
                                break;
                            case "aptitudes":
                                var incomingAptitudes = modifier['fixed modifiers']['aptitudes'];
                                for (var i = 0; i < incomingAptitudes.length; i++) {
                                    this.fixedModifiers.aptitudes.splice(this.fixedModifiers.aptitudes.indexOf(incomingAptitudes[i],1));
                                }
                                break;
                            case "starting power experience":
                                this.fixedModifiers[property] += modifier['fixed modifiers']['starting power experience'];
                                break;
                            case "psy rating":
                                this.fixedModifiers[property] = 0;
                                break;
                            case "character kit":
                                for (var category in modifier['fixed modifiers']['character kit']) {
                                    var weapons = modifier['fixed modifiers']['character kit'][category];
                                    $.each(weapons, function(index, element) {
                                        this.fixedModifiers[category];
                                    });
                                    break;
                                }
                                break;
                        }
                    }
                }
            }
        };

        $scope.openSelectionModal = function(selectedObject) {
            selection.target = regiments.selected();
            selection.associatedService = regiments;
            selection.selectionObject = selectedObject;
            $uibModal.open({
                controller: "SelectionModalController",
                templateUrl: 'templates/selection-modal.html',
            }).result.then(function() {
                $scope.selected = regiments.selected();
            });
        };

        $scope.selectHomeworld = function(homeworld) {
            if($scope.homeworld){
                regiments.selected.removeModifier($scope.homeworld);
            }
            $scope.homeworld = homeworld;
            $scope.regiment.addModifier(homeworld);
        }

        $scope.selectCommander = function(commander) {
        	if($scope.commander){
        		regiments.selected.removeModifier($scope.commander);
        	}
        	$scope.commander = commander;
        	$scope.regiment.addModifier(commander)
        }

        $scope.selectRegimentType = function(type) {
                	if($scope.type){
                		$scope.regiment.removeModifier($scope.type);
                	}
                	$scope.type = type;
                	$scope.regiment.addModifier(type)
                }

        $scope.setDoctrine = function(doctrine, index){
        	if($scope.doctrines[index]){
        		$scope.regiment.removeModifier($scope.doctrines[index]);
        	}
            $scope.doctrines[index] = doctrine;
            $scope.regiment.addModifier(doctrine);
        }
	}
})