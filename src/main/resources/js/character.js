var app = angular.module("OnlyWar", ["ui.router", "ngResource", "ui.bootstrap"])
    .filter('option_summary', function() {
        return function(inVal) {
            if (typeof inVal.selections === 'number' && Array.isArray(inVal.options)) {
                //Determine options are primitives or objects
                var out = "Choose " + inVal.selections + " from ";
                var options = [];
                $.each(inVal.options, function(index, option) {
                    var optionElements = [];
                    if (typeof option.value === 'object') {
                        for (var name in option.value) {
                            if (option.hasOwnProperty(name)) {
                                optionElements.push(option[name] + " x " + name);
                            }
                        }
                        options.push(optionElements.join(", "));
                    } else if (Array.isArray(option).value) {

                    } else {
                        options.push(option.value);
                    }
                });
                out += options.join(" or ");
                return out;
            } else {
                return inVal;
            }
        };
    })
    .filter('modal_option', function() {
        function filter(inVal) {
            if (Array.isArray(inVal)) {
                for (var i = 0; i < inVal.length; i++) {
                    inVal[i] = filter(inVal[i]);
                }
                inVal = inVal.join(', ');
            } else if (typeof inVal.value === 'object') {
                var elements = [];
                var j = 0;
                for (var property in inVal) {
                    if (property.slice(0, 2) === "$$") {
                        continue;
                    } else if (inVal.hasOwnProperty(property)) {
                        elements[j++] = inVal[property] + " x " + property;
                    }
                }
                inVal = elements.join(", ");
            }
            return inVal.value;
        }
        return filter;
    });

//Character service.
app.factory("character", function() {
    var character = function(){
    	return{
        	name: "",
        player: "",
        //The regiment of the character, contains the regiment object.
        regiment: null,
        //The specialty of the character, contains the specialty object
        specialty: null,
        description: "",
        //Characteristics of the character. Map between name and rating.
        characteristics: {
            "weapon skill": null,
            "ballistic skill": null,
            strength: null,
            toughness: null,
            agility: null,
            intelligence: null,
            perception: null,
            willpower: null,
            fellowship: null
        },
        //Array of skills. Each skill is an object containing the name and rank.
        //Rating 1 is known, rating 2 is trained (+10), 3 is experienced (+20), 4 is veteran (+30)
        skills: [],
        //The characters talents and traits.
        talents: [],
        wounds: {
            total: 0,
            current: 0
        },
        fatigue: 0,
        insanity: {
            points: 0,
            disorders: []
        },
        corruption: {
            points: 0,
            malignancies: [],
            mutations: []
        },
        movement: 0,
        fatePoints: {
            total: 0,
            current: 0
        },
        equipment: {
            weapons: [],
            armor: [],
            gear: []
        },
        experience: {
            available: 0,
            total: 0
        },
        aptitudes: []
    };
    }
    var service = {
        character : character(),
        "new" : function(){
        	this.character = character();
        }
    };
    return service;
});

//Specialties service. Stored loaded specialty definitions and the state of the currently selected one.
app.factory("specialties", function($resource) {
    var specialties = $resource("Character/Specialties.json").query();
    var specialtiesNameToIndex = {};
    for(var i = 0; i < specialties.length; i++){
    	specialtiesNameToIndex[specialties[i]].name = specialties[i];
    }
    var service = {
        specialtyNames: function(){return Object.keys(specialtiesNameToIndex)},
        selected: null,
        requiredOptionSelections: [],
        dirty : false,
        selectSpecialty: function(specialtyName) {
            service.selected = Object.clone(specialties[specialtiesNameToIndex[specialtyName]]);
            this.requiredOptionSelections = specialty['optional modifiers'];
        }
    };
    return service;
});
//
app.factory("talents", function() {
    var _talents;
    $.get({
        url: "Character/talents.json",
        dataType: "json"
    }).done(function(result) {
        _talents = result;
    });
    return function() {
        return _talents;
    };
});

app.factory("characteristics", function($resource) {
    return $resource("Character/characteristics.json");
});
//Contains state for the selection modal.
app.factory("selection", function() {
    return {
        //The object the option object exists within. Will be modified by the selection.
        target: {},
        //The service for the target, keeps track of all the selections remaining to be made.
        associatedService: null,
        //The selection object being chosen from
        selectionObject: {},
        //Decompose this option if valid selections made
        choose: function(chosen) {
            if (chosen.length !== this.selectionObject.selections) {
                throw "Selection required " + this.selectionObject.selections + " arguments, but received " + arguments.length;
            };
            for (var i = 0; i < chosen.length; i++) {
                if ($.inArray(chosen[i], this.selectionObject.options) === -1) {
                    throw "Tried to select " + JSON.stringify(chosen[i]) + " but selection contains " + JSON.stringify(this.selectionObject.options);
                };
            };
            var target = this.target;

            for (var i = 0; i < chosen.length; i++) {
                this.associatedService.requiredOptionSelections.splice(this.associatedService.requiredOptionSelections.indexOf(this.selectionObject), 1);
                var out = [];
                $.each(chosen, function(index, element) {
                    out.push(element);
                });
                var fixedModifier = target['fixed modifiers'];
                var properties;
                if (Array.isArray(chosen[i].property)) {
                    properties = chosen[i].property;
                } else {
                    properties = [chosen[i].property];
                };
                for (var p = 0; p < properties.length; p++) {
                    fixedModifier = fixedModifier[properties[p]];
                    if (fixedModifier[properties[p]] === undefined) {
                        switch (properties[i]) {
                            case 'character kit':
                                fixedModifier['character kit'] = {};
                                break;
                            case 'other gear':
                                fixedModifier['other gear'] = [];
                                break;
                        };
                    };
                    if(chosen[i].value === 'object'){
                    	for(var prop in chosen[i].value){
                    		if(chosen[i].value.hasOwnProperty(prop)){
                    			fixedModifier[prop] = chosen[i].value[prop];
                    		}
                    	}
                    } else {
                    	fixedModifier.push(chosen[i].value);
                    };
                }
            };
            this.associatedService.dirty = true;
        }
    };
})

app.controller("ConfirmationController", function($scope, $uibModalInstance) {
    $scope.ok = function() {
        $uibModalInstance.close('ok');
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
});