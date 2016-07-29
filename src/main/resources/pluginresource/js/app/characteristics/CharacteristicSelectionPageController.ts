import {Characteristic} from "../types/character/Characteristic";
import {IScope} from "angular";
/**
 * Created by Damien on 7/20/2016.
 */
export class CharacteristicSelectionPageController {
    private characteristicValues:Map<Characteristic, number> = new Map<Characteristic, number>();

    constructor($scope:IScope, $uibModal, $state, characterService, dice) {
        $scope["characteristicNames"] = Array.from(Characteristic.characteristics.keys());
    };
}