import { CharacterModifier, OnlyWarCharacterModifierTypes } from "./CharacterModifier";
/**
 * Created by Damien on 6/29/2016.
 */
export class Specialty extends CharacterModifier {
    constructor(characteristics, skills, talents, aptitudes, traits, kit, wounds) {
        super(characteristics, skills, talents, aptitudes, traits, kit, wounds, 0, OnlyWarCharacterModifierTypes.SPECIALTY);
    }
}
//# sourceMappingURL=Specialty.js.map