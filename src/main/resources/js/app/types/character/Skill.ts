import {CharacterModifier} from "./CharacterModifier";
/**
 * A Skill that exists on a character.
 */
export class Skill {
    /**
     * The combination name and specialization of the skill.
     */
    private _identifier:SkillDescription;
    /**
     * The modifiers that have modified the rank of this skill and the amount of a modifier they provide.
     * @private
     */
    private _rankSources:Array<CharacterModifier> = new Array<CharacterModifier>();

    constructor(identifier:SkillDescription) {
        this._identifier = identifier;
    }

    get identifier():SkillDescription {
        return this._identifier;
    }

    /**
     * The rank of the skill, from 1 to 4, mapped to the Only War skill ratings.
     *
     * 1 is known (+0).
     * 2 is trained (+10).
     * 3 is experienced (+20).
     * 4 is veteran (+30).
     */
    get rank():number {
        var calculated = this._rankSources.map(modifier=> {
            return modifier.skills.get(this._identifier);
        }).reduce((original, next)=> {
            return original + next;
        }, 0);
        return calculated <= 4 ? calculated : 4;
    }

    addRankModifier(modifier:CharacterModifier) {
        if (this._rankSources.indexOf(modifier) === -1) {
            this._rankSources.push(modifier)
        } else {
            throw "Tried to add a modifier to the skill " + this._identifier.name + " (" + this._identifier.specialization + ") that was already modifying it.";
        }
    }

    removeRankModifier(modifier:CharacterModifier) {
        var index = this._rankSources.indexOf(modifier);
        if (index !== -1) {
            this._rankSources.splice(index, 1);
        }
    }
    
    get rankSources():Array<CharacterModifier> {
        return this._rankSources;
    }
}

/**
 * Contains the name and optional specialization and aptitudes of the skill.
 */
export class SkillDescription {
    private _name:string;
    private _specialization:string|boolean;
    private _aptitudes:Array<string>;

    constructor(name:string, aptitudes:Array<string>, specialization?:string|boolean) {
        this._name = name;
        this._aptitudes = aptitudes;
        this._specialization = specialization;
    }


    get name():string {
        return this._name;
    }

    get specialization():string|boolean {
        return this._specialization;
    }

    get aptitudes():Array<string> {
        return this._aptitudes;
    }
}