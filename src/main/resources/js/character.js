var app = angular.module("OnlyWar", ["ui.router", "ngResource", "ui.bootstrap", "ngDragDrop"])
    .filter('option_summary', function() {
        return function(inVal) {
            if (typeof inVal.selections === 'number' && Array.isArray(inVal.options)) {
                var out = "Choose " + inVal.selections + " from ";
                var options = [];
                $.each(inVal.options, function(index, option) {
                    var optionElements = [];
                    for (var op = 0; op < option.length; op++) {
                        switch (option[op].property) {
                            case 'characteristics':
                                {
                                    break;
                                }
                            case 'talents':
                            case 'skills':
                                optionElements.push(option[op].value);
                                break;
                        }
                        if (Array.isArray(option[op].property)) {
                            for (var name in option[op].value) {
                                if (option[op].value.hasOwnProperty(name) && name.substring(1) !== "$") {
                                    optionElements.push(option[op].value[name] + " x " + name);
                                }
                            }

                        }
                    }
                    options.push(optionElements.join(", "))
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
            var elements = [];
            $.each(inVal, function(index, element) {
                if (!Array.isArray(element.property)) {
                    switch (element.property) {
                        case "skills":
                        case "talents":
                            elements.push(element.value);
                            break;
                    }
                }

            });
            return elements.join(", ");
        }
        return filter;
    });

//Character service.
app.factory("character", function() {
    var character = function() {
        return {
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
        character: character(),
        "new": function() {
            this.character = character();
        }
    };
    return service;
});

//Specialties service. Stored loaded specialty definitions and the state of the currently selected one.
app.factory("specialties", function($resource, $q) {
    var specialties = $resource("Character/Specialties.json").query();
    var specialtiesNameToIndex = {};

    var service = {
        specialtyNames: function() {
            var d = $q.defer();
            specialties.$promise.then(function(data) {
                for (var i = 0; i < data.length; i++) {
                    specialtiesNameToIndex[data[i].name] = i;
                }
                specialtyNames = Object.keys(specialtiesNameToIndex);
                d.resolve(specialtyNames);
            });
            return d.promise;
        },
        selected: null,
        requiredOptionSelections: [],
        dirty: false,
        selectSpecialty: function(specialtyName) {
            this.selected = Object.clone(specialties[specialtiesNameToIndex[specialtyName]]);
            this.requiredOptionSelections = this.selected['optional modifiers'];
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
        choose: function(selectedIndices) {
            var selectionObject = this.selectionObject;
            var associatedService = this.associatedService;
            var target = this.target;
            $.each(selectedIndices, function(index, selectedIndex) {
                associatedService.requiredOptionSelections.splice(associatedService.requiredOptionSelections.indexOf(selectionObject), 1);

                var chosen = selectionObject.options[selectedIndex];

                for (var sub = 0; sub < chosen.length; sub++) {
                    var fixedModifier = target['fixed modifiers'];
                    var properties;
                    if (Array.isArray(chosen[sub]["property"])) {
                        properties = chosen[sub]["property"];
                    } else {
                        properties = [chosen[sub]["property"]];
                    };

                    for(var p = 0; p < properties.length; p++){
                    if (fixedModifier[properties[p]] === undefined) {
                        switch (properties[p]) {
                            case 'character kit':
                                fixedModifier['character kit'] = {};
                                break;
                            case 'other gear':
                                fixedModifier['other gear'] = [];
                                break;
                        };
                        }
                        fixedModifier = fixedModifier[properties[p]];
                    };
                    if (chosen[sub].value === 'object') {
                        for (var prop in chosen[sub].value) {
                            if (chosen[sub].value.hasOwnProperty(prop)) {
                                fixedModifier[prop] = chosen[sub].value[prop];
                            }
                        }
                    } else {
                        fixedModifier.push(chosen[sub].value);
                    };
                }
            })
            this.associatedService.dirty = true;
        }
    }
});

app.controller("ConfirmationController", function($scope, $uibModalInstance) {
    $scope.ok = function() {
        $uibModalInstance.close('ok');
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
});