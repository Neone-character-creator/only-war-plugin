define(["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * Created by Damien on 6/29/2016.
     */
    class Item {
        constructor(name, craftsmanship, type, weight) {
            this._name = name;
            this._craftsmanship = craftsmanship;
            if (weight) {
                this._weight = weight;
            }
            else {
                this._weight = 0;
            }
        }

        get name() {
            return this._name;
        }

        get craftsmanship() {
            return this._craftsmanship;
        }

        get weight() {
            return this._weight;
        }
    }
    exports.Item = Item;
    itemCraftsmanship = [
        "Poor",
        "Common",
        "Good",
        "Best"
    ];
    itemTypes = [
        "Weapon",
        "Armor",
        "Other"
    ];
});
//# sourceMappingURL=Item.js.map