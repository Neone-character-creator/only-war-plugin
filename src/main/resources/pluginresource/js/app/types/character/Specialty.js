define(["require", "exports", "./CharacterModifier"], function (require, exports, CharacterModifier_1) {
    "use strict";
    /**
     * Created by Damien on 6/29/2016.
     */
    class Specialty extends CharacterModifier_1.CharacterModifier {
        constructor(characteristics, skills, talents, aptitudes, traits, kit, wounds) {
            super(characteristics, skills, talents, aptitudes, traits, kit, wounds, 0, CharacterModifier_1.OnlyWarCharacterModifierTypes.SPECIALTY);
        }

        applyWoundsModifier(character) {
            character.wounds.specialtyModifier = this._wounds;
        }
    }
    exports.Specialty = Specialty;
});
//# sourceMappingURL=Specialty.js.map