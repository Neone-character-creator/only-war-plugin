define(["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * Created by Damien on 6/29/2016.
     */
    class PsychicPower {
        get name() {
            return this._name;
        }

        get xpCost() {
            return this._xpCost;
        }

        get isBonus() {
            return this._isBonus;
        }

        set isBonus(value) {
            this._isBonus = value;
        }
    }
    exports.PsychicPower = PsychicPower;
});
//# sourceMappingURL=PsychicPower.js.map