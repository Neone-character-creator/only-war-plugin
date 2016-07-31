import {Talent} from "../types/character/Talent";
import {Item, ItemType, Availability} from "../types/character/items/Item";
import {CharacterOptionsService} from "./CharacterOptionsService";
import {Characteristic} from "../types/character/Characteristic";
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
            {
                var talentName = placeholder.substring(0, placeholder.indexOf("(") == -1 ? placeholder.length : placeholder.indexOf("(")).trim();
                var specialization = placeholder.substring(placeholder.indexOf("(") + 1, placeholder.indexOf(")"));
                var talent:Talent = this._characteroptions.talents.find(talent=> {
                    return talent.name === talentName;
                });
                if (!talent) {
                    throw "Tried to find a replacement for talent " + placeholder + " but failed.";
                }
                return new Talent(talent.name, talent.source, talent.tier, talent.aptitudes, specialization, talent.prerequisites);
            }
            case "item":
            {
                var item = this._characteroptions.items.find(item=> {
                    return item.name === placeholder.name;
                });
                if (!item) {
                    item = this._characteroptions.weapons.find(weapon=> {
                        return weapon.name === placeholder.name;
                    })
                }
                if (!item) {
                    item = this._characteroptions.armor.find(armor=> {
                        return armor.name === placeholder.name;
                    })
                }
                if (!item) {
                    item = this._characteroptions.vehicles.find(vehicle=> {
                        return vehicle.name === placeholder.name;
                    })
                }
                if (!item) {
                    console.log("Tried to find item for " + placeholder.name + " but failed.");
                    item = new Item(placeholder.name, ItemType.Other, Availability.Common);
                    item['main weapon'] = placeholder['main weapon'];
                    item['armor'] = placeholder['armor'];
                }
            }
                return item;
            case "skill":
            {
                var skillName = placeholder.indexOf("(") === -1 ? placeholder : placeholder.substring(0, placeholder.indexOf("(")).trim();
                var skill = this._characteroptions.skills.find(function (skill) {
                    return skill.name === skillName;
                });
                if (skill.specialization) {
                    skill.specialization = placeholder.indexOf("(") === -1 ? null : placeholder.substring(placeholder.indexOf("(") + 1, placeholder.indexOf(")")).trim();
                    placeholder.indexOf("(") === -1 ? placeholder : placeholder.substring(placeholder.indexOf("(") + 1, placeholder.indexOf(")")).trim();
                }
                return skill;
            }
            case "characteristic":
            {
                placeholder.characteristic = Characteristic.characteristics.get(placeholder.characteristic);
                return placeholder;
            }
            case "trait":
            {
                var traitName = placeholder.indexOf("(") === -1 ? placeholder : placeholder.substring(0, placeholder.indexOf("(")).trim();
                var rating = placeholder.indexOf("(") === -1 ? null : Number.parseInt(placeholder.substring(placeholder.indexOf("(") + 1, placeholder.indexOf(")")));
                var foundTrait = this._characteroptions.traits.find((trait)=> {
                    return trait.name === traitName;
                });
                foundTrait = angular.copy(foundTrait);
                foundTrait.rating = rating;
                return foundTrait;
            }
            default:
                throw "Incorrect type name, must be skill, talent, item or power.";
        }
    }

}