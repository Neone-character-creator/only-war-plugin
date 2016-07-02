import {CharacterModifier, OnlyWarCharacterModifierTypes} from "./CharacterModifier";
import {Talent} from "./Talent";
import {Trait} from "./Trait";
import {Item} from "./items/Item";
import {CharacteristicName} from "./Characteristic";
/**
 * Created by Damien on 6/29/2016.
 */
export class Specialty extends CharacterModifier {
    constructor(characteristics:Map<CharacteristicName, number>, skills:Map<[string,string], number>, talents:Array<Talent>, aptitudes:Array<string>, traits:Array<Trait>, kit:Array<Item>, wounds:number) {
        super(characteristics, skills, talents, aptitudes, traits, kit, wounds, 0, OnlyWarCharacterModifierTypes.SPECIALTY);
    }
}