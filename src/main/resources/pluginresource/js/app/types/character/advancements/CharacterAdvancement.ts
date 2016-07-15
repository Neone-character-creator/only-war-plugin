import {AdvanceableProperty, OnlyWarCharacter} from "../Character";
import {CharacterModifier, OnlyWarCharacterModifierTypes} from "../CharacterModifier";
//import {Characteristic} from "../Characteristic";
import {Talent} from "../Talent";
import {Trait} from "../Trait";
import {Item} from "../items/Item";
import {Skill} from "../Skill";
import {PsychicPower} from "../PsychicPower";
import {Characteristic} from "../Characteristic";
import enumerate = Reflect.enumerate;
/**
 * An advancement to a character, purchased with xp.
 *
 * Created by Damien on 6/29/2016.
 */
export abstract class CharacterAdvancement extends CharacterModifier {
    /**
     * Other advancements that add values that  fasdfasdfasdfasdfasdf
     * @type {Array}
     */
    private prerequisiteAdvances:Array<CharacterAdvancement> = [];
    /**
     * The property that the advancement modifies.
     */
    private _property:AdvanceableProperty;

    constructor(property:AdvanceableProperty,
                characteristics:Map<Characteristic, number>,
                skills:Array<Skill>,
                talents:Array<Talent>,
                aptitudes:Array<string>,
                traits:Array<Trait>,
                kit:Map<Item, number>,
                wounds:number,
                psyRating:number,
                type:OnlyWarCharacterModifierTypes) {
        super(characteristics, skills, talents, aptitudes, traits, kit, wounds, psyRating, type);
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
}

export class CharacteristicAdvancement extends CharacterAdvancement {
    private characteristic:Characteristic;

    apply(character:OnlyWarCharacter):void {
        character.characteristics.get(this.value).advancements.push(this);
    }

    /**
     * The name of the characteristic that the advancement improves.
     * @param characteristic
     */
    constructor(value:Characteristic) {
        var characteristics = new Map<Characteristic, number>();
        characteristics.set(value, 5);
        super(AdvanceableProperty.CHARACTERISTIC,
            characteristics,
            [],
            [],
            [],
            [],
            new Map<Item, number>(),
            0,
            0,
            OnlyWarCharacterModifierTypes.ADVANCEMENT);
        this.characteristic = value;
    }

    /**
     * Returns the name of the characteristic this advancement improves.
     * @returns {string}
     */
    get value():Characteristic {
        return this.characteristic;
    }

    protected applyCharacteristicModifiers(character:OnlyWarCharacter):any {
        character.characteristics.get(this.value).advancements.push(this);
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
        return this.power.xpCost;
    }

    apply(character:OnlyWarCharacter) {
        character.powers.addPower(this.value, this.isBonus, this);
    }

    private isBonus:boolean;
    private power:PsychicPower;

    constructor(value:PsychicPower, isBonus:boolean) {
        super(AdvanceableProperty.PSYCHIC_POWER,
            new Map(),
            [],
            [],
            [],
            [],
            new Map<Item, number>(),
            0,
            0,
            OnlyWarCharacterModifierTypes.ADVANCEMENT);
        this.power = value;
        this.isBonus = isBonus;
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
        character.powers.psyRating += 1;
    }

    constructor() {
        super(AdvanceableProperty.PSY_RATING, new Map(), [], [], [], [], new Map<Item, number>(), 0, 0, OnlyWarCharacterModifierTypes.ADVANCEMENT);
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
    private skill:Skill;

    apply(character:OnlyWarCharacter) {
        var existingSkill = character.skills.find((skill)=> {
            return skill.name === this.skill.name && skill.specialization === this.skill.specialization;
        });
        if (existingSkill) {
            return existingSkill.rank++;
        } else {
            character.skills.push(this.skill);
        }
    }

    constructor(skill:Skill) {
        var skills:Array<Skill> = [skill];
        super(AdvanceableProperty.SKILL, new Map(), skills, [], [], [], new Map<Item, number>(), 0, 0, OnlyWarCharacterModifierTypes.ADVANCEMENT);
        this.skill = skill;
    }

    get value():Skill {
        return this.skill;
    }

    public calculateExperienceCost(character:OnlyWarCharacter):number {
        var matchingAptitudes:number = 0;
        var existingSkill = character.skills.find((skill)=> {
            return this.skill.name === skill.name && this.skill.specialization === skill.specialization;
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

    apply(character:OnlyWarCharacter) {
        character.talents.push(this.value);
    }

    constructor(talent:Talent) {
        super(AdvanceableProperty.TALENT, new Map(), [], [talent], [], [], new Map<Item, number>(), 0, 0, OnlyWarCharacterModifierTypes.ADVANCEMENT);
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
                return (this.talent.tier) * 300;
            case 1:
                return (this.talent.tier) * 150;
            case 2:
                return (this.talent.tier) * 100;
        }
    }
}