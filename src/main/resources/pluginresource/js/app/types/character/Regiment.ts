import {CharacterModifier, OnlyWarCharacterModifierTypes, SelectableModifier} from "./CharacterModifier";
import {Talent} from "./Talent";
import {Item} from "./items/Item";
import {Trait} from "./Trait";
import {Characteristic} from "./Characteristic";
import {OnlyWarCharacter} from "./Character";
import {Skill, SkillDescription} from "./Skill";
import {Weapon} from "./items/Weapon";
import {SpecialAbility} from "../regiment/SpecialAbility";
/**
 * A fully complete regiment modifier.
 *
 * Instances of this class are not meant to be created using the class constructor, use the Builder instead for
 * greater convenience.
 * Created by Damien on 6/27/2016.
 */
export class Regiment extends CharacterModifier {
    constructor(name:string,
                characteristics:Map<Characteristic, number>,
                skills:Map<SkillDescription, number>,
                talents:Array<Talent>,
                aptitudes:Array<string>,
                traits:Array<Trait>,
                kit:Map<Item, number>,
                wounds:number,
                optionalModifiers:Array<SelectableModifier>,
                favoredWeapons:Map<string, Array<Weapon>>,
                specialAbilities:Array<SpecialAbility>) {
        super(characteristics, skills, talents, aptitudes, traits, kit, wounds, 0, OnlyWarCharacterModifierTypes.REGIMENT);
        this._name = name;
        this._favoredWeapons = favoredWeapons;
        this._optionalModifiers = optionalModifiers;
        this._specialAbilities = specialAbilities;
    }

    private _optionalModifiers:Array<SelectableModifier>
    private _favoredWeapons:Map<string, Array<Weapon>>;
    private _specialAbilities:Array<SpecialAbility>;

    protected applyCharacteristicsModifiers(character:OnlyWarCharacter) {
        for (var entry of this.characteristics.entries()) {
            character.characteristics.get(entry[0]).regimentModifier = entry[1];
        }
    }

    protected applyWoundsModifier(character:OnlyWarCharacter) {
        character.wounds.regimentModifier = this.wounds;
    }

    protected applyTalentModifiers(character:OnlyWarCharacter) {
        if (character.specialty) {
            for (var talent of this.talents) {
                var specialtyProvidesTalent = character.specialty.talents.find(characterTalent=> {
                    return characterTalent.name === talent.name && characterTalent.specialization == talent.specialization;
                });
                if (specialtyProvidesTalent) {
                    character.experience.available += 100;
                    character.experience.total += 100;
                } else {
                    character.talents.push(talent);
                }
            }
        } else {
            for (var talent of this.talents) {
                character.talents.push(talent);
            }
        }
    }

    public unapplyCharacteristicsModifiers() {
        for (var entry of this.characteristics.entries()) {
            this._appliedTo.characteristics.get(entry[0]).regimentModifier = 0;
        }
    }

    protected unapplyTalentModifiers() {
        if (this._appliedTo.specialty) {
            for (var talent of this.talents) {
                var specialtyProvidesTalent = this._appliedTo.specialty.talents.find(characterTalent=> {
                    return characterTalent.name === talent.name && characterTalent.specialization == talent.specialization;
                });
                if (specialtyProvidesTalent) {
                    this._appliedTo.experience.available -= 100;
                    this._appliedTo.experience.total -= 100;
                } else {
                    this._appliedTo.talents.splice(this._appliedTo.talents.indexOf(talent), 1);
                }
            }
        } else {
            for (var talent of this.talents) {
                this._appliedTo.talents.splice(this._appliedTo.talents.indexOf(talent), 1);
            }
        }
    }

    protected unapplyWoundsModifier() {
        this._appliedTo.wounds.regimentModifier = 0;
    }

    private _name:string;

    get name():string {
        return this._name;
    }

    get favoredWeapons():Map<string, Array<Weapon>> {
        return this._favoredWeapons;
    }

    get optionalModifiers():Array<SelectableModifier> {
        return this._optionalModifiers;
    }

    get specialAbilities():Array<SpecialAbility> {
        return this._specialAbilities;
    }
}

/**
 * Builder for constructing Regiment instances.
 */
export class RegimentBuilder {
    private _name:string = "";
    private _characteristics:Map<Characteristic, number> = new Map();
    private _talents:Array<Talent> = [];
    private _skills:Map<SkillDescription, number> = new Map();
    private _traits:Array<Trait> = [];
    private _aptitudes:Array<string> = [];
    private _kit:Map<Item,number> = new Map();
    private _wounds:number = 0;
    private _favoredWeapons:Map<string,Array<Weapon>> = new Map();
    private _optionalModifiers:Array<SelectableModifier> = [];
    private _specialAbilities:Array<SpecialAbility> = [];


    constructor() {
    }

    build():Regiment {
        return new Regiment(this._name, this._characteristics, this._skills, this._talents, this._aptitudes,
            this._traits, this._kit, this._wounds, this._optionalModifiers, this._favoredWeapons, this._specialAbilities);
    }

    setFavoredWeapons(value:Map<string, Array<Weapon>>) {
        this._favoredWeapons = value;
        return this;
    }

    setName(value:string) {
        this._name = value;
        return this;
    }

    setCharacteristics(value:Map<Characteristic, number>) {
        this._characteristics = value;
        return this;
    }

    setTalents(value:Array<Talent>) {
        this._talents = value;
        return this;
    }

    setSkills(value:Map<SkillDescription, number>) {
        this._skills = value;
        return this;
    }

    setTraits(value:Array<Trait>) {
        this._traits = value;
        return this;
    }

    setAptitudes(value:Array<string>) {
        this._aptitudes = value;
        return this;
    }

    setKit(value:Map<Item, number>) {
        this._kit = value;
        return this;
    }

    setWounds(value:number) {
        this._wounds = value;
        return this;
    }

    setOptionalModifiers(value:Array<SelectableModifier>) {
        this._optionalModifiers = value;
        return this;
    }

    setSpecialAbilties(value:Array<SpecialAbility>) {
        this._specialAbilities = value;
        return this;
    }


    get name():string {
        return this._name;
    }

    get characteristics():Map<Characteristic, number> {
        return this._characteristics;
    }

    get talents():Array<Talent> {
        return this._talents;
    }

    get skills():Map<SkillDescription, number> {
        return this._skills;
    }

    get traits():Array<Trait> {
        return this._traits;
    }

    get aptitudes():Array<string> {
        return this._aptitudes;
    }

    get kit():Map<Item, number> {
        return this._kit;
    }

    get wounds():number {
        return this._wounds;
    }

    get favoredWeapons():Map<string, Array<Weapon>> {
        return this._favoredWeapons;
    }

    get optionalModifiers():Array<SelectableModifier> {
        return this._optionalModifiers;
    }

    get specialAbilities():Array<SpecialAbility> {
        return this._specialAbilities;
    }
}