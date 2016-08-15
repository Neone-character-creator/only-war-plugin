import {Item} from "../types/character/items/Item";
/**
 * Created by Damien on 8/4/2016.
 */

export function ItemSummamryFilter(inVal:[Item, number]) {
    var upgrades = inVal[0].upgrades ? "w/ " + inVal[0].upgrades.join(", ") : "";
    return inVal[1] + " x " + (inVal[0].craftsmanship !== "Common" ? inVal[0].craftsmanship + " Craftsmanship " : "") + inVal[0].name + upgrades;
}