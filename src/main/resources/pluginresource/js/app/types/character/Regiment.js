define(["require", "exports", "./CharacterModifier"], function (require, exports, CharacterModifier_1) {
    "use strict";
    /**
     * A fully complete regiment modifier
     * Created by Damien on 6/27/2016.
     */
    class Regiment extends CharacterModifier_1.CharacterModifier {
        constructor(characteristics, skills, talents, aptitudes, traits, kit, wounds) {
            super(characteristics, skills, talents, aptitudes, traits, kit, wounds, 0, CharacterModifier_1.OnlyWarCharacterModifierTypes.REGIMENT);
        }
        applyCharacteristicModifiers(character) {
            for (var characteristic of this._characteristics) {
                character.characteristics.get(characteristic[0]).regimentModifier = characteristic[1];
            }
        }

        applyWoundsModifier(character) {
            character.wounds.regimentModifier = this._wounds;
        }
    }
    exports.Regiment = Regiment;
});
//# sourceMappingURL=Regiment.js.map