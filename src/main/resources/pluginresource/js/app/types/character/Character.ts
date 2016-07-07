import {Regiment} from "./Regiment";
import {Specialty} from "./Specialty";
import {CharacteristicValue, Characteristic} from "./Characteristic";
import {Skill} from "./Skill";
import {Talent} from "./Talent";
import {CharacterModifier, OnlyWarCharacterModifierTypes} from "./CharacterModifier";
import {Trait} from "./Trait";
import {Item} from "./items/Item";
import {CharacterAdvancement} from "./advancements/CharacterAdvancement";
import {PsychicPower} from "./PsychicPower";
import {PsychicPowerAdvancement} from "./advancements/PsychicPowerAdvancement";
import {CharacteristicAdvancement} from "./advancements/CharacteristicAdvancement";
import {SkillAdvancement} from "./advancements/SkillAdvancement";
import {TalentAdvancement} from "./advancements/TalentAdvancement";

export class OnlyWarCharacter {
    private _name:String = "";
    private _player:String = "";
    private _description:String = "";
    private _regiment:Regiment;
    private _specialty:Specialty;
    private _characteristics:Map<Characteristic, CharacteristicValue>;
    private _skills:Array<Skill> = new Array<Skill>();
    private _talents:Array<Talent> = [];
    private _traits:Array<Trait> = [];
    private _kit:Array<Item> = [];
    private _wounds:WoundsContainer = new WoundsContainer();
    private _criticalDamage:Array<String> = [];
    private _insanity:InsanityContainer = new InsanityContainer();
    private _corruption:CorruptionContainer = new CorruptionContainer();
    private _speeds:SpeedContainer = new SpeedContainer(this);
    private _fatePoints:Number = 0;
    private _experience:ExperienceContainer;
    private _aptitudes:Array<string> = [];
    private _powers:PsychicPowersContainer = new PsychicPowersContainer();
    private _fatigue:Number;

    get fatigue():Number {
        return this._fatigue;
    }

    set fatigue(value:Number) {
        this._fatigue = value;
    }

    get name():String {
        return this._name;
    }

    get player():String {
        return this._player;
    }

    get description():String {
        return this._description;
    }

    get regiment():Regiment {
        return this._regiment;
    }

    get specialty():Specialty {
        return this._specialty;
    }

    get characteristics():Map<Characteristic, CharacteristicValue> {
        return this._characteristics;
    }

    get skills():Array<Skill> {
        return this._skills;
    }

    get talents():Array<Talent> {
        return this._talents;
    }

    get traits():Array<Trait> {
        return this._traits;
    }

    get kit():Array<Item> {
        return this._kit;
    }

    get wounds():WoundsContainer {
        return this._wounds;
    }

    get criticalDamage():Array<String> {
        return this._criticalDamage;
    }

    get insanity():InsanityContainer {
        return this._insanity;
    }

    get corruption():CorruptionContainer {
        return this._corruption;
    }

    get speeds():SpeedContainer {
        return this._speeds;
    }

    get fatePoints():Number {
        return this._fatePoints;
    }

    get experience():ExperienceContainer {
        return this._experience;
    }

    get aptitudes():Array<string> {
        return this._aptitudes;
    }

    get powers():PsychicPowersContainer {
        return this._powers;
    }

    set name(value:String) {
        this._name = value;
    }

    set player(value:String) {
        this._player = value;
    }

    set regiment(value:Regiment) {
        this._regiment = value;
        this.addModifier(value);
    }

    set description(value:String) {
        this._description = value;
    }

    set specialty(value:Specialty) {
        this._specialty = value;
        this.addModifier(value);
    }

    set fatePoints(value:Number) {
        this._fatePoints = value;
    }

    constructor() {
        this._characteristics = new Map<Characteristic, CharacteristicValue>();
        for (var c of Characteristic.characteristics.values()) {
            this._characteristics.set(c, new CharacteristicValue(c));
        }
        this._experience = new ExperienceContainer(this);
    }

    private addModifier = function (modifier:CharacterModifier) {
        modifier.apply(this);
    }
}

class WoundsContainer {
    /**
     * The base number of wounds from rolling.
     */
    public rolled:number = 0;
    /**
     * The modifier from the character specialty.
     */
    public specialtyModifier:number = 0;
    /**
     * The modifier from the character regiment.
     */
    public regimentModifier:number = 0;

    /**
     * Return the modified wounds total, including all modifiers.
     * @returns {number}
     */
    public get total() {
        return this.rolled + this.specialtyModifier + this.regimentModifier;
    }
}

class InsanityContainer {
    /**
     * The number of insanity points.
     */
    public points:Number = 0;
    /**
     * The disorders the character has.
     */
    public disorders:Array<String> = [];
}

class CorruptionContainer {
    /**
     * The number of corruption points the character has.
     */
    public points:Number = 0;

    /**
     * The malignancies the character has.
     */
    public malignancies:Array<String> = [];
    /**
     * The mutations the character has.
     */
    public mutations:Array<String> = [];
}

class SpeedContainer {
    private character:OnlyWarCharacter;

    constructor(character:OnlyWarCharacter) {
        this.character = character;
    }

    private _half:Number;
    private _full:Number;
    private _charge:Number;
    private _run:Number;

    get half() {
        let agilityBonus = this.character.characteristics.get(Characteristic.characteristics.get("Agility")).bonus;
        if (agilityBonus === 0) {
            return .5;
        } else {
            return agilityBonus;
        }
    }

    get full() {
        let agilityBonus = this.character.characteristics.get(Characteristic.characteristics.get("Agility")).bonus;
        if (agilityBonus === 0) {
            return 1;
        } else {
            return agilityBonus * 2;
        }
    }

