import {CharacterAdvancement} from "./CharacterAdvancement";
import {AdvanceableProperty, OnlyWarCharacter} from "../Character";
import {OnlyWarCharacterModifierTypes} from "../CharacterModifier";
/**
 * An advancement to character psyrating.
 * Created by Damien on 6/29/2016.
 */
export class PsyRatingAdvancement extends CharacterAdvancement {
    apply(character:OnlyWarCharacter) {
        character.powers.psyRating += 1;
    }

    constructor() {
        super(AdvanceableProperty.PSY_RATING, new Map(), new Map(), [], [], [], [], 0, 0, OnlyWarCharacterModifierTypes.ADVANCEMENT);
    }

    /**
     * Returns the amount this advancement increased the character's psy rating.
     *
     * Should only ever be 1.
     * @returns {number}
     */
    get value():number {
        return 1;
    }
}