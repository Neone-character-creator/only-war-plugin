import { CharacterAdvancement } from "./CharacterAdvancement";
import { AdvanceableProperty } from "../Character";
import { OnlyWarCharacterModifierTypes } from "../CharacterModifier";
/**
 * An advancement to character psyrating.
 * Created by Damien on 6/29/2016.
 */
export class PsyRatingAdvancement extends CharacterAdvancement {
    constructor() {
        super(AdvanceableProperty.PSY_RATING, new Map(), new Map(), [], [], [], [], 0, 0, OnlyWarCharacterModifierTypes.ADVANCEMENT);
    }
    apply(character) {
        character.powers.psyRating += 1;
    }
    /**
     * Returns the amount this advancement increased the character's psy rating.
     *
     * Should only ever be 1.
     * @returns {number}
     */
    get value() {
        return 1;
    }
}
//# sourceMappingURL=PsyRatingAdvancement.js.map