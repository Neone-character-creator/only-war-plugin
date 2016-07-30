import {Craftsmanship} from "../types/character/items/Item";
/**
 * Created by Damien on 7/29/2016.
 */
export function filter(inVal) {
    return inVal.map((option)=> {
        var out = "";
        switch (option.property) {
            case "talent":
                return option.value.specialization ? option.value.name + " (" + option.value.specialization + ")" : option.value.name;
            case "skill":
                return option.value.specialization ? option.value.skill.name
                + " (" + option.value.skill.specialization
                + ") +" + (option.value.rank - 1) * 10
                    : option.value.skill.name + " +" + (option.value.rank - 1) * 10;
            case "character kit":
                var itemDescription = option.value.count + " x ";
                var itemCraftsmanship = option.value.item.craftsmanship;
                if (itemCraftsmanship !== Craftsmanship.Common) {
                    switch (itemCraftsmanship) {
                        case Craftsmanship.Best:
                            itemDescription += "Best craftsmanship ";
                            break;
                        case Craftsmanship.Good:
                            itemDescription += "Good craftsmanship ";
                            break;
                        case Craftsmanship.Poor:
                            itemDescription += "Poor craftsmanship ";
                            break;
                    }
                }
                itemDescription += option.value.item.name;
                var itemUpgrades = option.value.item.upgrades;
                if (itemUpgrades) {
                    itemDescription += " with " + itemUpgrades.join(", ");
                }
                return itemDescription;
        }
    }).join(", ");
}