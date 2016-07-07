import {CharacterModifier, OnlyWarCharacterModifierTypes, SelectableModifier} from "./CharacterModifier";
import {Talent} from "./Talent";
import {Item} from "./items/Item";
import {Trait} from "./Trait";
import {Characteristic} from "./Characteristic";
import {OnlyWarCharacter} from "./Character";
import {Skill} from "./Skill";
/**
 * A fully complete regiment modifier
 * Created by Damien on 6/27/2016.
 */
export class Regiment extends CharacterModifier {
    constructor(characteristics:Map<Characteristic, number>, skills:Array<Skill>, talents:Array<Talent>, aptitudes:Array<string>, traits:Array<Trait>, kit:Array<Item>, wounds:number) {
        super(characteristics, skills, talents, aptitudes, traits, kit, wounds, 0, OnlyWarCharacterModifierTypes.REGIMENT);
    }

    private _optionalModifiers:Array<SelectableModifier>


    protected applyCharacteristicModifiers(character:OnlyWarCharacter):any {
        for (var characteristic of this._characteristics) {
            character.characteristics.get(characteristic[0]).regimentModifier = characteristic[1];
        }
    }

    protected applyWoundsModifier(character:OnlyWarCharacter) {
        character.wounds.regimentModifier = this._wounds;
    }
}