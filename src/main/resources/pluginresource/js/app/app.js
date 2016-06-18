require.config({
    baseUrl: "pluginresource/js/",
    "paths": {
        "angular": "libs/angular/angular",
        "bootstrap": "libs/bootstrap/dist/js/bootstrap",
        "angular-resource": "libs/angular-resource/angular-resource",
        "ui-router": "libs/angular-ui-router/release/angular-ui-router",
        "dragdrop": "libs/angular-dragdrop/src/angular-dragdrop",
        "jquery": "libs/jquery/dist/jquery.min",
        "jquery-ui": "libs/jquery-ui/jquery-ui",
        "angular-ui": "libs/angular-bootstrap/ui-bootstrap-tpls",
        "angular-filter": "libs/angular-filter/dist/angular-filter",
        "cookies": "libs/js-cookie/src/js.cookie"
    },
    shim: {
        "jquery": {
            exports: "$"
        },
        "angular": {
            exports: "angular"
        },
        "ui-router": {
            deps: ['angular']
        },
        "angular-resource": {
            deps: ["angular"]
        },
        "jquery-ui": {
            deps: ["jquery"]
        },
        "dragdrop": {
            deps: ['angular', 'jquery-ui']
        },
        "angular-ui": {
            deps: ['angular']
        },
        "angular-filter": {
            deps: ['angular']
        },
        "angular-cookies": {
            deps: ['angular'],
            exports: 'angularCookies'
        },
        "bootstrap": {
            deps: ['jquery']
        }
    }
});

