import {OnlyWarCharacter} from "./Character"
import {Talent} from "./Talent";
import {CharacteristicValue, Characteristic} from "./Characteristic";
import {Trait} from "./Trait";
import {Item} from "./items/Item";
import {Skill} from "./Skill";
/**
 * A grouping of values that can be added to a Character, modifying its statistics.
 *
 * A modified can be the character's Regiment, their Specialty or an advancement bought with xp.
 * Created by Damien on 6/29/2016.
 */
export abstract class CharacterModifier {
    /**
     * Characteristic modifiers.
     *
     * Maps the characteristic name to a number modifier.
     */
    private _characteristics:Map<Characteristic, number>;
    /**
     * Skill modifiers.
     *
     * Maps a tuple containing a skill name and optional specialization to a skill rating.
     */
    private _skills:Array<Skill>;
    /**
     * Talent modifiers.
     *
     * An array of talents.
     */
    private _talents:Array<Talent>;
    /**
     * Aptitude modifiers.
     *
     * Array of aptitude names;
     */
    private _aptitudes:Array<string>;
    /**
     * Modifier traits.
     *
     * Array of traits.
     */
    private _traits:Array<Trait>;
    /**
     * Equipment modifiers.
     *
     * Array of items that the character will gain.
     */
    private _kit:Map<Item, number>;
    /**
     *  Wound modifier.
     *
     *  Positive or negative modifier to character wounds.
     */
    private _wounds:number;
    private _psyRating:number;
    private _type:OnlyWarCharacterModifierTypes;

    constructor(characteristics:Map<Characteristic, number>, skills:Array<Skill>, talents:Array<Talent>, aptitudes:Array<string>, traits:Array<Trait>, kit:Map<Item, number>, wounds:number, psyRating:number, type:OnlyWarCharacterModifierTypes) {
        this._characteristics = characteristics;
        this._skills = skills;
        this._talents = talents;
        this._aptitudes = aptitudes;
        this._traits = traits;
        this._kit = kit;
        this._wounds = wounds;
        this._psyRating = psyRating;
        this._type = type;
    }

    public apply(character:OnlyWarCharacter) {
        this.applyCharacteristicModifiers(character);
        this.applySkillModifiers(character);
        this.applyAptitudesModifiers(character);
        this.applyKitModifiers(character);
        this.applyTalentModifiers(character);
        this.applyTraitsModifiers(character);
        this.applyWoundsModifier(character);
    }

    protected applyCharacteristicModifiers(character:OnlyWarCharacter) {
        for (var characteristic of this._characteristics) {
            switch (this._type) {
                case OnlyWarCharacterModifierTypes.REGIMENT:
                    character.characteristics.get(characteristic[0]).regimentModifier = characteristic[1];
                    break;
                case OnlyWarCharacterModifierTypes.SPECIALTY:
                    character.characteristics.get(characteristic[0]).specialtyModifier = characteristic[1];
                    break;
            }
        }
    };

    protected applySkillModifiers(character:OnlyWarCharacter) {
        for (var skill of this._skills) {
            var index = character.skills.indexOf(skill);
            if (index !== -1) {
                character.skills[index].rank += skill.rank;
            } else {
                character.skills.push(skill);
            }
        }
    };

    protected applyTalentModifiers(character:OnlyWarCharacter) {
        for (var talent of this._talents) {
            character.talents.push(talent);
        }
    }

    protected applyAptitudesModifiers(character:OnlyWarCharacter) {
        for (var aptitude of this._aptitudes) {
            character.aptitudes.push(aptitude);
        }
    }

    protected applyTraitsModifiers(character:OnlyWarCharacter) {
        for (var trait of this._traits) {
            character.traits.push(trait);
        }
    }

    protected applyKitModifiers(character:OnlyWarCharacter) {
        for (var item of this._kit.entries()) {
            if (character.kit.get(item[0])) {
                character.kit.set(item[0], character.kit.get(item[0]) + item[1]);
            } else {
                character.kit.set(item[0], item[1]);
            }
        }
    }

    protected applyWoundsModifier(character:OnlyWarCharacter) {
    };


    get characteristics():Map<Characteristic, number> {
        return this._characteristics;
    }

    get skills():Array<Skill> {
        return this._skills;
    }

    get talents():Array<Talent> {
        return this._talents;
    }

    get aptitudes():Array<string> {
        return this._aptitudes;
    }

    get traits():Array<Trait> {
        return this._traits;
    }

    get kit():Map<Item, number> {
        return this._kit;
    }

    get wounds():number {
        return this._wounds;
    }

    get psyRating():number {
        return this._psyRating;
    }

    get type():OnlyWarCharacterModifierTypes {
        return this._type;
    }
}

export enum OnlyWarCharacterModifierTypes{
    REGIMENT,
    SPECIALTY,
    ADVANCEMENT
}
/**
 *  A portion of a modifier that consists of a set of possible values and a number of them
 *  that will be selected. After selection, the selected values will be added to the set values
 *  of the modifier.
 */
export class SelectableModifier {
    /**
     * The number of options that need to be selected.
     */
    private numSelectionsNeeded:number;
    /**
     * The available options
     */
    private options:Array<any>;

    /**
     * Choose from this selection, decomposing it into the selected options.
     *
     * @param chosenIndices
     */
    public makeSelection(chosenIndices:Array<Number>):Array<any> {
        if (chosenIndices.length != this.numSelectionsNeeded) {
            throw "The selection requires that " + this.numSelectionsNeeded + " selections be made but " + chosenIndices.length + " were instead."
        }
        return this.options.filter((element, index)=> {
            return chosenIndices.indexOf(index) !== -1;
        });
    }
}