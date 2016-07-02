/**
 * A character Skill.
 */
export class Skill {
    /**
     * The name of the skill.
     */
    private _name:String;
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
    private _specialization:String;

    constructor(name:String, rank:number, specialization:String = null) {
        if (rank < 0 || rank > 4) {
            throw "The rank must be between 0 and 4 but was" + rank + ".";
        }
        this._name = name;
        this._rank = rank;
        this._specialization = specialization;
    }

    get name():String {
        return this._name;
    }

    get rank():number {
        return this._rank;
    }

    set rank(value:number) {
        if (value < 0 || value > 4) {
            throw "The rank must be between 0 and 4 but was" + value + ".";
        }
        this._rank = value;
    }


}
