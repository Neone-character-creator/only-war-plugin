define(["require", "exports", "./CharacterAdvancement", "../Character", "../CharacterModifier"], function (require, exports, CharacterAdvancement_1, Character_1, CharacterModifier_1) {
    "use strict";
    /**
     * Created by Damien on 6/29/2016.
     */
    class TalentAdvancement extends CharacterAdvancement_1.CharacterAdvancement {
        constructor(talent) {
            super(Character_1.AdvanceableProperty.TALENT, new Map(), new Map(), [talent], [], [], [], 0, 0, CharacterModifier_1.OnlyWarCharacterModifierTypes.ADVANCEMENT);
            this.talent = talent;
        }
        apply(character) {
            character.talents.push(this.value);
        }
        /**
         * Return the talent this advancement gave the character.
         * @returns {Talent}
         */
        get value() {
            return this.talent;
        }
    }
    exports.TalentAdvancement = TalentAdvancement;
});
//# sourceMappingURL=TalentAdvancement.js.map