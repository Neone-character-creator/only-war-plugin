import { CharacterAdvancement } from "./CharacterAdvancement";
import { AdvanceableProperty } from "../Character";
import { OnlyWarCharacterModifierTypes } from "../CharacterModifier";
/**
 * An advancement that improves a characteristic.
 * Created by Damien on 6/29/2016.
 */
export class CharacteristicAdvancement extends CharacterAdvancement {
    /**
     * The name of the characteristic that the advancement improves.
     * @param characteristic
     */
    constructor(value) {
        var characteristics = new Map();
        characteristics.set(value, 5);
        super(AdvanceableProperty.CHARACTERISTIC, characteristics, new Map(), [], [], [], [], 0, 0, OnlyWarCharacterModifierTypes.ADVANCEMENT);
        this.characteristic = value;
    }
    apply(character) {
        character.characteristics.get(this.value).advancements.push(this);
    }
    /**
     * Returns the name of the characteristic this advancement improves.
     * @returns {string}
     */
    get value() {
        return this.characteristic;
    }
    applyCharacteristicModifiers(character) {
        character.characteristics.get(this.value).advancements.push(this);
    }
}
//# sourceMappingURL=CharacteristicAdvancement.js.map