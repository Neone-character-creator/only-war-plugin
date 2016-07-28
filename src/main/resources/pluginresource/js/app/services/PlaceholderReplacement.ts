import {Talent} from "../types/character/Talent";
import {Item, ItemType, Availability} from "../types/character/items/Item";
import {CharacterOptionsService} from "./CharacterOptionsService";
/**
 * Created by Damien on 7/15/2016.
 */
export class PlaceholderReplacement {
    private _characteroptions:CharacterOptionsService;

    constructor(characteroptions:CharacterOptionsService) {
        this._characteroptions = characteroptions;
    }

    /**
     * Attempt to get the actual value for the given placeholder as the given type.
     *
     * The types are skill, talent, item power.
     * @param placeholder
     * @param type
     */
    public replace(placeholder:any, type:string):any {
        switch (type) {
            case "talent":
                var talentName = placeholder.substring(0, placeholder.indexOf("(") == -1 ? placeholder.length : placeholder.indexOf("(")).trim();
                var specialization = placeholder.substring(placeholder.indexOf("(") + 1, placeholder.indexOf(")"));
                var talent:Talent = this._characteroptions.talents.find(talent=> {
                    return talent.name === talentName;
                });
                if (!talent) {
                    throw "Tried to find a replacement for talent " + placeholder + " but failed.";
                }
                return new Talent(talent.name, talent.source, talent.tier, talent.aptitudes, specialization, talent.prerequisites);
            case "item":
                var item = this._characteroptions.items.find(item=> {
                    return item.name === placeholder.item.name;
                });
                if (!item) {
                    item = this._characteroptions.weapons.find(weapon=> {
                        return weapon.name === placeholder.item.name;
                    })
                }
                if (!item) {
                    item = this._characteroptions.armor.find(armor=> {
                        return armor.name === placeholder.item.name;
                    })
                }
                if (!item) {
                    item = this._characteroptions.vehicles.find(vehicle=> {
                        return vehicle.name === placeholder.item.name;
                    })
                }
                if (!item) {
                    console.log("Tried to find item for " + placeholder.item.name + " but failed.");
                    item = new Item(placeholder.item.name, ItemType.Other, Availability.Common);
                }
                return item;
            case "skill":
                var skillName = placeholder.indexOf("(") === -1 ? placeholder : placeholder.substring(0, placeholder.indexOf("(")).trim();
                var skill = this._characteroptions.skills.find(function (skill) {
                    return skill.name === skillName;
                });
                if (skill.specialization) {
                    skill.specialization = placeholder.indexOf("(") === -1 ? null : placeholder.substring(placeholder.indexOf("(") + 1, placeholder.indexOf(")")).trim();
                    placeholder.indexOf("(") === -1 ? placeholder : placeholder.substring(placeholder.indexOf("(") + 1, placeholder.indexOf(")")).trim();
                }
                return skill;
            default:
                throw "Incorrect type name, must be skill, talent, item or power.";
        }
    }

}