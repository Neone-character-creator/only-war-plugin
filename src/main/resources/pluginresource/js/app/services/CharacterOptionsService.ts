import {Characteristic} from "../types/character/Characteristic";
import {Talent} from "../types/character/Talent";
import {Skill} from "../types/character/Skill";
import {PsychicPower} from "../types/character/PsychicPower";
import {Armor} from "../types/character/items/Armor";
import {Weapon} from "../types/character/items/Weapon";
import {Item} from "../types/character/items/Item";
import {Vehicle} from "../types/character/items/Vehicle";
import {Trait} from "../types/character/Trait";
import {OnlyWarCharacter} from "../types/character/Character";
import {Prerequisites} from "../types/Prerequisite";
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

    constructor($resource, $q) {
        this._talents = $resource("pluginresource/Character/Talents.json").query().$promise.then(talents => {
            return talents.map(talent=> {
                var predicates = [];
                for (var i = 0; i < this._talents.length; i++) {
                    var predicate;
                    switch (this._talents.prerequisites[i].property) {
                        case "characteristic":
                            predicate = function (character:OnlyWarCharacter) {
                                return character.characteristics.get(Characteristic.characteristics.get(this._talents.prerequisites[i].value.name)) <= this._talents.prerequisites[i].value.rating;
                            }
                            break;
                        case "talent":
                            predicate = function (character:OnlyWarCharacter) {
                                return character.talents.find(talent=> {
                                    return talent.name === this._skills.prere
                                })
                            }
                    }
                }
                return new Talent(talent.name, talent.source, talent.tier, talent.aptitudes, talent.specialization, new Prerequisites(predicates));
            });
        });
        this._skills = $resource("pluginresource/Character/Skills.json").query().$promise;
        this._powers = $resource("pluginresource/Character/Powers.json").query().$promise;
        this._weapons = $resource("pluginresource/Character/Weapons.json").query().$promise;
        this._armor = $resource("pluginresource/Character/Armor.json").query().$promise;
        this._items = $resource("pluginresource/Character/Items.json").query().$promise;
        this._vehicles = $resource("pluginresource/Character/Vehicles.json").query().$promise;
        this._traits = $resource("pluginresource/Character/Traits.json").query().$promise;
    }


    get talents() {
        return this._talents;
    }

    get skills():Array < Skill > {
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
}