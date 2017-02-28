import {Characteristic} from "../types/character/Characteristic";
import {SkillDescription} from "../types/character/Skill";
import {Talent} from "../types/character/Talent";
import {Regiment, RegimentBuilder} from "../types/character/Regiment";
import {Trait} from "../types/character/Trait";
import {Item} from "../types/character/items/Item";
import {SelectableModifier} from "../types/character/CharacterModifier";
import {PlaceholderReplacement, ItemPlaceholder} from "./PlaceholderReplacement";
import {Weapon} from "../types/character/items/Weapon";
import IPromise = angular.IPromise;
/**
 * Created by Damien on 7/12/2016.
 */
export class RegimentService {
    private _regiments;
    private _angular;

    constructor(regiments, placeholders:IPromise<PlaceholderReplacement>) {
        this._regiments = placeholders.then(placeholders=> {
            return regiments.map((regiment) => {
                var characteristics = new Map<Characteristic, number>();
                for (var characteristicName in regiment['fixed modifiers'].characteristics) {
                    characteristics.set(Characteristic.characteristics.get(characteristicName), regiment['fixed modifiers'].characteristics[characteristicName]);
                }
                var aptitudes = regiment['fixed modifiers'].aptitudes;
                var characterSkills = new Map<SkillDescription, number>();
                var skillContainer = regiment['fixed modifiers'].skills;
                for (var skillPlaceholder of skillContainer) {
                    characterSkills.set(placeholders.replace(skillPlaceholder, "skill"), skillPlaceholder.rating);
                }

                var characterTalents = new Array<Talent>();
                if (regiment['fixed modifiers'].talents) {
                    for (var talentPlaceholder of regiment['fixed modifiers'].talents) {
                        var talent:Talent = placeholders.replace(talentPlaceholder, "talent");
                        characterTalents.push(talent);
                    }
                }

                var characterTraits = new Array<Trait>();
                if (regiment['fixed modifiers'].traits) {
                    for (var traitPlaceholder of regiment['fixed modifiers'].traits) {
                        var trait:Trait = placeholders.replace(traitPlaceholder, "trait");
                        characterTraits.push(trait);
                    }
                }

                var kit:Map<Item, number> = new Map<Item, number>();
                if (regiment['fixed modifiers']['character kit']) {
                    for (var itemDescription of regiment['fixed modifiers']['character kit']) {
                        var item = placeholders.replace(itemDescription.item, "item");
                        kit.set(item, itemDescription.count);
                    }
                }
                var wounds:number = regiment['fixed modifiers'].wounds;

                var favoredWeapons:Map<string, Array<Weapon>> = new Map();
                regiment['fixed modifiers']['favored weapons'].forEach(e=> {
                    favoredWeapons.set(e.type, [placeholders.replace(e.item, "item")]);
                });
                var optionalModifiers = Array<SelectableModifier>();
                if (regiment['optional modifiers']) {
                    for (var optional of regiment['optional modifiers']) {
                        optionalModifiers.push(new SelectableModifier(optional.numSelectionsNeeded, optional.options.map(optionGroup=> {
                            optionGroup.description = optionGroup.map(o=> {
                                    switch (o.property) {
                                        case "talent":
                                            return o.value.name + (o.value.specialization ? " (" + o.value.specialization + ")" : "");
                                        case "skill":
                                            let rating = "+" + (o.value.rating - 1) * 10;
                                            return o.value.name + (o.value.specialization ? " (" + o.value.specialization + ")" : "") + rating;
                                        case "item":
                                            return o.value.item.name + " x " + o.value.count;
                                    }
                                }
                            ).join(" or ");
                            return optionGroup.map((option)=> {
                                switch (option.property) {
                                    case "item":
                                        //Wrap in a function to allow for type guard.
                                        option.value = function (value):value is ItemPlaceholder {
                                            return <any>{
                                                item: placeholders.replace(value.item, option.property),
                                                count: value.count
                                            };
                                        }(option.value);
                                        break;
                                    case "skill":
                                        option.value = function (value) {
                                            return {
                                                skill: placeholders.replace(value, option.property),
                                                rank: value.rank
                                            };
                                        }(option.value);
                                        break;
                                    case "talent":
                                        option.value = function (value) {
                                            return placeholders.replace(value, option.property);
                                        }(option.value);
                                        break;
                                    case "characteristic":
                                        break;
                                    default:
                                        throw "Handling placeholders of type " + option.property + " not supported.";
                                }
                                return option;
                            });

                        }), optional['selection time']));
                    }
                }
                return new RegimentBuilder().setName(regiment.name).setCharacteristics(characteristics).setSkills(characterSkills)
                    .setTalents(characterTalents).setAptitudes(regiment['fixed modifiers'].aptitudes || []).setTraits(characterTraits)
                    .setKit(kit).setWounds(wounds).setOptionalModifiers(optionalModifiers).setFavoredWeapons(favoredWeapons).build();
            });
        })
    }

    get regiments() {
        return this._regiments;
    }
}