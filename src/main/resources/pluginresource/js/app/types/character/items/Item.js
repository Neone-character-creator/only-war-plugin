/**
 * Created by Damien on 6/29/2016.
 */
export class Item {
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
export var ItemCraftsmanship;
(function (ItemCraftsmanship) {
    ItemCraftsmanship[ItemCraftsmanship["POOR"] = 0] = "POOR";
    ItemCraftsmanship[ItemCraftsmanship["COMMON"] = 1] = "COMMON";
    ItemCraftsmanship[ItemCraftsmanship["GOOD"] = 2] = "GOOD";
    ItemCraftsmanship[ItemCraftsmanship["BEST"] = 3] = "BEST";
})(ItemCraftsmanship || (ItemCraftsmanship = {}));
//# sourceMappingURL=Item.js.map