import {Characteristic} from "../../app/types/character/Characteristic";
import {IScope} from "angular";
/**
 * Created by Damien on 7/20/2016.
 */
export class CharacteristicSelectionPageController {
    constructor($scope:IScope, $uibModal, $state, characterService, dice) {
        $scope["characteristicNames"] = Array.from(Characteristic.characteristics.keys());
    };

    private characteristicValues:Map<Characteristic, number> = new Map<Characteristic, number>();
}