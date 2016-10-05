import {Talent} from "../types/character/Talent";
import {Item, ItemType, SpecialEquipmentCategory} from "../types/character/items/Item";
import {CharacterOptionsService} from "./CharacterOptionsService";
import {Characteristic} from "../types/character/Characteristic";
import {SkillDescription} from "../types/character/Skill";
import {Weapon} from "../types/character/items/Weapon";
import {Armor} from "../types/character/items/Armor";
import {Trait} from "../types/character/Trait";
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
                var talent:Talent = this._characteroptions.talents.find(talent=> {
                    return talent.name === placeholder.name;
                });
                if (!talent) {
                    throw "Tried to find a talent replacement for " + placeholder + " but failed.";
                }
                return new Talent(talent.name, talent.source, talent.tier, talent.aptitudes, placeholder.specialization, talent.prerequisites);
            }
            case "item":
            {
                var item = this._characteroptions.items.find(item=> {
                    return item.name === placeholder.name;
                });
                if (!item) {
                    item = this._characteroptions.weapons.find(weapon=> {
                        return weapon.name === placeholder.name;
                    });
                }
                if (!item) {
                    item = this._characteroptions.armor.find(armor=> {
                        return armor.name === placeholder.name;
                    });
                }
                if (!item) {
                    item = this._characteroptions.vehicles.find(vehicle=> {
                        return vehicle.name === placeholder.name;
                    });
                }
                if (item && placeholder['main weapon']) {
                    let original:Weapon = <Weapon>item;
                    item = new Weapon(original.name, original.availability, original.class, original.weaponType, original.range,
                        original.rateOfFire, original.damage, original.penetration, original.clip, original.reload,
                        original.special, original.weight, SpecialEquipmentCategory.MainWeapon, original.upgrades, original.craftsmanship);
                }
                if (item) {
                    switch (item.type) {
                        case ItemType.Weapon:
                            return new Weapon(item.name, item.availability, (<Weapon>item).class,
                                (<Weapon>item).weaponType, (<Weapon>item).range, (<Weapon>item).rateOfFire,
                                (<Weapon>item).damage, (<Weapon>item).penetration, (<Weapon>item).clip, (<Weapon>item).reload,
                                (<Weapon>item).special, (<Weapon>item).weight, (<Weapon>item).specialEquipmentCategory, placeholder.upgrades,
                                placeholder.craftsmanship);
                        case ItemType.Armor:
                            return new Armor(item.name, item.availability, (<Armor>item).locations, (<Armor>item).ap, (<Armor>item).armorType,
                                (<Armor>item).weight, placeholder.upgrades, placeholder.craftsmanship);
                        case ItemType.Other:
                            return new Item(item.name, ItemType.Other, item.availability, item.weight, placeholder.upgrades,
                                placeholder.craftsmanship);
                    }
                }
                if (!item) {
                    console.log("Tried to find item for " + placeholder.name + " but failed.");
                    item = new Item(placeholder.name, ItemType.Other, "Common");
                    item['main weapon'] = placeholder['main weapon'];
                    item['armor'] = placeholder['armor'];
                }
                return item;
            }
            case "skill":
            {
                var skill = this._characteroptions.skills.find(function (skill) {
                    return skill.name === placeholder.name;
                });
                var skillSpecialization;
                return new SkillDescription(skill.name, skill.aptitudes, placeholder.specialization);
            }
            case "characteristic":
            {
                placeholder.characteristic = Characteristic.characteristics.get(placeholder.characteristic);
                return placeholder;
            }
            case "trait":
            {
                var foundTrait = this._characteroptions.traits.find((trait)=> {
                    return trait.name === placeholder.name;
                });
                return new Trait(foundTrait.name, foundTrait.description, placeholder.rating);
            }
            default:
                throw "Incorrect type name, must be skill, talent, item or power.";
        }
    }
}