/**
 * A single characteristic value.
 */
export class CharacteristicValue {
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
        switch (characteristic) {
            case CharacteristicName.WEAPON_SKILL:
                this._name = "Weapon Skill";
                break;
            case CharacteristicName.BALLISTIC_SKILL:
                this._name = "Ballistic Skill";
                break;
            case CharacteristicName.STRENGTH:
                this._name = "Strength";
                break;
            case CharacteristicName.AGILITY:
                this._name = "Agility";
                break;
            case CharacteristicName.INTELLIGENCE:
                this._name = "Intelligence";
                break;
            case CharacteristicName.PERCEPTION:
                this._name = "Perception";
                break;
            case CharacteristicName.FELLOWSHIP:
                this._name = "Fellowship";
                break;
            case CharacteristicName.TOUGHNESS:
                this._name = "Toughness";
                break;
            case CharacteristicName.WILLPOWER:
                this._name = "Willpower";
                break;
        }
    }
    get name() {
        return this._name;
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
    set name(value) {
        this._name = value;
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
export var CharacteristicName;
(function (CharacteristicName) {
    CharacteristicName[CharacteristicName["WEAPON_SKILL"] = 0] = "WEAPON_SKILL";
    CharacteristicName[CharacteristicName["BALLISTIC_SKILL"] = 1] = "BALLISTIC_SKILL";
    CharacteristicName[CharacteristicName["STRENGTH"] = 2] = "STRENGTH";
    CharacteristicName[CharacteristicName["AGILITY"] = 3] = "AGILITY";
    CharacteristicName[CharacteristicName["TOUGHNESS"] = 4] = "TOUGHNESS";
    CharacteristicName[CharacteristicName["INTELLIGENCE"] = 5] = "INTELLIGENCE";
    CharacteristicName[CharacteristicName["WILLPOWER"] = 6] = "WILLPOWER";
    CharacteristicName[CharacteristicName["PERCEPTION"] = 7] = "PERCEPTION";
    CharacteristicName[CharacteristicName["FELLOWSHIP"] = 8] = "FELLOWSHIP";
})(CharacteristicName || (CharacteristicName = {}));
//# sourceMappingURL=Characteristic.js.map