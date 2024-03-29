import {
    RegimentCreationModifier, Homeworld, CommandingOfficer, RegimentType,
    SpecialEquipmentorTrainingDoctrine, StandardRegimentKit
} from "./RegimentCreationModifier";
import {Weapon} from "../../character/items/Weapon";
import {Item} from "../../character/items/Item";
import {Regiment, RegimentBuilder} from "../../character/Regiment";
import {Characteristic} from "../../character/Characteristic";
import {Talent} from "../../character/Talent";
import * as angular from "angular";
import {SkillDescription} from "../../character/Skill";
import {SpecialAbility} from "../SpecialAbility";
import {Armor} from "../../character/items/Armor";
import {KitModifierResult} from "./KitModifier";
import preventExtensions = Reflect.preventExtensions;

/**
 * Created by Damien on 7/31/2016.
 */
export class RegimentCreationElementsContainer {
    private _name:string;
    private _homeworld:RegimentCreationElement<Homeworld> = {selected: null, options: []};
    private _commander:RegimentCreationElement<CommandingOfficer> = {selected: null, options: []};
    private _regimentType:RegimentCreationElement<RegimentType> = {selected: null, options: []};
    private _firstSpecialDoctrine:RegimentCreationElement<SpecialEquipmentorTrainingDoctrine> = {
        selected: null,
        options: []
    };
    private _secondSpecialDoctrine:RegimentCreationElement<SpecialEquipmentorTrainingDoctrine> = {
        selected: null,
        options: []
    };
    private _standardRegimentalKit:Map<Item, number> = new Map();
    private _basicFavoredWeapons:Array<Weapon> = [];
    private _heavyFavoredWeapons:Array<Weapon> = [];
    private _kitModifiers:Array<KitModifierResult> = [];
    private _remainingKitPoints:number;
    private _remainingRegimentPoints:number;

    set basicFavoredWeapons(value:Array<Weapon>) {
        this._basicFavoredWeapons = value;
    }

    set heavyFavoredWeapons(value:Array<Weapon>) {
        this._heavyFavoredWeapons = value;
    }

    set name(value:string) {
        this._name = value;
    }

    get name() {
        return this._name;
    }

    get homeworld():RegimentCreationElement<Homeworld> {
        return this._homeworld;
    }

    get commander():RegimentCreationElement<CommandingOfficer> {
        return this._commander;
    }

    get regimentType():RegimentCreationElement<RegimentType> {
        return this._regimentType;
    }

    get firstSpecialDoctrine():RegimentCreationElement<SpecialEquipmentorTrainingDoctrine> {
        return this._firstSpecialDoctrine;
    }

    get secondSpecialDoctrine():RegimentCreationElement<SpecialEquipmentorTrainingDoctrine> {
        return this._secondSpecialDoctrine;
    }

    get basicFavoredWeapons():Array<Weapon> {
        return this._basicFavoredWeapons;
    }

    get heavyFavoredWeapons():Array<Weapon> {
        return this._heavyFavoredWeapons;
    }

