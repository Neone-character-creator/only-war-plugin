import {OnlyWarCharacter} from "./Character"
import {Talent} from "./Talent";
import {CharacteristicValue, Characteristic} from "./Characteristic";
import {Trait} from "./Trait";
import {Item} from "./items/Item";
import {Skill, SkillDescription} from "./Skill";
import {CharacterOptionsService} from "../../services/CharacterOptionsService";
import * as angular from "angular";
/**
 * A grouping of values that can be added to a Character, modifying its statistics.
 *
 * A modified can be the character's Regiment, their Specialty or an advancement bought with xp.
 * Created by Damien on 6/29/2016.
 *
 * TODO: Do something about this class being mutable! I can imagine a lot of things that might go wrong because of it.
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
    private _skills:Map<SkillDescription, number>;
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
    protected _appliedTo:OnlyWarCharacter;
    protected _characterOptions:CharacterOptionsService;

    constructor(characteristics:Map<Characteristic, number>, skills:Map<SkillDescription, number>, talents:Array<Talent>, aptitudes:Array<string>, traits:Array<Trait>, kit:Map<Item, number>, wounds:number, psyRating:number, type:OnlyWarCharacterModifierTypes) {
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

    get characteristics():Map < Characteristic, number > {
        return this._characteristics;
    }

    get skills():Map<SkillDescription, number> {
        return this._skills;
    }

    get talents():Array < Talent > {
        return this._talents;
    }

    get aptitudes():Array < string > {
        return this._aptitudes;
    }

    get traits():Array < Trait > {
        return this._traits;
    }

    get kit():Map < Item, number > {
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

    public apply(character:OnlyWarCharacter) {
        this._appliedTo = character;
        this.applyKitModifiers(character);
        this.applySkillModifiers(character);
        this.applyTalentModifiers(character);
        this.applyTraitModifiers(character);
        this.applyAptitudeModifiers(character);
        this.applyWoundsModifier(character);
        this.applyCharacteristicsModifiers(character);
        this.applyPsyRatingModifier(character);
    }

    public unapply() {
        this.unapplyTalentModifiers();
        this.unapplyTraitModifiers();
        this.unapplyAptitudeModifiers();
        this.unapplySkillModifiers();
        this.unapplyWoundsModifier();
        this.unapplyCharacteristicsModifiers();
        this.unapplyKitModifiers();
        this.unapplyPsyRatingModifier();
        this._appliedTo = null;
    }

    protected applyTalentModifiers(character:OnlyWarCharacter) {
        this.talents.forEach(talentToAdd=> {
            character.talents.push(talentToAdd);
        });
    }

    protected applyKitModifiers(character:OnlyWarCharacter) {
        this.kit.forEach((count, item)=> {
            var existingCount:number = character.kit.get(item);
            if (existingCount) {
                character.kit.set(item, existingCount + count);
            } else {
                character.kit.set(item, count);
            }
        });
    }

    protected applySkillModifiers(character:OnlyWarCharacter) {
        for (var entry of this.skills.entries()) {
            var existingSkill:Skill = character.skills.find(skill=> {
                return angular.equals(entry[0], skill.identifier);
            });
            if (!existingSkill) {
                existingSkill = new Skill(entry[0]);
                character.skills.push(existingSkill)
            }
            existingSkill.addRankModifier(this);
        }
    }

    protected applyTraitModifiers(character:OnlyWarCharacter) {
        this.traits.forEach(traitToAdd=> {
            character.traits.push(traitToAdd);
        });
    }

    protected applyAptitudeModifiers(character:OnlyWarCharacter) {
        this.aptitudes.forEach(aptitudeToAdd=> {
            character.aptitudes.push(aptitudeToAdd);
        });
    }

    protected applyWoundsModifier(character:OnlyWarCharacter) {

    }

    protected applyCharacteristicsModifiers(character:OnlyWarCharacter) {

    }

    protected unapplyTalentModifiers() {
        for (var talent of this._talents) {
            if (this._appliedTo.talents.indexOf(talent) !== -1) {
                this._appliedTo.talents.splice(this._appliedTo.talents.indexOf(talent), 1);
            }
        }
    }

    protected unapplyTraitModifiers() {
        for (var trait of this._traits) {
            this._appliedTo.traits.splice(this._appliedTo.traits.indexOf(trait), 1);
        }
    }

    protected unapplyAptitudeModifiers() {
        this.aptitudes.forEach(aptitude=> {
            this._appliedTo.aptitudes.splice(this._appliedTo.aptitudes.indexOf(aptitude), 1);
        });
    }

    protected unapplyKitModifiers() {
        for (let entry of this._kit.entries()) {
            if (this._appliedTo.kit.get(entry[0]) == entry[1]) {
                this._appliedTo.kit.delete(entry[0]);
            } else {
                this._appliedTo.kit.set(entry[0], this._appliedTo.kit.get(entry[0]) - entry[1]);
            }
        }
    }

    protected unapplySkillModifiers() {
        for (var entry of this.skills.entries()) {
            var existingSkill:Skill = this._appliedTo.skills.find(skill=> {
                return angular.equals(entry[0], skill.identifier);
            });
            if (existingSkill) {
                existingSkill.removeRankModifier(this);
                if (existingSkill.rank == 0) {
                    this._appliedTo.skills.splice(this._appliedTo.skills.indexOf(existingSkill), 1);
                }
            }
        }
    }

    protected unapplyWoundsModifier() {

    }

    protected unapplyCharacteristicsModifiers() {

    }

    protected applyPsyRatingModifier(character:OnlyWarCharacter){
        character.powers.psyRating += this._psyRating;
    }

    protected unapplyPsyRatingModifier(){
        this._appliedTo.powers.psyRating -= this._psyRating;
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

    constructor(numSelectionsNeeded:number, options:Array<any>, selectionTime:string) {
        this._numSelectionsNeeded = numSelectionsNeeded;
        this._options = options;
        this._selectionTime = selectionTime;
    }

    /**
     * The number of options that need to be selected.
     */
    private _numSelectionsNeeded:number;
    /**
     * The available options
     */
    private _options:Array<any>;

    private _selectionTime:string;

    /**
     * Choose from this selection, decomposing it into the selected options.
     *
     * @param chosenIndices
     */
    public makeSelection(chosenIndices:Array<Number>):Array<any> {
        if (chosenIndices.length != this._numSelectionsNeeded) {
            throw "The selection requires that " + this._numSelectionsNeeded + " selections be made but " + chosenIndices.length + " were instead."
        }
        return this._options.filter((element, index)=> {
            return chosenIndices.indexOf(index) !== -1;
        });
    }

    get numSelectionsNeeded():number {
        return this._numSelectionsNeeded;
    }

    get options():Array<any> {
        return this._options;
    }

    get selectionTime():string {
        return this._selectionTime;
    }
}