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
        ;
    }

    public unapply() {
        this._appliedTo.wounds.specialtyModifier = 0;
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