/**
 * Created by Damien on 7/28/2016.
 */
import {SpecialAbility} from "../SpecialAbility";
import {SelectableModifier} from "../../character/CharacterModifier";
import {Weapon} from "../../character/items/Weapon";
import {Item} from "../../character/items/Item";
import {Trait} from "../../character/Trait";
import {SkillDescription} from "../../character/Skill";
import {Talent} from "../../character/Talent";
import {Characteristic} from "../../character/Characteristic";
/**
 * A modifier that changes the stats of a regiment that is being created by the user.
 *
 * These are combined to cret
 */
export class RegimentCreationModifier {
    private _name:string;
    private _characteristics:Map<Characteristic, number>;
    private _talents:Array<Talent>;
    private _skills:Map<SkillDescription, number> = new Map();
    private _traits:Array<Trait>;
    private _aptitudes:Array<string>;
    private _kit:Map<Item,number>;
    private _wounds:number;
    private _optionalModifiers:Array<SelectableModifier>;
    private _specialAbilities:Array<SpecialAbility>;
    private _cost:number;

    constructor(configurator:RegimentCreationModifierConfigurator) {
        this._name = configurator.name;
        this._characteristics = new Map();
        if (configurator.characteristics) {
            for (let entry of configurator.characteristics) {
                this._characteristics.set(entry[0], entry[1]);
            }
        }
        this._aptitudes = configurator.aptitudes ? configurator.aptitudes : [];
        this._kit = new Map();
        if (configurator.kit) {
            for (let entry of configurator.kit) {
                this._kit.set(entry[0], entry[1]);
            }
        }
        this._optionalModifiers = configurator.optionalModifiers ? Array.from(configurator.optionalModifiers) : [];
        this._skills = new Map();
        if (configurator.skills) {
            for (let entry of configurator.skills) {
                this._skills.set(entry[0], entry[1]);
            }
        }
        this._specialAbilities = configurator.specialAbilities ? Array.from(configurator.specialAbilities) : [];
        this._wounds = configurator.wounds ? configurator.wounds : 0;
        this._talents = configurator.talents ? Array.from(configurator.talents) : [];
        this._cost = configurator.cost;
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

    get optionalModifiers():Array<SelectableModifier> {
        return this._optionalModifiers;
    }

    get specialAbilities():Array<SpecialAbility> {
        return this._specialAbilities;
    }

    get cost():number {
        return this._cost;
    }
}

export class Homeworld extends RegimentCreationModifier {
}

export class CommandingOfficer extends RegimentCreationModifier {
}

export class RegimentType extends RegimentCreationModifier {
}

export class SpecialEquipmentorTrainingDoctrine extends RegimentCreationModifier {
}

export class StandardRegimentKit extends RegimentCreationModifier {
}

export class Drawback extends RegimentCreationModifier{}

export interface RegimentCreationModifierConfigurator {
    name?:string,
    characteristics?:Map<Characteristic, number>;
    talents?:Array<Talent>;
    skills?:Map<SkillDescription, number>;
    traits?:Array<Trait>;
    aptitudes?:Array<string>;
    kit?:Map<Item,number>;
    wounds?:number;
    optionalModifiers?:Array<SelectableModifier>;
    specialAbilities?:Array<SpecialAbility>;
    cost?:number;
}