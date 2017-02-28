/**
 * Created by Damien on 7/29/2016.
 */
export function filter(inVal) {
    return inVal.map((option)=> {
        var out = "";
        switch (option.property) {
            case "talent":
            {
                return option.value.specialization ? option.value.name + " (" + option.value.specialization + ")" : option.value.name;
            }
            case "skill":
            {
                return option.value.specialization ? option.value.skill.name
                + " (" + option.value.skill.specialization
                + ") +" + (option.value.rank - 1) * 10
                    : option.value.skill.name + " +" + (option.value.rank - 1) * 10;
            }
            case "item":
            {
                var itemDescription = option.value.count + " x ";
                var itemCraftsmanship = option.value.item.craftsmanship;
                if (itemCraftsmanship !== "Common") {
                    itemDescription += itemCraftsmanship + " craftsmanship";
                }
                itemDescription += option.value.item.name;
                var itemUpgrades = option.value.item.upgrades;
                if (itemUpgrades.length > 0) {
                    itemDescription += " with " + itemUpgrades.join(", ");
                }
                return itemDescription;
            }
            case "characteristic":
                return option.value.characteristic.name + " " + (option.value.rating >= 0 ? "+" + option.value.rating : option.value.rating);
        }
    }).join(", ");
}