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
        super(AdvanceableProperty.TALENT, new Map(), [], [talent], [], [], [], 0, 0, OnlyWarCharacterModifierTypes.ADVANCEMENT);
        this.talent = talent;
    }

    /**
     * Return the talent this advancement gave the character.
     * @returns {Talent}
     */
    get value():Talent {
        return this.talent;
    }

    public calculateExperienceCost(character:OnlyWarCharacter):number {
        var aptitudeMatch:number = 0;
        this.talent.aptitudes.forEach((aptitude) => {
            if (character.aptitudes.indexOf(aptitude) !== -1) {
                aptitudeMatch++;
            }
        });
        switch (aptitudeMatch) {
            case 0:
                return (this.talent.tier) * 300;
            case 1:
                return (this.talent.tier) * 150;
            case 2:
                return (this.talent.tier) * 100;
        }
    }
}