import {CharacterModifier, OnlyWarCharacterModifierTypes, SelectableModifier} from "./CharacterModifier";
import {Talent} from "./Talent";
import {Item} from "./items/Item";
import {Trait} from "./Trait";
import {Characteristic} from "./Characteristic";
import {OnlyWarCharacter} from "./Character";
import {Skill, SkillDescription} from "./Skill";
import {Weapon} from "./items/Weapon";
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
                favoredWeapons:Array<Weapon>) {
        super(characteristics, skills, talents, aptitudes, traits, kit, wounds, 0, OnlyWarCharacterModifierTypes.REGIMENT);
        this._name = name;
        this._favoredWeapons = favoredWeapons;
        this._optionalModifiers = optionalModifiers;
    }

    private _optionalModifiers:Array<SelectableModifier>
    private _favoredWeapons:Array<Weapon>;

    public apply(character:OnlyWarCharacter):any {
        super.apply(character);
        for (var entry of this.characteristics.entries()) {
            character.characteristics.get(entry[0]).regimentModifier = entry[1];
        }
        character.wounds.regimentModifier = this.wounds;
    }

    public unapply() {
        for (var entry of this.characteristics.entries()) {
            this._appliedTo.characteristics.get(entry[0]).regimentModifier = 0;
        }
        this._appliedTo.wounds.regimentModifier = 0;
        super.unapply();
    }

    private _name:string;

    get name():string {
        return this._name;
    }

    get favoredWeapons():Array<Weapon> {
        return this._favoredWeapons;
    }

    get optionalModifiers():Array<SelectableModifier> {
        return this._optionalModifiers;
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
    private _favoredWeapons:Array<Weapon>;
    private _optionalModifiers:Array<SelectableModifier> = [];

    build():Regiment {
        return new Regiment(this._name, this._characteristics, this._skills, this._talents, this._aptitudes,
            this._traits, this._kit, this._wounds, this._optionalModifiers, this._favoredWeapons);
    }

    favoredWeapons(value:Array<Weapon>) {
        this._favoredWeapons = value;
        return this;
    }

    name(value:string) {
        this._name = value;
        return this;
    }

    characteristics(value:Map<Characteristic, number>) {
        this._characteristics = value;
        return this;
    }

    talents(value:Array<Talent>) {
        this._talents = value;
        return this;
    }

    skills(value:Map<SkillDescription, number>) {
        this._skills = value;
        return this;
    }

    traits(value:Array<Trait>) {
        this._traits = value;
        return this;
    }

    aptitudes(value:Array<string>) {
        this._aptitudes = value;
        return this;
    }

    kit(value:Map<Item, number>) {
        this._kit = value;
        return this;
    }

    wounds(value:number) {
        this._wounds = value;
        return this;
    }

    optionalModifiers(value:Array<SelectableModifier>) {
        this._optionalModifiers = value;
        return this;
    }
}