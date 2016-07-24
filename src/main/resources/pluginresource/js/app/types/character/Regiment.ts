import {CharacterModifier, OnlyWarCharacterModifierTypes, SelectableModifier} from "./CharacterModifier";
import {Talent} from "./Talent";
import {Item} from "./items/Item";
import {Trait} from "./Trait";
import {Characteristic} from "./Characteristic";
import {OnlyWarCharacter} from "./Character";
import {Skill, SkillDescription} from "./Skill";
/**
 * A fully complete regiment modifier
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
                optionalModifiers:Array<SelectableModifier>) {
        super(characteristics, skills, talents, aptitudes, traits, kit, wounds, 0, OnlyWarCharacterModifierTypes.REGIMENT);
        this._name = name;
        this._optionalModifiers = optionalModifiers;
    }

    private _optionalModifiers:Array<SelectableModifier>

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

    get optionalModifiers():Array<SelectableModifier> {
        return this._optionalModifiers;
    }

}