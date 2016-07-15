/**
 * A character Skill.
 */
export class Skill {
    /**
     * The name of the skill.
     */
    private _name:string;
    /**
     * The rank of the skill, from 0 to 4, mapped to the Only War skill ratings.
     *
     * 0 is untrained (-30).
     * 1 is known (+0).
     * 2 is trained (+10).
     * 3 is experienced (+20).
     * 4 is veteran (+30).
     */
    private _rank:number;
    /**
     * The specialization of the skill, if it has one.
     */
    private _specialization:string;
    private _aptitudes:Array<string>;

    constructor(name:string, rank:number, aptitudes:Array<string>, specialization:string = null) {
        if (rank < 0 || rank > 4) {
            throw "The rank must be at least 0 and less than 4 but was" + rank + ".";
        }
        this._name = name;
        this._rank = rank;
        this._aptitudes = aptitudes;
        this._specialization = specialization;
    }

    get name():string {
        return this._name;
    }

    get rank():number {
        return this._rank;
    }

    get specialization():string {
        return this._specialization;
    }

    get aptitudes():Array<string> {
        return this._aptitudes;
    }

    set rank(value:number) {
        if (value < 0 || value > 4) {
            throw "The rank must be between 0 and 4 but was" + value + ".";
        }
        this._rank = value;
    }
}