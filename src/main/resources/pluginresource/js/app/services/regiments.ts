///<reference path="../../../../../../../typings/globals/angular/index.d.ts" />
///<reference path="../../../../../../../typings/globals/angular-resource/index.d.ts" />
import {Characteristic} from "../types/character/Characteristic";
import {Skill} from "../types/character/Skill";
import {Talent} from "../types/character/Talent";
import {Regiment} from "../types/character/Regiment";
import {Trait} from "../types/character/Trait";
import {Item, Craftsmanship} from "../types/character/items/Item";
import {SelectableModifier} from "../types/character/CharacterModifier";
/**
 * Created by Damien on 7/12/2016.
 */
export class RegimentService {
    private _regiments;
    private _angular;

    constructor($resource, $q, characteroptions) {
        this._regiments = $resource("pluginresource/Regiment/Regiments.json").query().$promise.then(function (result) {
            return $q.all({
                skills: characteroptions.skills,
                talents: characteroptions.talents,
                items: characteroptions.items,
                weapons: characteroptions.weapons,
                armor: characteroptions.armor,
                vehicles: characteroptions.vehicles
            }).then(characteroptions=> {
                return result.map(regiment => {
                    var characteristics = new Map<Characteristic, number>();
                    for (var characteristicName in regiment['fixed modifiers'].characteristics) {
                        characteristics.set(Characteristic.characteristics.get(characteristicName), regiment['fixed modifiers'].characteristics[characteristicName]);
                    }
                    var aptitudes = regiment['fixed modifiers'].aptitudes;
                    var characterSkills = new Array<Skill>();
                    for (var skillName in regiment['fixed modifiers'].skills) {
                        var name = skillName.substring(0, skillName.indexOf("(") == -1 ? skillName.length : skillName.indexOf("(")).trim();
                        let specialization = skillName.substring(skillName.indexOf("(") + 1, skillName.indexOf(")"));
                        var skill:Skill = characteroptions.skills.find(skill=> {
                            return skill.name === name;
                        });
                        if (!skill) {
                            throw "Tried to find a skill named " + skillName + ".";
                        }
                        skill = angular.copy(skill);
                        if (specialization) {
                            skill.specialization = specialization;
                        }
                        characterSkills.push(skill);
                    }

                    var characterTalents = new Array<Talent>();
                    for (var talentDescription of regiment['fixed modifiers'].talents) {
                        var talentName = talentDescription.substring(0, talentDescription.indexOf("(") == -1 ? talentDescription.length : talentDescription.indexOf("(")).trim();
                        let specialization = talentDescription.substring(talentDescription.indexOf("(") + 1, talentDescription.indexOf((")")));
                        var talent:Talent = characteroptions.talents.find(talent=> {
                            return talent.name == talentName;
                        });
                        if (!talent) {
                            throw "Tried to find talent " + talentDescription;
                        }
                        talent = angular.copy(talent);
                        characterTalents.push(new Talent(talent.name, talent.source, talent.tier, talent.aptitudes
                            , specialization, talent.prerequisites, talent.maxTimesPurchaseable));
                    }

                    var characterTraits = new Array<Trait>();
                    if (regiment['fixed modifiers'].traits) {
                        for (var traitDescription of regiment['fixed modifiers'].traits) {
                            var traitName = traitDescription.substring(0, traitDescription.indexOf("(") == -1 ? traitDescription.length : traitDescription.indexOf("(")).trim();
                            var specialization = traitDescription.substring(traitDescription.indexOf("(") + 1, traitDescription.indexOf(")"));
                            var trait = characteroptions.traits.find(trait=> {
                                return trait.name = traitName;
                            });
                            if (!trait) {
                                throw "Tried to find trait " + traitDescription;
                            }
                            trait = angular.copy(trait);
                            if (specialization) {
                                trait.specialization = specialization;
                            }
                            characterTraits.push(trait);
                        }
                    }

                    var kit = new Map<Item, number>();
                    for (var itemDescription of regiment['fixed modifiers']['character kit']) {
                        var itemName:string = itemDescription.item.name;
                        var craftsmanship:string = itemDescription.item.craftsmanship;
                        var item:Item = characteroptions.armor.concat(characteroptions.weapons)
                            .concat(characteroptions.items).concat(characteroptions.vehicles).find(item=> {
                                return item.name == itemName;
                            });
                        item = angular.copy(item);
                        kit.set(item, itemDescription.count);
                    }

                    var wounds:number = regiment['fixed modifiers'].wounds;
                    var optionalModifiers = Array<SelectableModifier>();
                    return new Regiment(regiment.name, characteristics, characterSkills, characterTalents, regiment['fixed modifiers'].aptitudes,
                        characterTraits, kit, wounds, optionalModifiers);
                })
            });
        });
    }

    get regiments() {
        return this._regiments;
    }
}