import {Craftsmanship} from "../types/character/items/Item";
/**
 * Created by Damien on 7/29/2016.
 */
export function filter(inVal:any) {
    if (typeof inVal.numSelectionsNeeded === 'number' && Array.isArray(inVal.options)) {
        var out = "Choose " + inVal.numSelectionsNeeded + " from ";
        var options = [];
        $.each(inVal.options, function (index, option) {
            var optionElements = [];
            for (var op = 0; op < option.length; op++) {
                switch (option[op].property) {
                    case 'characteristic':
                        for (var characteristic in option[op].value) {
                            optionElements.push(characteristic + " +" + option[op].value[characteristic])
                        }
                        break;
                    case 'talent':
                        var talentDescription = option[op].value.specialization ? option[op].value.name + " (" + option[op].value.specialization + ")" : option[op].value.name;
                        optionElements.push(talentDescription);
                        break;
                    case 'skill':
                        var skillDescription = option[op].value.specialization ? option[op].value.skill.name + " (" + option[op].value.skill.specialization + ")" : option[op].value.skill.name;
                        optionElements.push(skillDescription + " +" + (option[op].value.rank - 1) * 10);
                        break;
                    case 'character kit':
                        var itemDescription = option[op].value.count + " x ";
                        var itemCraftsmanship = option[op].value.item.craftsmanship;
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
                        itemDescription += option[op].value.item.name;
                        var itemUpgrades = option[op].value.item.upgrades;
                        if (itemUpgrades) {
                            itemDescription += " with " + itemUpgrades.join(", ");
                        }
                        optionElements.push(itemDescription)
                        break;

                }
            }
            options.push(optionElements.join(", "));
        });
        out += options.join(" or ");
        return out;
    } else {
        return inVal;
    }
}