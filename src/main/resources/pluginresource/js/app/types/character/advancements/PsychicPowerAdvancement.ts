import {CharacterAdvancement} from "./CharacterAdvancement";
import {AdvanceableProperty, OnlyWarCharacter} from "../Character";
import {PsychicPower} from "../PsychicPower";
import {OnlyWarCharacterModifierTypes} from "../CharacterModifier";
/**
 * Created by Damien on 6/29/2016.
 */
export class PsychicPowerAdvancement extends CharacterAdvancement {
    apply(character:OnlyWarCharacter) {
        character.powers.addPower(this.value, this.isBonus);
    }

    private isBonus:boolean;
    private power:PsychicPower;

    constructor(value:PsychicPower, isBonus:boolean) {
        super(AdvanceableProperty.PSYCHIC_POWER,
            new Map(),
            new Map(),
            [],
            [],
            [],
            [],
            0,
            0,
            OnlyWarCharacterModifierTypes.ADVANCEMENT);
        this.isBonus = isBonus;
    }

    get value():PsychicPower {
        return this.power;
    }
}