import { CharacterAdvancement } from "./CharacterAdvancement";
import { AdvanceableProperty } from "../Character";
import { OnlyWarCharacterModifierTypes } from "../CharacterModifier";
/**
 * Created by Damien on 6/29/2016.
 */
export class PsychicPowerAdvancement extends CharacterAdvancement {
    constructor(value, isBonus) {
        super(AdvanceableProperty.PSYCHIC_POWER, new Map(), new Map(), [], [], [], [], 0, 0, OnlyWarCharacterModifierTypes.ADVANCEMENT);
        this.isBonus = isBonus;
    }
    apply(character) {
        character.powers.addPower(this.value, this.isBonus);
    }
    get value() {
        return this.power;
    }
}
//# sourceMappingURL=PsychicPowerAdvancement.js.map