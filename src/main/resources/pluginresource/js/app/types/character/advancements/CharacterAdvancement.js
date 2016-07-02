import { CharacterModifier } from "../CharacterModifier";
/**
 * An advancement to a character, purchased with xp.
 *
 * Created by Damien on 6/29/2016.
 */
export class CharacterAdvancement extends CharacterModifier {
    constructor(property, characteristics, skills, talents, aptitudes, traits, kit, wounds, psyRating, type) {
        super(characteristics, skills, talents, aptitudes, traits, kit, wounds, psyRating, type);
        /**
         * Other advancements that add values that  fasdfasdfasdfasdfasdf
         * @type {Array}
         */
        this.prerequisiteAdvances = [];
        this._property = property;
    }
    get property() {
        return this._property;
    }
    ;
}
//# sourceMappingURL=CharacterAdvancement.js.map