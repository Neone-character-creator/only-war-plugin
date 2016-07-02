import {CharacterAdvancement} from "./CharacterAdvancement";
import {Talent} from "../Talent";
import {AdvanceableProperty, OnlyWarCharacter} from "../Character";
import {OnlyWarCharacterModifierTypes} from "../CharacterModifier";
/**
 * Created by Damien on 6/29/2016.
 */
export class TalentAdvancement extends CharacterAdvancement {
    private talent:Talent;

    apply(character:OnlyWarCharacter) {
        character.talents.push(this.value);
    }

    constructor(talent:Talent) {
        super(AdvanceableProperty.TALENT, new Map(), new Map(), [talent], [], [], [], 0, 0, OnlyWarCharacterModifierTypes.ADVANCEMENT);
        this.talent = talent;
    }

    /**
     * Return the talent this advancement gave the character.
     * @returns {Talent}
     */
    get value():Talent {
        return this.talent;
    }
}