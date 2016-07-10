define(["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * A single characteristic value.
     */
    class CharacteristicValue {
        constructor(characteristic) {
            /**
             * Base value of the characteristic, set by roll.
             */
            this._rolled = 0;
            /**
             * The modifier to the characteristic from the character specialty.
             */
            this._specialtyModifier = 0;
            /**
             * The modifier to the characteristic from the characters regiment.
             */
            this._regimentModifier = 0;
            /**
             * All the advancements that have been applied to this characteristic.
             */
            this._advancements = [];
            this._characteristic = characteristic;
        }

        get characteristic() {
            return this._characteristic;
        }

        get rolled() {
            return this._rolled;
        }

        get regimentModifier() {
            return this._regimentModifier;
        }

        get specialtyModifier() {
            return this._specialtyModifier;
        }

        get advancements() {
            return this._advancements;
        }

        set rolled(value) {
            this._rolled = value;
        }

        set regimentModifier(value) {
            this._regimentModifier = value;
        }

        set specialtyModifier(value) {
            this._specialtyModifier = value;
        }
        /**
         * Get the value of the characteristic.
         */
        get total() {
            return this._rolled + this._regimentModifier + this._specialtyModifier + (this._advancements.length * 5);
        }
        /**
         * Returns the characteristic bonus, which is equal to the value divided by 10.
         * @returns {number}
         */
        get bonus() {
            return Math.floor(this.total / 10);
        }
    }
    exports.CharacteristicValue = CharacteristicValue;
    class Characteristic {
        constructor(name, aptitudes) {
            this._name = name;
            this._aptitudes = aptitudes;
        }

        get name() {
            return this._name;
        }

        get aptitudes() {
            return this._aptitudes;
        }
    }
    Characteristic.characteristics = new Map([
        ["Weapon Skill", new Characteristic("Weapon Skill", ["Weapon Skill", "Offence"])],
        ["Ballistic Skill", new Characteristic("Weapon Skill", ["Weapon Skill", "Offence"])],
        ["Strength", new Characteristic("Weapon Skill", ["Weapon Skill", "Offence"])],
        ["Toughness", new Characteristic("Weapon Skill", ["Weapon Skill", "Offence"])],
        ["Agility", new Characteristic("Weapon Skill", ["Weapon Skill", "Offence"])],
        ["Intelligence", new Characteristic("Weapon Skill", ["Weapon Skill", "Offence"])],
        ["Perception", new Characteristic("Weapon Skill", ["Weapon Skill", "Offence"])],
        ["Willpower", new Characteristic("Weapon Skill", ["Weapon Skill", "Offence"])],
        ["Fellowship", new Characteristic("Weapon Skill", ["Weapon Skill", "Offence"])]
    ]);
    exports.Characteristic = Characteristic;
});
//# sourceMappingURL=Characteristic.js.map