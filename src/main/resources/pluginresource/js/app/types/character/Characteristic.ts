import {CharacteristicAdvancement} from "./advancements/CharacteristicAdvancement";
/**
 * A single characteristic value.
 */
export class CharacteristicValue {

    constructor(characteristic:Characteristic) {
        this._characteristic = characteristic;
    }

    /**
     * The characteristic.
     */
    private _characteristic:Characteristic;
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

    get characteristic():Characteristic {
        return this._characteristic;
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

export class Characteristic {
    public static characteristics:Map<string, Characteristic> = new Map(
        [
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

    _name:string;
    _aptitudes:Array < string >;

    get name():string {
        return this._name;
    }

    get aptitudes():Array < string > {
        return this._aptitudes;
    }

    constructor(name:string, aptitudes:Array < string >) {
        this._name = name;
        this._aptitudes = aptitudes;
    }
}