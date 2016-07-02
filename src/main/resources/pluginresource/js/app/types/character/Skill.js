/**
 * A character Skill.
 */
export class Skill {
    constructor(name, rank, specialization = null) {
        if (rank < 0 || rank > 4) {
            throw "The rank must be between 0 and 4 but was" + rank + ".";
        }
        this._name = name;
        this._rank = rank;
        this._specialization = specialization;
    }
    get name() {
        return this._name;
    }
    get rank() {
        return this._rank;
    }
    set rank(value) {
        if (value < 0 || value > 4) {
            throw "The rank must be between 0 and 4 but was" + value + ".";
        }
        this._rank = value;
    }
}
//# sourceMappingURL=Skill.js.map