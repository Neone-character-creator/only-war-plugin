import {AdvanceableProperty, OnlyWarCharacter} from "../Character";
import {CharacterModifier, OnlyWarCharacterModifierTypes} from "../CharacterModifier";
import {Characteristic} from "../Characteristic";
import {Talent} from "../Talent";
import {Trait} from "../Trait";
import {Item} from "../items/Item";
import {Skill} from "../Skill";
/**
 * An advancement to a character, purchased with xp.
 *
 * Created by Damien on 6/29/2016.
 */
export abstract class CharacterAdvancement extends CharacterModifier {
    /**
     * Other advancements that add values that  fasdfasdfasdfasdfasdf
     * @type {Array}
     */
    private prerequisiteAdvances:Array<CharacterAdvancement> = [];
    /**
     * The property that the advancement modifies.
     */
    private _property:AdvanceableProperty;

    constructor(property:AdvanceableProperty,
                characteristics:Map<Characteristic, number>,
                skills:Array<Skill>,
                talents:Array<Talent>,
                aptitudes:Array<string>,
                traits:Array<Trait>,
                kit:Array<Item>,
                wounds:number,
                psyRating:number,
                type:OnlyWarCharacterModifierTypes) {
        super(characteristics, skills, talents, aptitudes, traits, kit, wounds, psyRating, type);
        this._property = property;
    }


    get property():AdvanceableProperty {
        return this._property;
    }

    /**
     * Calculate the amount of experience it would cost to add this advancement to the given character.
     *
     * @param character
     * @returns {number}
     */
    public abstract calculateExperienceCost(character:OnlyWarCharacter):number;
}