    get charge() {
        let agilityBonus = this.character.characteristics.get(Characteristic.characteristics.get("Agility")).bonus;
        if (agilityBonus === 0) {
            return 2;
        } else {
            return agilityBonus * 3;
        }
    }

    get run() {
        let agilityBonus = this.character.characteristics.get(Characteristic.characteristics.get("Agility")).bonus;
        if (agilityBonus === 0) {
            return 3;
        } else {
            return agilityBonus * 6;
        }
    }
}

class ExperienceContainer {
    private _character:OnlyWarCharacter;
    /**
     * The total amount of experience the character has, including both available and spent.
     * @type {number}
     * @private
     */
    private _total:number = 0;
    /**
     * The amount of available experience the character has to spend on advancements.
     * @type {number}
     * @private
     */
    private _available:number = 0;
    /**
     * The advances for the character that have already been purchased.
     * @type {Array}
     * @private
     */
    private _advances:Array<CharacterAdvancement> = [];

    constructor(character:OnlyWarCharacter) {
        this._character = character;
    }

    /**
     * Get the total amount of experience, including both available and spent.
     * @returns {number}
     */
    public get total() {
        return this._total;
    }

    public get available() {
        return this._available;
    }

    /**
     * Set the amount of available experience. If the amount is less than or equal to the current amount, the total experience
     * amount is also recalculated.
     * @param value
     */
    public set available(value:number) {
        this._total += value - this._available;
        this._available = value;
    }

    public get advancements() {
        return this._advances;
    }

    /**
     * Attempt to add the given advancement to the character. The character will determine if
     * it can add the advancement. If it can, it will add the advancement and this method will return
     * true. Else, this will return false.
     * @param advancement
     * @returns return if the advancement was added
     */
    public addAdvancement(advancement:CharacterAdvancement):boolean {
        switch (advancement.property) {
            case AdvanceableProperty.CHARACTERISTIC:
                //If the characteristic already has 4 advancements, can't add another.
                if (this._character.characteristics.get((<CharacteristicAdvancement>advancement).value).advancements.length >= 4) {
                    return false;
                }
                break;
            case AdvanceableProperty.SKILL:
                //If the skill already has a rating of 4, can't improve any further.
                var existingSkill = this._character.skills.find((skill)=> {
                    return (<SkillAdvancement>advancement).value.name === skill.name &&
                        (<SkillAdvancement>advancement).value.specialization === skill.specialization
                })
                if (existingSkill && existingSkill.rank >= 4) {
                    return false;
                }
                break;
            case AdvanceableProperty.TALENT:
                let incomingTalent = (<TalentAdvancement>advancement).value;
                //Don't add if the character has a talent with the same name and specialization.
                if (this._character.talents.find(function (talent) {
                        return talent.name === incomingTalent.name && talent.specialization === incomingTalent.specialization;
                    })) {
                    return false;
                }
                break;
        }
        this._advances.push(advancement);
        advancement.apply(this._character);
        return true;
    }

    public removeAdvancement(advancement:CharacterAdvancement) {
        let index = this.advancements.indexOf(advancement);
        if (index) {
            this.advancements.splice(index);
        }
    }
}

class PsychicPowersContainer {
    /**
     * The psy rating of the character.
     * @type {number}
     */
    private _psyRating:number = 0;
    /**
     * The psychic powers the character has.
     * @type {Array}
     */
    private _powers:Array<PsychicPowerWrapper> = [];
    /**
     * The bonus xp that the character has for purchasing psychic powers.
     * @type {number}
     */
    private _bonusXp:number = 0;

    /**
     * Add a psychic power to the character.
     * @param power
     * @param asBonus   if the power is purchased with the psychic power bonus xp
     */
    public addPower(power:PsychicPower, asBonus:boolean) {
        if (this.powers.indexOf(power) !== -1) {
            console.log("Tried to add power " + power.name + " but ")
        } else {
            if (asBonus) {
                if (this.bonusXp < power.xpCost) {
                    throw "Tried to purchase a bonus psychic power but didn't have enough bonus xp."
                }
                power.isBonus = true;
                this._bonusXp -= power.xpCost;
            }
            this.powers.push(power);
        }
    }

    public removePower(power:PsychicPower) {
        this._powers = this._powers.filter(function (wrapper:PsychicPowerWrapper) {
            return !angular.equals(wrapper.power, power);
        });
        if (power.isBonus) {
            this._bonusXp += power.xpCost;
        }
    }

    public get powers() {
        return this.powers.map((wrapper)=> {
            return wrapper.power;
        });
    }

    public get bonusXp() {
        return this.bonusXp;
    }

    public set bonusXp(value:Number) {
        this.bonusXp = value;
    }

    get psyRating():number {
        return this._psyRating;
    }

    set psyRating(value:number) {
        this._psyRating = value;
    }
}

class EquipmentContainer {
    private items:Array<Item> = [];

    /**
     * Add all of the items in the given array to the character kit.
     *
     * Some of these items may replace existing items
     * @param items
     */
    public addItems(items:Array<Item>) {

    }
}
/**
 * Wraps individual psychic powers and the sources that add them to the character.
 */
class PsychicPowerWrapper {
    private _power:PsychicPower;
    private _source:PsychicPowerAdvancement|CharacterModifier;

    get power():PsychicPower {
        return this._power;
    }

    get source():PsychicPowerAdvancement|CharacterModifier {
        return this._source;
    }
}

/**
 *  Enumeration of the properties that advancements can improve.
 */
export enum AdvanceableProperty{
    CHARACTERISTIC,
    SKILL,
    TALENT,
    PSY_RATING,
    PSYCHIC_POWER
}