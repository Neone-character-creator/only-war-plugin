define(["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * Created by Damien on 6/28/2016.
     */
    class Talent {
        constructor(name, source, tier, aptitudes, specialization, prerequisites, maxTimesPurchaseable) {
            this.prerequisites = prerequisites;
            this._aptitudes = aptitudes;
            this._name = name;
            this._source = source;
            this._tier = tier;
            this._specialization = specialization;
            if (maxTimesPurchaseable) {
                this._maxTimesPurchaseable = maxTimesPurchaseable;
            }
            else {
                this._maxTimesPurchaseable = 1;
            }
        }
        meetsPrerequisites(target) {
            return this.prerequisites.match(target);
        }
        get name() {
            return this._name;
        }
        get source() {
            return this._source;
        }
        get tier() {
            return this._tier;
        }
        get specialization() {
            return this._specialization;
        }
        get aptitudes() {
            return this._aptitudes;
        }
        get maxTimesPurchaseable() {
            return this._maxTimesPurchaseable;
        }
    }
    exports.Talent = Talent;
});
//# sourceMappingURL=Talent.js.map