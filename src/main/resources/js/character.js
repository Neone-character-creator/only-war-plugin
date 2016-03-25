var app = angular.module("OnlyWar", ["ui.router", "ngResource", "ui.bootstrap"])
.filter('option_summary', function(){
    return function(inVal){
        if (typeof inVal.selections === 'number'
            && typeof inVal.options !== undefined
            && Array.isArray(inVal.options)){
            var out = "";
        //Determine options are primitives or objects
            var out = inVal.selections + " of ";
            var options = [];
            $.each(inVal.options, function(index, option){
                var optionElements = [];
                if(typeof option === 'object'){
                for(var name in option){
                    if (option.hasOwnProperty(name)){
                        optionElements.push(option[name] + " x " + name);
                    }
                }
                options.push(optionElements.join(", "));
                } else {
                    options.push(option);
                }
            });
            out += options.join(" or ");
            return out;
        } else {
            return inVal;
        }
    }
})
.filter('option', function(){
	function filter(inVal){
		if (Array.isArray(inVal)){
			for(var i = 0; i < inVal.length; i++){
				inVal[i] = filter(inVal[i]);
			}
			inVal = inVal.join(', ');
		}
		return inVal;
	}
	return filter;
});

app.config(function($logProvider){
    $logProvider.debugEnabled(true);
});

//Character service.
app.factory("character", function(){
                             var character = {
                                 name: "",
                                 player: "",
                                 //The regiment of the character, contains the regiment object.
                                 regiment : null,
                                 //The specialty of the character, contains the specialty object
                                 specialty : null,
                                 description : "",
                                 //Characteristics of the character. Map between name and rating.
                                     characteristics : {
                                         "weapon skill" : null,
                                         "ballistic skill" : null,
                                         strength : null,
                                         toughness : null,
                                         agility : null,
                                         intelligence : null,
                                         perception : null,
                                         willpower : null,
                                         fellowship : null
                                     },
                                     //Array of skills. Each skill is an object containing the name and rank.
                                     //Rating 1 is known, rating 2 is trained (+10), 3 is experienced (+20), 4 is veteran (+30)
                                     skills : [],
                                     //The characters talents and traits.
                                     talents : [],
                                     wounds : {
                                         total : 0,
                                         current: 0
                                     },
                                     fatigue : 0,
                                     insanity : {
                                         points : 0,
                                         disorders : []
                                     },
                                     corruption : {
                                         points : 0,
                                         malignancies : [],
                                         mutations : []
                                     },
                                     movement : 0,
                                     fatePoints : {
                                         total : 0,
                                         current : 0
                                     },
                                     equipment : {
                                         weapons : [],
                                         armor : [],
                                         gear : []
                                     },
                                     experience : {
                                         available : 0,
                                         total : 0
                                     },
                                     aptitudes : []
                                 };
                             var service = {
                                 character : character
                             };
                             return service;
                         });

//Regiments service. Stored loaded regiment definitions and the state of the currently selected one.
app.factory("regiments", function($resource){
    var regiments = $resource("Regiment/regiments.json").query();
    var service = {
        regiments : regiments,
        selected : null,
        requiredOptionSelections : [],
        selectRegiment : function(regiment) {
            service.selected = regiment;
            for (var property in regiment['optional modifiers']){
                if (regiment['optional modifiers'].hasOwnProperty(property)){
                    $.each(regiment['optional modifiers'][property], function(index, value){
                        service.requiredOptionSelections.push({
                            "property" : property,
                            "index" : index
                        })
                    });
                };
            };
        }
    };
    return service;
});
//Specialties service. Stored loaded specialty definitions and the state of the currently selected one.
app.factory("specialties", function($resource){
    var specialties = $resource("Character/Specialties.json").query();
    var service = {
        specialties : specialties,
        selected : null,
        requiredOptionSelections : [],
        selectSpecialty : function(specialty) {
                                  service.selected = specialty;
                                  for (var property in specialty['optional modifiers']){
                                      if (specialty['optional modifiers'].hasOwnProperty(property)){
                                          $.each(specialty['optional modifiers'][property], function(index, value){
                                              service.requiredOptionSelections.push({
                                                  "property" : property,
                                                  index : index
                                              })
                                          })
                                      }
                                  }
                              }
    };
    return service;
});
//
app.factory("talents", function(){
    var _talents;
    $.get({
        url : "Character/talents.json",
        dataType : "json"
    }).done(function(result){
        _talents = result;
    });
    return function(){return _talents;};
});

