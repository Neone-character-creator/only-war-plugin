import {Regiment} from "./Regiment";
import {Specialty} from "./Specialty";
import {CharacteristicValue, Characteristic} from "./Characteristic";
import {Skill} from "./Skill";
import {Talent} from "./Talent";
import {CharacterModifier, OnlyWarCharacterModifierTypes} from "./CharacterModifier";
import {Trait} from "./Trait";
import {Item} from "./items/Item";
import {PsychicPower} from "./PsychicPower";
import {
    CharacterAdvancement, CharacteristicAdvancement, SkillAdvancement,
    TalentAdvancement, PsychicPowerAdvancement
} from "./advancements/CharacterAdvancement";

import * as angular from "angular";

export class OnlyWarCharacter{
    private _name:String = "";
    private _player:String = "";
    private _description:String = "";
    private _demeanor:string = "";
    private _regiment:Regiment;
    private _specialty:Specialty;
    private _characteristics:Map<Characteristic, CharacteristicValue>;
    private _skills:Array<Skill> = new Array<Skill>();
    private _talents:Array<Talent> = [];
    private _traits:Array<Trait> = [];
    private _kit:Map<Item, number> = new Map<Item,number>();
    private _wounds:WoundsContainer = new WoundsContainer();
    private _insanity:InsanityContainer = new InsanityContainer();
    private _corruption:CorruptionContainer = new CorruptionContainer();
    private _speeds:SpeedContainer = new SpeedContainer(this);
    private _fatePoints:Number = 0;
    private _experience:ExperienceContainer;
    private _aptitudes:Array<string> = ["General"];
    private _powers:PsychicPowersContainer = new PsychicPowersContainer();
    private _fatigue:Number;

    get demeanor():string {
        return this._demeanor;
    }

    set demeanor(value:string) {
        this._demeanor = value;
    }

    get fatigue /* istanbul ignore next */
    ():Number {
        return this._fatigue;
    }

    set aptitudes(value:Array<string>) {
        this._aptitudes = value;
    }

    set fatigue(value:Number) {
        /* istanbul ignore next */
        this._fatigue = value;
    }

    get name():String {
        /* istanbul ignore next */
        return this._name;
    }

    get player():String {
        /* istanbul ignore next */
        return this._player;
    }

    get description():String {
        /* istanbul ignore next */
        return this._description;
    }

    get regiment():Regiment {
        /* istanbul ignore next */
        return this._regiment;
    }

    get specialty():Specialty {
        /* istanbul ignore next */
        return this._specialty;
    }

    get characteristics():Map<Characteristic, CharacteristicValue> {
        /* istanbul ignore next */
        return this._characteristics;
    }

    get skills():Array<Skill> {
        /* istanbul ignore next */
        return this._skills;
    }

    get talents():Array<Talent> {
        /* istanbul ignore next */
        return this._talents;
    }

    get traits():Array<Trait> {
        /* istanbul ignore next */
        return this._traits;
    }

    get kit():Map<Item, number> {
        /* istanbul ignore next */
        return this._kit;
    }

    get wounds():WoundsContainer {
        /* istanbul ignore next */
        return this._wounds;
    }

    get insanity():InsanityContainer {
        /* istanbul ignore next */
        return this._insanity;
    }

    get corruption():CorruptionContainer {
        /* istanbul ignore next */
        return this._corruption;
    }

    get speeds():SpeedContainer {
        /* istanbul ignore next */
        return this._speeds;
    }

    get fatePoints():Number {
        /* istanbul ignore next */
        return this._fatePoints;
    }

    get experience():ExperienceContainer {
        /* istanbul ignore next */
        return this._experience;
    }

    get aptitudes():Array<string> {
        /* istanbul ignore next */
        return this._aptitudes;
    }

    get powers():PsychicPowersContainer {
        /* istanbul ignore next */
        return this._powers;
    }

    set name(value:String) {
        /* istanbul ignore next */
        this._name = value;
    }

