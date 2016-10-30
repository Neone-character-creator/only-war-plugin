import {Characteristic} from "../types/character/Characteristic";
import {Talent} from "../types/character/Talent";
import {Skill, SkillDescription} from "../types/character/Skill";
import {PsychicPower} from "../types/character/PsychicPower";
import {Armor} from "../types/character/items/Armor";
import {Weapon} from "../types/character/items/Weapon";
import {Item, ItemType} from "../types/character/items/Item";
import {Vehicle} from "../types/character/items/Vehicle";
import {Trait} from "../types/character/Trait";
import {OnlyWarCharacter} from "../types/character/Character";
import {Prerequisite} from "../types/Prerequisite";
import {SpecialtyType, Specialty} from "../types/character/Specialty";
import IPromise = angular.IPromise;
import {SelectableModifier} from "../types/character/CharacterModifier";
/**
 * Created by Damien on 7/12/2016.
 */
export class CharacterOptionsService {
    private _talents;
    private _skills;
    private _powers;
    private _fatePointRolls:any;
    private _weapons;
    private _armor;
    private _items;
    private _vehicles;
    private _traits;
    private _specialties;

    constructor(characterOptions, $log) {
        this._talents = characterOptions.talents.map(talent=> {
            if (!talent.prerequisites) {
                talent.prerequisites = [];
            }
            var predicates:Array<Function> = [];
            /*Each prerequisite object defined in the json is transformed into a predicate function.
             */
            talent.prerequisites.forEach((prerequisite)=> {
                /**
                 * Each sub entry may be an object or an array of matcher objects.
                 * If an array, the entire prerequisite matches if ANY of the subprerequisites within the array
                 * matches.
                 */
                if (!Array.isArray(prerequisite)) {
                    prerequisite = [prerequisite];
                }
                var subpredicates = [];
                prerequisite.forEach(subprerequisite=> {
                    switch (subprerequisite.property) {
                        case"characteristic":
                        {
                            subpredicates.push(
                                (character:OnlyWarCharacter)=> {
                                    return character.characteristics.get(Characteristic.characteristics.get(prerequisite.value.name)) >= prerequisite.value.rating;
                                });
                            break;
                        }
                        case "talent":
                        {
                            subpredicates.push(
                                (character:OnlyWarCharacter)=> {
                                    return character.talents.find(characterTalent=> {
                                        return characterTalent.name === talent.name && characterTalent.specialization === characterTalent.specialization;
                                    });
                                });
                            break;
                        }
                        case "skill":
                        {
                            subpredicates.push(
                                (character:OnlyWarCharacter)=> {
                                    return character.skills.find(skill=> {
                                        return skill.identifier.name === prerequisite.value.name && skill.rank === prerequisite.value.rating;
                                    })
                                });
                            break;
                        }
                        case "psy rating":
                        {
                            subpredicates.push((character:OnlyWarCharacter)=> {
                                return character.powers.psyRating === prerequisite.rating;
                            });
                        }
                        case "character kit":
                        {
                            subpredicates.push((character:OnlyWarCharacter)=> {
                                var matchFound = false;
                                for (let item of character.kit.keys()) {
                                    for (let property in prerequisite.value) {
                                        if (item[property] !== prerequisite.value[property]) {
                                            matchFound = false;
                                            break;
                                        }
                                        matchFound = true;
                                    }
                                    if (matchFound) {
                                        break;
                                    }
                                }
                                return matchFound;
                            });
                        }
                        case "trait":
                        {
                            subpredicates.push((character:OnlyWarCharacter)=> {
                                return character.traits.find((trait)=> {
                                    return trait.name == prerequisite.value.name;
                                });
                            });
                            break;
                        }
                        case "power":
                        {
                            subpredicates.push((character:OnlyWarCharacter)=> {
                                return character.powers.powers.find(power=> {
                                    return power.name === prerequisite.value;
                                });
                            });
                            break;
                        }
                        case "specialty type" :
                        {
                            subpredicates.push((character:OnlyWarCharacter)=> {
                                switch (subprerequisite.value) {
                                    case "Guardsman":
                                        return character.specialty.specialtyType === SpecialtyType.Guardsman;
                                    case "Specialist":
                                        return character.specialty.specialtyType === SpecialtyType.Specialist;
                                }
                            });
                            break;
                        }
                        default:
                        {
                            $log.error("Unknown property " + subprerequisite.property);
                        }
                    }
                    predicates.push((target:OnlyWarCharacter)=> {
                        var subpredicates = subpredicates;
                        return subpredicates.find((subpredicate)=> {
                            return subpredicate(target);
                        })
                    })
                });
            })
            return new Talent(talent.name, talent.source, talent.tier, talent.aptitudes, talent.specialization, new Prerequisite<OnlyWarCharacter>((target)=> {
                for (var predicate of predicates) {
                    if (!predicate(target)) {
                        return false;
                    }
                }
                return true;
            }));
        });
        this._skills = characterOptions.skills.map(skill=> {
            return new SkillDescription(skill.name, skill.aptitudes, skill.specialization);
        })
        this._powers = characterOptions.powers;
        this._weapons = characterOptions.weapons.map(weapon=> {
            return new Weapon(weapon.name, weapon.availability, weapon.class, weapon.type, weapon.range, weapon.rof,
                weapon.damage, weapon.pen, weapon.clip, weapon.reload, weapon['special qualities'], weapon.weight,
                weapon['main weapon']);
        });
        this._armor = characterOptions.armor.map(armor=> {
            return new Armor(armor.name, armor.availability, armor.locations, armor.ap, armor.type, armor.weight);
        });
        this._items = characterOptions.items.map(item=> {
            return new Item(item.name, ItemType.Other, item.availability, item.weight);
        });
        this._vehicles = characterOptions.vehicles;
        this._traits = characterOptions.traits;
        this._fatePointRolls = characterOptions.fatePointRolls;
    }


    get talents():Array < Talent > {
        return this._talents;
    }

    get skills():Array < SkillDescription > {
        return this._skills;
    }

    get powers():Array < PsychicPower > {
        return this._powers;
    }

    get fatePointRolls():any {
        return this._fatePointRolls;
    }

    get weapons():Array < Weapon > {
        return this._weapons;
    }

    get armor():Array < Armor > {
        return this._armor;
    }

    get items():Array < Item > {
        return this._items;
    }

    get vehicles():Array < Vehicle > {
        return this._vehicles;
    }

    get traits():Array < Trait > {
        return this._traits;
    }

    get specialties():Array<Specialty>{
        return this._specialties;
    }
}