app.factory("characteristics", function($resource){
    return $resource("Character/characteristics.json");
});
//Contains state for the selection modal.
app.factory("selection", function(){
    return {
        //The object the option object exists within. Will be modified by the selection.
        target : {},
        //The service for the target, keeps track of all the selections remaining to be made.
        associatedService : null,
        //The property names used to traverse the object fields to remove the option and add the selected values.
        propertyChain : [],
        //The index of the option within the array of property options for the property
        index : -1,
        //Decompose this option if valid selections made
        choose : function(chosen){
            var target = this.target;
            var propertyChain = this.propertyChain;
            var selectionObject = target['optional modifiers'];
            for(var i = 0; i <  propertyChain.length; i++){
            		selectionObject = selectionObject[propertyChain[i]];
            }
           	selectionObject = selectionObject[this.index];

            if (chosen.length !== selectionObject.selections){
                throw new exception("Selection required " + selectionObject.selections + " arguments, but received " + arguments.length);
            };
            for(var i = 0; i < arguments.length; i++){
                if(!$.inArray(arguments[i], selectionObject.options)){
                    throw new exception ("Tried to select " + arguments[i] + " but selection contains " + selectionObject.options);
				};
            };
            this.associatedService.requiredOptionSelections.splice(this.associatedService.requiredOptionSelections.indexOf(selectionObject), 1);
            var out = [];
            $.each(chosen, function(index, element){
                out.push(element);
            });
            var optionalModifier = target['optional modifiers'];
            for(var i = 0; i <  propertyChain.length; i++){
                optionalModifier = optionalModifier[propertyChain[i]];
            }
            optionalModifier.splice(this.index, 1);
            var fixedModifier = target['fixed modifiers'];
            for(var i = 0; i <  propertyChain.length; i++){
            	//Add missing properties
            	if (fixedModifier[propertyChain[i]] === undefined){
            		switch(propertyChain[i]){
            			case 'character kit' : fixedModifier['character kit'] = {};
            			break;
            			case 'other gear' : fixedModifier['other gear'] = [];
            			break;
            		}
            	}
                fixedModifier = fixedModifier[propertyChain[i]];
            };
            $.each(out, function(index, e){
	            if($.isArray(e)){
	            	for(var i = 0; i < e.length; i++){
	            		fixedModifier.push(e[i]);
            		}
            	} else {
					fixedModifier.push(e);
				}
            });
        }
    };
})

app.config(function($stateProvider, $urlRouterProvider){
    $stateProvider.state("sheet", {
        url : "/",
        templateUrl : "templates/sheet.html",
        controller : "SheetController"
    }).state("regiment", {
        url : "/regiment",
        templateUrl : "templates/regiment-select.html",
        controller : "RegimentSelectionController"
    })
    .state("characteristics", {
        url : "/characteristics",
        templateUrl : "templates/characteristics.html",
        controller : "CharacteristicsController"
    }).state("specialty", {
        url : "/specialty",
        templateUrl : "templates/specialty.html",
        controller : "SpecialtySelectController"
    });
});

app.controller("NavController",function($scope, character){
    $scope.character = character.character;
});

app.controller("SheetController",function($scope, character, regiments, specialties, characteristics){
    $scope.character = character.character;
    $scope.selected = regiments.selected;
    $scope.selected = specialties.selected;
    var characteristics = characteristics.query();
    $scope.characteristics = characteristics;
});

app.controller("RegimentCreationController", function($scope){

});

app.controller("CharacteristicsController", function($scope, characteristics, character){
    var characteristics = characteristics.query();
    $scope.characteristics = characteristics;
    $scope.character = character.character;
    $scope.generate = function(name){
        if (name === undefined){
            $.each(characteristics, function(index, value){
                character.character.characteristics[value] = 20 + Math.floor(Math.random() * (9) + 1) + Math.floor(Math.random() * (9) + 1);
            });
        } else {
            character.character.characteristics[name] = 20 + Math.floor(Math.random() * (9) + 1) + Math.floor(Math.random() * (9) + 1);
        };
    };
});

