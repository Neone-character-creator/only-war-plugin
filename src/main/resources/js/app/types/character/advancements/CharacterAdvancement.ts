import {AdvanceableProperty, OnlyWarCharacter} from "../Character";
import {CharacterModifier, OnlyWarCharacterModifierTypes} from "../CharacterModifier";
//import {Characteristic} from "../Characteristic";
import {Talent} from "../Talent";
import {Trait} from "../Trait";
import {Item} from "../items/Item";
import {Skill, SkillDescription} from "../Skill";
import {PsychicPower} from "../PsychicPower";
import {Characteristic} from "../Characteristic";
import enumerate = Reflect.enumerate;
import * as angular from "angular";
/**
 * An advancement to a character, purchased with xp.
 *
 * Created by Damien on 6/29/2016.
 */
export abstract class CharacterAdvancement extends CharacterModifier {
    /**
     * Other advancements that add values that
     * @type {Array}
     */
    private prerequisiteAdvances:Array<CharacterAdvancement> = [];
    /**
     * The property that the advancement modifies.
     */
    private _property:AdvanceableProperty;
    /**
     * The amount of xp this cost when applied to the character.
     */
    private _actualXpSpent:number;

    constructor(property:AdvanceableProperty,
                characteristics:Map<Characteristic, number>,
                skills:Map<SkillDescription, number>,
                talents:Array<Talent>,
                aptitudes:Array<string>,
                traits:Array<Trait>,
                kit:Map<Item, number>,
                wounds:number,
                psyRating:number) {
        super(characteristics, skills, talents, aptitudes, traits, kit, wounds, psyRating, OnlyWarCharacterModifierTypes.ADVANCEMENT);
        this._property = property;
    }

    get property():AdvanceableProperty {
        return this._property;
    }

    /**
     * Calculate the amount of experience it would cost to add this advancement to the given character.
     *
     * @param character
     * @returns {number}
     */
    public abstract calculateExperienceCost(character:OnlyWarCharacter):number;

    public apply(character:OnlyWarCharacter) {
        super.apply(character);
        this._actualXpSpent = this.calculateExperienceCost(character);
        character.experience.available -= this._actualXpSpent;
    }

    public unapply() {
        this._appliedTo.experience.available += this._actualXpSpent;
        this._actualXpSpent = 0;
        super.unapply();
    }
}

export class CharacteristicAdvancement extends CharacterAdvancement {
    private characteristic:Characteristic;

    /**
     * The name of the characteristic that the advancement improves.
     * @param characteristic
     */
    constructor(value:Characteristic) {
        var characteristics = new Map<Characteristic, number>();
        characteristics.set(value, 5);
        super(AdvanceableProperty.CHARACTERISTIC,
            characteristics,
            new Map(),
            [],
            [],
            [],
            new Map<Item, number>(),
            0,
            0);
        this.characteristic = value;
    }

    /**
     * Returns the characteristic this advancement improves.
     * @returns {string}
     */
    get value():Characteristic {
        return this.characteristic;
    }

    public apply(character:OnlyWarCharacter):any {
        super.apply(character);
        character.characteristics.get(this.value).advancements.push(this);
    }

    public unapply() {
        this._appliedTo.characteristics.get(this.value).advancements.splice(
            this._appliedTo.characteristics.get(this.value).advancements.indexOf(this)
        );
        super.unapply();
    }

    public calculateExperienceCost(character:OnlyWarCharacter):number {
        var existingAdvancements:number = character.characteristics.get(this.value).advancements.length;
        var matchingAptitudes:number = 0;
        this.characteristic.aptitudes.forEach((aptitude)=> {
            if (character.aptitudes.indexOf(aptitude) !== -1) {
                matchingAptitudes++;
            }
        });
        switch (matchingAptitudes) {
            case 0:
                switch (existingAdvancements) {
                    case 0:
                        return 500;
                    case 1:
                        return 750;
                    case 2:
                        return 1000;
                    case 3:
                        return 2500;
                }
            case 1:
                switch (existingAdvancements) {
                    case 0:
                        return 250;
                    case 1:
                        return 500;
                    case 2:
                        return 750;
                    case 3:
                        return 1000;
                }
            case 2:
                switch (existingAdvancements) {
                    case 0:
                        return 100;
                    case 1:
                        return 250;
                    case 2:
                        return 500;
                    case 3:
                        return 750;
                }
        }
    }
}

