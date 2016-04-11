require.config({
    baseUrl: "js/",
    "paths": {
        "angular": "libs/angular/angular",
        "angular-resource": "libs/angular-resource/angular-resource",
        "ui-router": "libs/angular-ui-router/release/angular-ui-router",
        "dragdrop": "libs/angular-dragdrop/src/angular-dragdrop",
        "jquery": "libs/jquery/dist/jquery.min",
        "jquery-ui": "libs/jquery-ui/jquery-ui",
        "mootools-core": "libs/mootools/dist/mootools-core",
        "angular-ui" : "libs/angular-bootstrap/ui-bootstrap-tpls",
    },
    shim : {
    	"jquery" : {
    		exports : "$"
    	},
    	"angular" : {
    		exports : "angular"
    	},
    	"ui-router" : {
    		deps : ['angular']
    	},
    	"angular-resource" : {
    		deps : ["angular"]
    	},
    	"jquery-ui" : {
    		deps : ["jquery"]
    	},
    	"dragdrop" : {
    		deps : ['angular', 'jquery-ui']
    	},
    	"angular-ui" : {
    		deps : ['angular']
    	}
    }
});

define(["angular", "ui-router", "angular-resource", "angular-ui", "dragdrop",
"app/modifier-controller", "app/characteristics/characteristics-controller", "app/specialty/starting-powers-controller", "app/nav/selection-modal", "app/sheet/sheet-controller", "app/nav/confirmation-modal", "app/finalize/finalize-controller", "app/sheet/characteristic-tooltip-controller", "app/sheet/armor-tooltip-controller",
"app/services/selection", "app/services/modifier-service", "app/services/character", "app/services/characteroptions", "app/services/dice", "app/services/characteristic-tooltip-service", "app/services/armor-tooltip-service"],
	function(angular, uirouter, resource, angularui, dragdrop,
	modifierControllerFactory, characteristicsController, startingPowersController, selectionModalController, sheetController, confirmationController, finalizeController, characteristicTooltipController, armorTooltipController,
	selectionService, modifierService, characterService, characterOptions, diceService, characteristicTooltipService, armorTooltipService) {
    var app = angular.module("OnlyWar", ["ui.router", "ngResource", "ui.bootstrap", "ngDragDrop"]);

	//Register services
    app.factory("regiments", modifierService)
    app.factory("selection", selectionService);
    app.factory("specialties", modifierService);
    app.factory("character", characterService);
    app.factory("characteroptions", characterOptions);
    app.factory("dice", diceService);
    app.factory("characteristicTooltipService", characteristicTooltipService);
    app.factory("armorTooltipService", armorTooltipService);

	//Register additional controllers not used by the main pages below
	app.controller("SelectionModalController", selectionModalController);
	app.controller("SheetController", sheetController);
	app.controller("ConfirmationController", confirmationController);
	app.controller("CharacteristicToolTipController", characteristicTooltipController);
	app.controller("StartingPowersController", startingPowersController);
	app.controller("ArmorTooltipController", armorTooltipController);

    app.config(function($stateProvider){
        $stateProvider.state("sheet", {
        	url: "/",
            templateUrl: "templates/sheet.html",
            controller : sheetController
		}).state("regiment", {
			url: "/regiment",
			templateUrl: "templates/regiment-specialty-page.html",
			controller : modifierControllerFactory("regiments")
		}).state("characteristics", {
			url: "/characteristics",
			templateUrl: "templates/characteristics.html",
			controller : characteristicsController
		}).state("specialty", {
			url: "/specialty",
			templateUrl: "templates/regiment-specialty-page.html",
			controller : modifierControllerFactory("specialties")
		}).state("finalize", {
			url: "/finalize",
			templateUrl: "templates/finalize.html",
			controller : finalizeController
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
                                	for(var characteristic in option[op].value){
                                		optionElements.push(characteristic + " +" + option[op].value[characteristic])
                                	}
                                	break;

                                case 'talents':
                                	optionElements.push(option[op].value.name);
                                	break;
                                case 'skills':
                                	for(var skill in option[op].value){
                                		optionElements.push(skill + " + " + (option[op].value[skill] - 1) * 10 );
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
            var elements = [];
            $.each(inVal, function(index, element) {
            	var optionElements = [];
                if (!Array.isArray(element.property)) {
                    switch (element.property) {
                        case "talents":
                            optionElements.push(element.value.name);
                            break;
                        case "skills":
                        for(var skill in element.value){
                        	var rating = (element.value[skill]-1);
                        	optionElements.push(skill + (rating? "+ " + rating * 10:''))
                        };
                        break;
                        case "characteristics" :
                        for(var characteristic in element.value){
                        	optionElements.push(characteristic + " +" + element.value[characteristic])
                        };
                        break;
                    }
                } else {
                	switch(element.property[0]){
                		case "character kit" :
                			optionElements.push(element.value.count + " x " + element.value.item.name);
                	}
                }
                elements.push(optionElements.join(", "));
            });
            return elements.join(", ");
        }
        return filter;
    });

    angular.bootstrap(document, ['OnlyWar']);
    return app;
});

var character = function(){
}