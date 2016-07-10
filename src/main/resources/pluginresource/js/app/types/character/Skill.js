define(["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * A character Skill.
     */
    class Skill {
        constructor(name, rank, aptitudes, specialization = null) {
            if (rank < 0 || rank > 4) {
                throw "The rank must be at least 0 and less than 4 but was" + rank + ".";
            }
            this._name = name;
            this._rank = rank;
            this._aptitudes = aptitudes;
            this._specialization = specialization;
        }

        static get skills() {
            return Skill._skills;
        }

        get name() {
            return this._name;
        }

        get rank() {
            return this._rank;
        }

        get specialization() {
            return this._specialization;
        }

        get aptitudes() {
            return this._aptitudes;
        }

        set rank(value) {
            if (value < 0 || value > 4) {
                throw "The rank must be between 0 and 4 but was" + value + ".";
            }
            this._rank = value;
        }
    }
    Skill._skills = new Map();
    exports.Skill = Skill;
});
//# sourceMappingURL=Skill.js.map