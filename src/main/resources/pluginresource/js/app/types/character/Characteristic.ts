import {CharacteristicAdvancement} from "./advancements/CharacteristicAdvancement";
/**
 * A single characteristic value.
 */
export class CharacteristicValue {

    constructor(characteristic:CharacteristicName) {
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

    /**
     * The name of the characteristic.
     */
    private _name:String;
    /**
     * Base value of the characteristic, set by roll.
     */
    private _rolled:number = 0;
    /**
     * The modifier to the characteristic from the character specialty.
     */
    private _specialtyModifier:number = 0;
    /**
     * The modifier to the characteristic from the characters regiment.
     */
    private _regimentModifier:number = 0;
    /**
     * All the advancements that have been applied to this characteristic.
     */
    private _advancements:Array<CharacteristicAdvancement> = [];

    get name():String {
        return this._name;
    }

    get rolled():number {
        return this._rolled;
    }

    get regimentModifier():number {
        return this._regimentModifier;
    }

    get specialtyModifier():number {
        return this._specialtyModifier;
    }

    get advancements():Array<CharacteristicAdvancement> {
        return this._advancements;
    }

    set name(value:String) {
        this._name = value;
    }

    set rolled(value:number) {
        this._rolled = value;
    }

    set regimentModifier(value:number) {
        this._regimentModifier = value;
    }

    set specialtyModifier(value:number) {
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

export enum CharacteristicName{
    WEAPON_SKILL,
    BALLISTIC_SKILL,
    STRENGTH,
    AGILITY,
    TOUGHNESS,
    INTELLIGENCE,
    WILLPOWER,
    PERCEPTION,
    FELLOWSHIP
}