define(["angular", "bootstrap", "ui-router", "angular-resource", "angular-ui", "dragdrop", "angular-filter", "cookies",
        "app/modifier-controller", "app/characteristics/characteristics-controller", "app/specialty/starting-powers-controller", "app/nav/selection-modal", "app/sheet/sheet-controller", "app/nav/confirmation-modal", "app/finalize/finalize-controller", "app/sheet/characteristic-tooltip-controller", "app/sheet/armor-tooltip-controller", "app/regiments/regiment-creation-controller",
        "app/services/selection", "app/services/modifier-service", "app/services/character", "app/services/characteroptions", "app/services/dice", "app/services/characteristic-tooltip-service", "app/services/armor-tooltip-service", "app/services/regimentoptions", "app/services/option-selection", "app/services/tutorials"
    ],
    function(angular, bootstrap, uirouter, resource, angularui, dragdrop, angularFilter, cookies,
        modifierControllerFactory, characteristicsController, startingPowersController, selectionModalController, sheetController, confirmationController, finalizeController, characteristicTooltipController, armorTooltipController, regimentCreationController,
        selectionService, modifierService, characterService, characterOptions, diceService, characteristicTooltipService, armorTooltipService, regimentOptions, optionSelection, tutorials) {
        var app = angular.module("OnlyWar", ["ui.router", "ngResource", "ui.bootstrap", "ngDragDrop", "angular.filter"]);

        app.config(function($stateProvider) {
            $stateProvider.state("default",{
            	url: "",
            	onEnter : function($state){
            		$state.go("sheet");
            	}
            }).state("sheet", {
                url: "/",
                templateUrl: "pluginresource/templates/sheet.html",
                controller: sheetController
            }).state("regiment", {
                url: "/regiment",
                templateUrl: "pluginresource/templates/regiment-specialty-page.html",
                controller: modifierControllerFactory("regiments")
            }).state("characteristics", {
                url: "/characteristics",
                templateUrl: "pluginresource/templates/characteristics.html",
                controller: characteristicsController
            }).state("specialty", {
                url: "/specialty",
                templateUrl: "pluginresource/templates/regiment-specialty-page.html",
                controller: modifierControllerFactory("specialties")
            }).state("finalize", {
                url: "/finalize",
                templateUrl: "pluginresource/templates/finalize.html",
                controller: finalizeController
            }).state("createRegiment", {
                url: "/regiment/create",
                templateUrl: "pluginresource/templates/regiment-creation.html",
                controller: regimentCreationController
            })
            .state("modal", {
            	abstract:true,
//            	views:{
//            		"modal":{
//            			templateUrl : "pluginresource/templates/modal.html"
//            		}
//            	}
            })
            .state("modal.tutorial", {
            	onEnter: function($state, $uibModal){
            		$uibModal.open({
            			templateUrl : "pluginresource/templates/tutorial.html"
            		})
            	}
            });
        });

        $()

        //Register services
        app.factory("regiments", modifierService)
        app.factory("selection", selectionService);
        app.factory("optionselection", optionSelection);
        app.factory("specialties", modifierService);
        app.factory("characterService", characterService);
        app.factory("characteroptions", characterOptions);
        app.factory("dice", diceService);
        app.factory("characteristicTooltipService", characteristicTooltipService);
        app.factory("armorTooltipService", armorTooltipService);
        app.factory("regimentOptions", regimentOptions);
        app.factory("cookies", function(){return cookies});
        app.factory("tutorials", tutorials);

        //Register additional controllers not used by the main pages below
        app.controller("SelectionModalController", selectionModalController);
        app.controller("ConfirmationController", confirmationController);
        app.controller("CharacteristicToolTipController", characteristicTooltipController);
        app.controller("StartingPowersController", startingPowersController);
        app.controller("ArmorTooltipController", armorTooltipController);
        app.controller("RegimentCreationController", regimentCreationController);

        app.run(function($rootScope, $state) {
            $rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams) {
                $state.previous = fromState;
                $state.previousParams = fromParams;
            });
            $rootScope.$on("$stateChangeError", function(event) {
                console.log(event);
            });
            $("modal-container").on("hidden.bs.modal", function(e){

            });
        });

        //Filter for formatting a clickable summary for a selection.
        app.filter('option_summary', function() {
                return function(inVal) {
                    if (typeof inVal.selections === 'number' && Array.isArray(inVal.options)) {
                        var out = "Choose " + inVal.selections + " from ";
                        var options = [];
                        $.each(inVal.options, function(index, option) {
                            var optionElements = [];
                            for (var op = 0; op < option.length; op++) {
                                switch (option[op].property) {
                                    case 'characteristics':
                                        for (var characteristic in option[op].value) {
                                            optionElements.push(characteristic + " +" + option[op].value[characteristic])
                                        }
                                        break;

                                    case 'talents':
                                        optionElements.push(option[op].value.name);
                                        break;
                                    case 'skills':
                                        for (var skill in option[op].value) {
                                            optionElements.push(skill + " + " + (option[op].value[skill] - 1) * 10);
                                        }
                                        break;
                                }
                                if (Array.isArray(option[op].property)) {
                                    optionElements.push(option[op].value.count + " x " + option[op].value.item.name);
                                }
                            }
                            options.push(optionElements.join(", "));
                        });
                        out += options.join(" or ");
                        return out;
                    } else {
                        return inVal;
                    }
                };
            })
            //Filter for formatting an selectable option in a modal.
        app.filter('modal_option', function() {
            function filter(inVal) {
                if (Array.isArray(inVal)) {
                    var elements = [];
                    $.each(inVal, function(index, element) {
                        var optionElements = [];
                        if (!Array.isArray(element.property)) {
                            switch (element.property) {
                                case "talents":
                                    optionElements.push(element.value.name);
                                    break;
                                case "skills":
                                    for (var skill in element.value) {
                                        var rating = (element.value[skill] - 1);
                                        optionElements.push(skill + (rating ? "+ " + rating * 10 : ''))
                                    };
                                    break;
                                case "characteristics":
                                    for (var characteristic in element.value) {
                                        optionElements.push(characteristic + " +" + element.value[characteristic])
                                    };
                                    break;
                            }
                        } else {
                            switch (element.property[0]) {
                                case "character kit":
                                    optionElements.push(element.value.count + " x " + element.value.item.name);
                            }
                        }
                        elements.push(optionElements.join(", "));
                    });
                    return elements.join(", ");
                } else {
                    var description = inVal.value.item.craftsmanship + " Craftsmanship";
                    description += " " + inVal.value.item.name;
                    if (inVal.upgrades) {
                        description += " w/ ";
                        description += inVal.value.upgrades.join(", ");
                    }
                    return description;
                }
            }
            return filter;
        });

        angular.bootstrap(document, ['OnlyWar']);

        character = function(value) {
            var characterService = angular.element(document.body).injector().get("character");
            if (value) {
                characterService.character = value;
                angular.element(document.body).injector().get("$state").reload();
            } else {
                var characterService = angular.element(document.body).injector().get("character");
                return characterService.character;
            }
        };

        exportCharacter = function() {
            var toExport = {};
            var characterService = angular.element(document.body).injector().get("character");
            var character = angular.copy(characterService.character);
            toExport.name = character.name;
            toExport.player = character.player;
            toExport.regiment = character.regiment;
            toExport.specialty = character.specialty;
            toExport.demeanor = character.demeanor;
            toExport.description = character.description;
            toExport.characteristics = character.characteristics;
            Object.keys(toExport.characteristics).map(function(value, index) {
                toExport.characteristics[value] = toExport.characteristics[value].total()
            });
            toExport.skills = character.skills;
            toExport.talents = character.talent;
            toExport.traits = character.traits;
            toExport.wounds = {
                total: character.wounds.total,
                criticalInjuries: character.wounds.criticalInjuries
            };
            toExport.insanity = character.insanity;
            toExport.corruption = character.corruption;
            toExport.speed = {
                half: character.speed.half,
                full: character.speed.full,
                charge: character.speed.charge,
                run: character.speed.run
            };
            toExport.fatePoints = character.fatePoints;
            toExport.equipment = character.equipment;
            toExport.experience = {
                total: character.experience.total,
                available: character.experience.available
            };
            toExport.aptitudes = character.aptitudes.all;
            toExport.psychicPowers = character.psychicPowers;
            toExport.fatigue = character.fatigue;
            return toExport;
        }
        return app;
    });