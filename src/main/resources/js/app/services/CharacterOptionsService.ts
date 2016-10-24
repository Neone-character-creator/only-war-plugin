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
import {SpecialtyType} from "../types/character/Specialty";
import IPromise = angular.IPromise;
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

    constructor($resource, $q, $log) {
        var self = this;
        var talents = $q.defer();
        this._talents = talents.promise;
        var skills = $q.defer();
        this._skills = skills.promise;
        var powers = $q.defer();
        this._powers = powers.promise;
        var fatePointRolls = $q.defer();
        this._fatePointRolls = fatePointRolls.promise;
        var weapons = $q.defer();
        this._weapons = weapons.promise;
        var armor = $q.defer();
        this._armor = armor.promise;
        var items = $q.defer();
        this._items = items.promise;
        var vehicles = $q.defer();
        this._vehicles = vehicles.promise;
        var traits = $q.defer();
        this._traits = traits.promise;
        $resource("Character/Character.json").get().$promise.then(character => {
            talents.resolve(character.Talents.map(talent=> {
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
            }));
            skills.resolve(character.Skills.map(skill=> {
                    return new SkillDescription(skill.name, skill.aptitudes, skill.specialization);
                })
            );
            powers.resolve(character.Powers);
            weapons.resolve(character.Weapons.map(weapon=> {
                return new Weapon(weapon.name, weapon.availability, weapon.class, weapon.type, weapon.range, weapon.rof,
                    weapon.damage, weapon.pen, weapon.clip, weapon.reload, weapon['special qualities'], weapon.weight,
                    weapon['main weapon']);
            }));
            armor.resolve(character.Armor.map(armor=> {
                return new Armor(armor.name, armor.availability, armor.locations, armor.ap, armor.type, armor.weight);
            }));
            items.resolve(character.Items.map(item=> {
                return new Item(item.name, ItemType.Other, item.availability, item.weight);
            }));
            vehicles.resolve(character.Vehicles);
            traits.resolve(character.Traits);
            fatePointRolls.resolve(character.fatepoints);
        });
    }


    get talents():IPromise<Array<Talent>> {
        return this._talents;
    }

    get skills():IPromise<Array<SkillDescription>> {
        return this._skills;
    }

    get powers():IPromise<Array <PsychicPower>> {
        return this._powers;
    }

    get fatePointRolls():IPromise<any> {
        return this._fatePointRolls;
    }

    get weapons():IPromise<Array<Weapon>> {
        return this._weapons;
    }

    get armor():IPromise<Array < Armor >> {
        return this._armor;
    }

    get items():IPromise<Array < Item >> {
        return this._items;
    }

    get vehicles():IPromise<Array < Vehicle >> {
        return this._vehicles;
    }

    get traits():IPromise<Array < Trait >> {
        return this._traits;
    }
}