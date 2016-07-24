/// <reference path="../../libs/globals/jasmine/index.d.ts" />
import {
    CharacteristicSelectionPageController
} from "../../app/characteristics/CharacteristicSelectionPageController";
import {Characteristic} from "../../app/types/character/Characteristic";
import * as angular from "angular";
import IInjectStatic = angular.IInjectStatic;
/**
 * Created by Damien on 7/20/2016.
 */

describe("The  page controller", ()=> {
    var mockScope, mockUibModal, mockState, mockCharacterService, mockDice;
    beforeEach(()=> {
        angular.module("OnlyWar", []);
    });
    beforeEach(()=> {
        angular.mock.inject(($rootScope)=> {
            mockScope = $rootScope.$new();
        });
    });

    var theController = new CharacteristicSelectionPageController(mockScope, mockUibModal, mockState, mockCharacterService, mockDice);
    it("must keep track of the rolled value of each characteristic", ()=> {
        for (var characteristic of Characteristic.characteristics.keys()) {
            expect(mockScope["characteristicNames"].find(definedCharacteristic=> {
                return characteristic === definedCharacteristic;
            })).toBeDefined();
        }
        ;
    });
    it("must be able to generate random numbers for all characteristics at once", ()=> {

    });
});