    get regimentKit():Map<Item, number> {
        let mainWeaponsReplaced:boolean = this._regimentType.selected ? Array.from(this._regimentType.selected.kit.keys()).map(item=> {
            if (item instanceof Weapon && (<Weapon>item).specialEquipmentCategory) {
                return true;
            }
            return false;
        }).reduce((previous, current)=> {
            return previous || current;
        }, false) : false;
        let armorReplaced = this._regimentType.selected ? Array.from(this._regimentType.selected.kit.keys()).map(item=> {
            if (item instanceof Weapon) {
                return true;
            }
            return false;
        }).reduce((previous, current)=> {
            return previous || current;
        },false) : false;
        let regimentKit:Map<Item, number> = new Map();
        for (let entry of this._standardRegimentalKit.entries()) {
            let existingCount = regimentKit.get(entry[0]);
            if (!existingCount) {
                existingCount = 0;
            }
            if ((<Weapon>entry[0]).specialEquipmentCategory && mainWeaponsReplaced) {
                continue;
            }
            if (entry[0] instanceof Armor && armorReplaced) {
                continue;
            }
            regimentKit.set(entry[0], entry[1] + existingCount)
        }
        let elements = [this.homeworld.selected, this.commander.selected, this.regimentType.selected, this.firstSpecialDoctrine.selected, this.secondSpecialDoctrine.selected].filter(i=> {
            return i !== null;
        }).map(e=> {
            return e.kit;
        });
        elements.forEach(e => {
            for (let entry of e.entries()) {
                let existingCount = regimentKit.get(entry[0]);
                if (!existingCount) {
                    existingCount = 0;
                }
                regimentKit.set(entry[0], entry[1] + existingCount)
            }
        });
        this._remainingRegimentPoints = [this.homeworld.selected, this.commander.selected, this.regimentType.selected, this.firstSpecialDoctrine.selected, this.secondSpecialDoctrine.selected].filter(e=> {
            return e !== null;
        }).map(e=> {
            return e.cost;
        }).reduce((previous, current)=> {
            return previous - current;
        }, 12);
        this._remainingKitPoints = 30 + this._remainingRegimentPoints * 2;
        this._kitModifiers.forEach(mod=> {
            for (let removed of mod.itemsRemoved.entries()) {
                let count = regimentKit.get(removed[0]);
                if (count == removed[1]) {
                    regimentKit.delete(removed[0]);
                } else {
                    regimentKit.set(removed[0], count - removed[1]);
                }
            }
            for (let added of mod.itemsAdded.entries()) {
                let found = false;
                for (let existing of regimentKit.entries()) {
                    if (existing[0].name === added[0].name
                        && existing[0].craftsmanship === added[0].craftsmanship
                        && angular.equals(existing[0].upgrades, added[0].upgrades)) {
                        let count = existing[1];
                        regimentKit.set(existing[0], existing[1] + added[1]);
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    regimentKit.set(added[0], added[1]);
                }
            }
            this._remainingKitPoints -= mod.modifier.kitPointCost;
        })
        return regimentKit;
    }

    set standardRegimentalKit(value:Map<Item, number>) {
        this._standardRegimentalKit = value;
    }

    get kitModifiers():Array<KitModifierResult> {
        return this._kitModifiers;
    }

    set kitModifiers(value:Array<KitModifierResult>) {
        this._kitModifiers = value;
    }

    get remainingKitPoints():number {
        return this._remainingKitPoints;
    }

    get remainingRegimentPoints():number {
        return this._remainingRegimentPoints;
    }

    build():Regiment {
        var modifiers:Array<RegimentCreationModifier> = [this._homeworld.selected,
            this._commander.selected,
            this._regimentType.selected,
            this._firstSpecialDoctrine.selected,
            this._secondSpecialDoctrine.selected];
        var characteristics = new Map<Characteristic, number>();
        var talents:Array<Talent> = [];
        var skills:Map<SkillDescription, number> = new Map<SkillDescription, number>();
        var aptitudes:Array<string> = [];
        var kit = new Map<Item, number>();
        var specialAbilities = [];
        var optionalModifiers = [];
        for (let modifier of modifiers) {
            if (modifier) {
                if (modifier.characteristics) {
                    for (let characteristicEntry of modifier.characteristics.entries()) {
                        var existingRating = characteristics.get(characteristicEntry[0])
                        if (!existingRating) {
                            existingRating = 0;
                        }
                        characteristics.set(characteristicEntry[0], existingRating + characteristicEntry[1]);
                    }
                }
                if (modifier.talents) {
                    for (let talent of modifier.talents) {
                        if (!talents.find(t=> {
                                return angular.equals(t, talent);
                            })) {
                            talents.push(talent);
                        }
                    }
                }
                if (modifier.skills) {
                    for (let skillEntry of modifier.skills.entries()) {
                        let existingRating = skills.get(skillEntry[0]);
                        if (!existingRating) {
                            existingRating = 0;
                        }
                        skills.set(skillEntry[0], existingRating + skillEntry[1]);
                    }
                }
                if (modifier.aptitudes) {
                    for (let aptitude of modifier.aptitudes) {
                        if (!aptitudes.find(a=> {
                                return a === aptitude;
                            })) {
                            aptitudes.push(aptitude);
                        }
                    }
                }
                if (modifier.kit) {
                    for (let kitEntry of modifier.kit.entries()) {
                        var existingCount = kit.get(kitEntry[0]);
                        if (!existingCount) {
                            existingCount = 0;
                        }
                        kit.set(kitEntry[0], existingCount + kitEntry[1]);
                    }
                }
                if (modifier.specialAbilities) {
                    for (let specialAbility of modifier.specialAbilities) {
                        specialAbilities.push(new SpecialAbility(specialAbility.name, specialAbility.description));
                    }
                }
                if (modifier.optionalModifiers) {
                    optionalModifiers = optionalModifiers.concat(modifier.optionalModifiers);
                }
            }
        }
        for (let entry of this._standardRegimentalKit.entries()) {
            let existingItemFound = false;
            for (let existingItem of kit.keys()) {
                if (angular.equals(entry, existingItem)) {
                    kit.set(existingItem, kit.get(existingItem) + entry[1]);
                    existingItemFound = true;
                    break;
                }
            }
            if (!existingItemFound) {
                kit.set(entry[0], entry[1]);
            }
        }
        if (this.regimentKit) {
            for (let entry of this.regimentKit.entries()) {
                let existingItemFound = false;
                for (let existingItem of kit.keys()) {
                    if (angular.equals(entry, existingItem)) {
                        kit.set(existingItem, kit.get(existingItem) + entry[1]);
                        existingItemFound = true;
                        break;
                    }
                }
                if (!existingItemFound) {
                    kit.set(entry[0], entry[1]);
                }
            }
        }
        for (let entry of this._standardRegimentalKit.entries()) {
            let existingItemFound = false;
            for (let existingItem of kit.keys()) {
                if (angular.equals(entry, existingItem)) {
                    kit.set(existingItem, kit.get(existingItem) + entry[1]);
                    existingItemFound = true;
                    break;
                }
            }
            if (!existingItemFound) {
                kit.set(entry[0], entry[1]);
            }
        }

        return new RegimentBuilder()
            .setName(this.name)
            .setCharacteristics(characteristics)
            .setTalents(talents)
            .setSkills(skills)
            .setAptitudes(aptitudes)
            .setKit(kit)
            .setSpecialAbilties(specialAbilities)
            .setOptionalModifiers(optionalModifiers)
            .build();
    }
}

interface RegimentCreationElement<T> {
    options:Array<T>,
    selected:T
}