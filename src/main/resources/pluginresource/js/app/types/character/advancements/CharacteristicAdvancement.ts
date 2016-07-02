import {CharacterAdvancement} from "./CharacterAdvancement";
import {AdvanceableProperty, OnlyWarCharacter} from "../Character";
import {CharacteristicName} from "../Characteristic";
import {OnlyWarCharacterModifierTypes} from "../CharacterModifier";
/**
 * An advancement that improves a characteristic.
 * Created by Damien on 6/29/2016.
 */

export class CharacteristicAdvancement extends CharacterAdvancement {
    private characteristic:CharacteristicName;

    apply(character:OnlyWarCharacter):void {
        character.characteristics.get(this.value).advancements.push(this);
    }

    /**
     * The name of the characteristic that the advancement improves.
     * @param characteristic
     */
    constructor(value:CharacteristicName) {
        var characteristics = new Map<CharacteristicName, number>();
        characteristics.set(value, 5);
        super(AdvanceableProperty.CHARACTERISTIC,
            characteristics,
            new Map(),
            [],
            [],
            [],
            [],
            0,
            0,
            OnlyWarCharacterModifierTypes.ADVANCEMENT);
        this.characteristic = value;
    }

    /**
     * Returns the name of the characteristic this advancement improves.
     * @returns {string}
     */
    get value():CharacteristicName {
        return this.characteristic;
    }


    protected applyCharacteristicModifiers(character:OnlyWarCharacter):any {
        character.characteristics.get(this.value).advancements.push(this);
    }
}