app.controller("RegimentSelectionController", function($scope, $uibModal, character, regiments, selection, $state, $stateParams, $uibModal){
    $scope.regiments = regiments.regiments;
    $scope.character = character.character;
    $scope.selectedRegiment = regiments.selected;
    var suppressDialog = false;

    $scope.$on('$stateChangeStart', function(e, toState, fromState, fromParams){
        if (fromState = "regiment" && toState !== fromState && regiments.requiredOptionSelections.length !== 0){
        	var resultHandler = function(result){
        		if (result){
        			suppressDialog = true;
        			$state.go(toState);
        		}
        	};
        	if(!suppressDialog){
        		e.preventDefault();
        		confirm = $uibModal.open({
					controller : "NavigationConfirmationController",
					templateUrl : "templates/confirm-modal.html"
				}).result.then(resultHandler);
        	}
        }
    });

    $scope.selectRegiment = function(index){
        regiments.selectRegiment(regiments.regiments[index]);
        $scope.selectedRegiment = regiments.selected;
    };

    $scope.openSelectionModal = function(properties, index){
        selection.target = regiments.selected;
        selection.propertyChain = properties;
        selection.index = index;
        selection.associatedService = regiments;
        $uibModal.open({
            controller : "SelectionModalController",
            templateUrl : 'templates/selection-modal.html',
        });
    };
});

app.controller("SpecialtySelectController", function($scope, specialties, character, selection, $uibModal){
    $scope.specialties = specialties.specialties;
    $scope.character = character.character;
    $scope.selectedSpecialty = specialties.selected;

     var suppressDialog = false;

     $scope.$on('$stateChangeStart', function(e, toState, fromState, fromParams){
     	if (fromState = "specialty" && toState !== fromState && specialties.requiredOptionSelections.length !== 0){
        	var resultHandler = function(result){
            	if (result){
            		suppressDialog = true;
            		$state.go(toState);
            	}
           	};
           	if(!suppressDialog){
           		e.preventDefault();
           		confirm = $uibModal.open({
   					controller : "NavigationConfirmationController",
   					templateUrl : "templates/confirm-modal.html"
				}).result.then(resultHandler);
			}
		}
	});

    $scope.selectSpecialty = function(index){
        specialties.selectSpecialty(specialties.specialties[index]);
        $scope.selectedSpecialty = specialties.selected;
    };

    $scope.openSelectionModal = function(properties, index){
        selection.target = specialties.selected;
        selection.propertyChain = properties;
        selection.index = index;
        selection.associatedService = specialties;
        $uibModal.open({
            controller : "SelectionModalController",
            templateUrl : 'templates/selection-modal.html',
        })
    };
});

app.controller("SelectionModalController", function($scope, $uibModalInstance, selection){
	var target = selection.target['optional modifiers'];
	for(var i = 0; i <  selection.propertyChain.length; i++){
		target = target[selection.propertyChain[i]];
	}
	target = target[selection.index];
    $scope.choices = {
        selectionCount : target.selections,
        //The options
        options : [],
        //If the option in options at the same index is selected
        selectedStates : []
    };

    $.each(target.options, function(index, option){
		var value = option;
    	if(typeof option === 'object'){
    		var options = [];
	    	for(var property in option){
	    		if (option.hasOwnProperty(property)){
	    			options.push(option[property] + " x " + property);
	    		};
	    	}
	    	value = options;
	    }
	    $scope.choices.options[index] = value;
        $scope.choices.selectedStates[index] = false;
    });

    $scope.close = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.ok = function() {
        var choices = [];
        for(var i = 0; i < $scope.choices.options.length; i++){
        	if($scope.choices.selectedStates[i] === true){
        		choices.push($scope.choices.options[i]);
        	}
        }
        selection.choose(choices);
        $uibModalInstance.close('complete');
    };
});

app.controller("NavigationConfirmationController", function($scope, $uibModalInstance){
	$scope.ok = function(){
		$uibModalInstance.close(true);
	};

	$scope.cancel = function(){
    	$uibModalInstance.close(false);
    };
});