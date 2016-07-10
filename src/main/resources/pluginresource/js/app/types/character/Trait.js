define(["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * Represents a character trait.
     * Created by Damien on 6/29/2016.
     */
    class Trait {
        constructor(name, description) {
            this._name = name;
            this._description = description;
        }

        get name() {
            return this._name;
        }

        get description() {
            return this._description;
        }
    }
    exports.Trait = Trait;
});
//# sourceMappingURL=Trait.js.map