    set player(value:String) {
        /* istanbul ignore next */
        this._player = value;
    }

    set regiment(value:Regiment) {
        if (this._regiment) {
            this._regiment.unapply();
        }
        this._regiment = value;
        if (value) {
            this.addModifier(value);
        }
    }

    set description(value:String) {
        /* istanbul ignore next */
        this._description = value;
    }

    set specialty(value:Specialty) {
        if (this._specialty) {
            this._specialty.unapply();
        }
        this._specialty = value;
        if (value) {
            this.addModifier(value);
        }
    }
    
    set kit(value:Map<Item, number>) {
        this._kit = value;
    }

    set fatePoints(value:Number) {
        /* istanbul ignore next */
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

    public criticalDamage:Array<String> = [];

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
        /* istanbul ignore next */
        return this._total;
    }

    public set total(value:number) {
        this._total = value;
    }

    public get available() {
        /* istanbul ignore next */
        return this._available;
    }

    /**
     * Set the amount of available experience. If the amount is less than or equal to the current amount, the total experience
     * amount is also recalculated.
     * @param value
     */
    public set available(value:number) {
        this._available = value;
    }

    public get advancements() {
        /* istanbul ignore next */
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
                    return angular.equals((<SkillAdvancement>advancement).value, skill.identifier);
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
            case AdvanceableProperty.PSYCHIC_POWER:
                let incomingPower = (<PsychicPowerAdvancement>advancement).value;
                if (this._character.powers.powers.find(function (power) {
                        return power.name === incomingPower.name;
                    })) {
                    return false;
                }
        }
        this._advances.push(advancement);
        advancement.apply(this._character);
        return true;
    }

    public removeAdvancement(advancement:CharacterAdvancement) {
        advancement.unapply();
        this._advances.splice(this._advances.indexOf(advancement));
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
    public addPower(power:PsychicPower, asBonus:boolean, source:CharacterModifier) {
        /* istanbul ignore next */
        if (this.powers.indexOf(power) !== -1) {
            console.log("Tried to add power " + power.name + " but character already has it.");
        } else {
            if (asBonus) {
                /* istanbul ignore if */
                if (this.bonusXp < power.xpCost) {
                    throw "Tried to purchase a bonus psychic power but didn't have enough bonus xp, needed "
                    + power.xpCost + " but had " + this.bonusXp + ".";
                }
                this._bonusXp -= power.xpCost;
            }
            this._powers.push(new PsychicPowerWrapper(power, source, asBonus));
        }
    }

    public removePower(power:PsychicPower) {
        var removedWrapper = this._powers.splice(this._powers.findIndex(function (wrapper:PsychicPowerWrapper) {
            return angular.equals(wrapper.power, power);
        }), 1);
        if (removedWrapper[0].isBonus) {
            this._bonusXp += power.xpCost;
        }
    }

    public get powers() {
        /* istanbul ignore next */
        return this._powers.map((wrapper)=> {
            return wrapper.power;
        });
    }

    public get bonusXp() {
        /* istanbul ignore next */
        return this._bonusXp;
    }

    public set bonusXp(value:number) {
        /* istanbul ignore next */
        this._bonusXp = value;
    }

    get psyRating():number {
        /* istanbul ignore next */
        return this._psyRating;
    }

    set psyRating(value:number) {
        /* istanbul ignore next */
        this._psyRating = value;
    }
}
/**
 * Wraps individual psychic powers and the sources that add them to the character.
 */
class PsychicPowerWrapper {
    private _power:PsychicPower;
    private _source:CharacterModifier;
    private _isBonus:boolean;

    get power():PsychicPower {
        /* istanbul ignore next */
        return this._power;
    }

    get source():CharacterModifier {
        /* istanbul ignore next */
        return this._source;
    }


    get isBonus():boolean {
        return this._isBonus;
    }

    constructor(power:PsychicPower, source:CharacterModifier, isBonus:boolean) {
        this._power = power;
        this._source = source;
        this._isBonus = isBonus;
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