export class PsychicPowerAdvancement extends CharacterAdvancement {
    calculateExperienceCost(character:OnlyWarCharacter):number {
        if (character.powers.bonusXp >= this.power.xpCost) {
            return 0;
        } else {
            return this.power.xpCost;
        }
    }

    apply(character:OnlyWarCharacter) {
        super.apply(character);
        if (character.powers.bonusXp >= this.value.xpCost) {
            character.powers.addPower(this.value, true, this);
        } else {
            character.powers.addPower(this.value, false, this);
        }
    }

    unapply() {
        this._appliedTo.powers.removePower(this.value);
        super.unapply();
    }

    private power:PsychicPower;

    constructor(value:PsychicPower) {
        super(AdvanceableProperty.PSYCHIC_POWER,
            new Map(),
            new Map(),
            [],
            [],
            [],
            new Map<Item, number>(),
            0,
            0);
        this.power = value;
    }

    get value():PsychicPower {
        return this.power;
    }
}

export class PsyRatingAdvancement extends CharacterAdvancement {
    calculateExperienceCost(character:OnlyWarCharacter):number {
        return (character.powers.psyRating + 1) * 200;
    }

    apply(character:OnlyWarCharacter) {
        super.apply(character);
        character.powers.psyRating += 1;
    }

    unapply() {
        this._appliedTo.powers.psyRating -= 1;
        super.unapply();
    }

    constructor() {
        super(AdvanceableProperty.PSY_RATING, new Map(), new Map(), [], [], [], new Map<Item, number>(), 0, 0);
    }

    /**
     * Returns the amount this advancement increased the character's psy rating.
     *
     * Should only ever be 1.
     * @returns {number}
     */
    get value():number {
        return 1;
    }
}

export class SkillAdvancement extends CharacterAdvancement {
    private skill:SkillDescription;

    constructor(skill:SkillDescription) {
        var skills:Map<SkillDescription, number> = new Map<SkillDescription, number>();
        skills.set(skill, 1);
        super(AdvanceableProperty.SKILL, new Map(), skills, [], [], [], new Map<Item, number>(), 0, 0);
        this.skill = skill;
    }

    get value():SkillDescription {
        return this.skill;
    }

    public calculateExperienceCost(character:OnlyWarCharacter):number {
        var matchingAptitudes:number = 0;
        var existingSkill = character.skills.find((skill)=> {
            return angular.equals(this.skill, skill);
        });
        var existingSkillRating = existingSkill ? existingSkill.rank : 0;
        character.aptitudes.forEach((aptitude)=> {
            if (this.skill.aptitudes.indexOf(aptitude) !== -1) {
                matchingAptitudes++;
            }
        });
        return (existingSkillRating + 1) * (3 - matchingAptitudes) * 100;
    }
}

export class TalentAdvancement extends CharacterAdvancement {
    private talent:Talent;

    constructor(talent:Talent) {
        super(AdvanceableProperty.TALENT, new Map(), new Map(), [talent],[],[],new Map(),0, 0);
        this.talent = talent;
    }

    /**
     * Return the talent this advancement gave the character.
     * @returns {Talent}
     */
    get value():Talent {
        return this.talent;
    }

    public calculateExperienceCost(character:OnlyWarCharacter):number {
        var aptitudeMatch:number = 0;
        this.talent.aptitudes.forEach((aptitude) => {
            if (character.aptitudes.indexOf(aptitude) !== -1) {
                aptitudeMatch++;
            }
        });
        switch (aptitudeMatch) {
            case 0:
                return (this.talent.tier + 1) * 300;
            case 1:
                return (this.talent.tier + 1) * 150;
            case 2:
                return (this.talent.tier + 1) * 100;
        }
    }
}

export class ComradeAdvancement extends CharacterAdvancement{
    private _experienceCost:number;
    private _specialAbility:String;

    constructor(experienceCost:number, specialAbility:String) {
        super(AdvanceableProperty.COMRADE, new Map(), new Map(), [], [], [], new Map(), 0, 0);
        this._experienceCost = experienceCost;
        this._specialAbility = specialAbility;
    }

    calculateExperienceCost(character:OnlyWarCharacter):number {
        return this._experienceCost;
    }


    public apply(character:OnlyWarCharacter):any {
        super.apply(character);
        character.comrade.specialAbilties
    }

    public unapply():any {
        this._appliedTo.comrade.specialAbilties = this._appliedTo.comrade.specialAbilties.splice(
            this._appliedTo.comrade.specialAbilties.indexOf(this._specialAbility)
        )
        return super.unapply();
    }
}