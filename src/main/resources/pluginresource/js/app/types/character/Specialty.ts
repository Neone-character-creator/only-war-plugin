import {CharacterModifier, OnlyWarCharacterModifierTypes, SelectableModifier} from "./CharacterModifier";
import {Talent} from "./Talent";
import {Trait} from "./Trait";
import {Item} from "./items/Item";
import {Characteristic} from "./Characteristic";
import {OnlyWarCharacter} from "./Character";
import {Skill, SkillDescription} from "./Skill";
/**
 * Created by Damien on 6/29/2016.
 */
export class Specialty extends CharacterModifier {
    private _name:string;
    private _optionalModifiers:Array<SelectableModifier>;
    private _specialtyType:SpecialtyType;

    constructor(name:string, characteristics:Map<Characteristic, number>,
                specialtyType:SpecialtyType,
                skills:Map<SkillDescription, number>,
                talents:Array<Talent>,
                aptitudes:Array<string>,
                traits:Array<Trait>,
                kit:Map<Item, number>,
                wounds:number,
                optionalModifiers:Array<SelectableModifier>) {
        super(characteristics, skills, talents, aptitudes, traits, kit, wounds, 0, OnlyWarCharacterModifierTypes.SPECIALTY)
        this._specialtyType = specialtyType;
        this._name = name;
        this._optionalModifiers = optionalModifiers;
    }

    public apply(character:OnlyWarCharacter) {
        super.apply(character);
        character.wounds.specialtyModifier = this.wounds;
        for (var entry of this.characteristics.entries()) {
            character.characteristics.get(entry[0]).specialtyModifier = entry[1];
        }
        switch (this._specialtyType) {
            case SpecialtyType.Guardsman:
                character.experience.available += 600;
                break;
            case SpecialtyType.Specialist:
                character.experience.available += 300;
                break;
        }
    }

    public unapply() {
        this._appliedTo.wounds.specialtyModifier = 0;
        switch (this._specialtyType) {
            case SpecialtyType.Guardsman:
                this._appliedTo.experience.available -= 600;
                this._appliedTo.experience.total -= 600;
                break;
            case SpecialtyType.Specialist:
                this._appliedTo.experience.available -= 300;
                this._appliedTo.experience.total -= 300;
                break;
        }
        super.unapply();
    };

    get name():string {
        return this._name;
    }

    get optionalModifiers():Array<SelectableModifier> {
        return this._optionalModifiers;
    }

    get specialtyType():SpecialtyType {
        return this._specialtyType;
    }
}

export enum SpecialtyType{
    Guardsman,
    Specialist
}

export class SpecialtyBuilder {
    private _name:string = "";
    private _characteristics:Map<Characteristic, number> = new Map();
    private _talents:Array<Talent> = [];
    private _skills:Map<SkillDescription, number> = new Map();
    private _traits:Array<Trait> = [];
    private _aptitudes:Array<string> = [];
    private _kit:Map<Item,number> = new Map();
    private _wounds:number = 0;
    private _optionalModifiers:Array<SelectableModifier> = [];
    private _specialtyType:SpecialtyType;

    build():Specialty {
        if (this._specialtyType === undefined) {
            throw "Need to set the specialty type.";
        }
        return new Specialty(this._name, this._characteristics, this._specialtyType, this._skills, this._talents, this._aptitudes,
            this._traits, this._kit, this._wounds, this._optionalModifiers);
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

    setSpecialtyType(value:SpecialtyType) {
        this._specialtyType = value;
        return this;
    }
}