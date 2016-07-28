import {Characteristic} from "../types/character/Characteristic";
import {SkillDescription} from "../types/character/Skill";
import {Talent} from "../types/character/Talent";
import {Regiment} from "../types/character/Regiment";
import {Trait} from "../types/character/Trait";
import {Item} from "../types/character/items/Item";
import {SelectableModifier} from "../types/character/CharacterModifier";
import {PlaceholderReplacement} from "./PlaceholderReplacement";
/**
 * Created by Damien on 7/12/2016.
 */
export class RegimentService {
    private _regiments;
    private _angular;

    constructor($resource, $q, characteroptions, placeholders:PlaceholderReplacement) {
        this._regiments = $q.all({
            regiments: $resource("pluginresource/Regiment/Regiments.json").query().$promise,
            placeholders: placeholders
        }).then(function (result) {
            return result.regiments.map(regiment => {
                var characteristics = new Map<Characteristic, number>();
                for (var characteristicName in regiment['fixed modifiers'].characteristics) {
                    characteristics.set(Characteristic.characteristics.get(characteristicName), regiment['fixed modifiers'].characteristics[characteristicName]);
                }
                var aptitudes = regiment['fixed modifiers'].aptitudes;
                var characterSkills = new Map<SkillDescription, number>();
                var skillContainer = regiment['fixed modifiers'].skills;
                for (var skillName in skillContainer) {
                    characterSkills.set(result.placeholders.replace(skillName, "skill"), skillContainer[skillName]);
                }

                var characterTalents = new Array<Talent>();
                for (var talentDescription of regiment['fixed modifiers'].talents) {
                    var talentName = talentDescription.substring(0, talentDescription.indexOf("(") == -1 ? talentDescription.length : talentDescription.indexOf("(")).trim();
                    let specialization = talentDescription.substring(talentDescription.indexOf("(") + 1, talentDescription.indexOf((")")));
                    var talent:Talent = result.placeholders.replace(talentDescription, "talent");
                    characterTalents.push(new Talent(talent.name, talent.source, talent.tier, talent.aptitudes
                        , specialization, talent.prerequisites, talent.maxTimesPurchaseable));
                }

                var characterTraits = new Array<Trait>();
                if (regiment['fixed modifiers'].traits) {
                    for (var traitDescription of regiment['fixed modifiers'].traits) {
                        var traitName = traitDescription.substring(0, traitDescription.indexOf("(") == -1 ? traitDescription.length : traitDescription.indexOf("(")).trim();
                        var specialization = traitDescription.substring(traitDescription.indexOf("(") + 1, traitDescription.indexOf(")"));
                        var trait:Trait = result.placeholders.replace(traitDescription, "trait");
                        characterTraits.push(new Trait(trait.name, trait.description));
                    }
                }

                var kit:Map<Item, number> = new Map<Item, number>();
                for (var itemDescription of regiment['fixed modifiers']['character kit']) {
                    var item = result.placeholders.replace(itemDescription, "item");
                    kit.set(item, itemDescription.count);
                }
                var wounds:number = regiment['fixed modifiers'].wounds;
                var favoredWeapons = [];
                for (var favoredWeapon of regiment['fixed modifiers']['favored weapons']) {
                    favoredWeapons.push(result.placeholders.replace({item: {name: favoredWeapon}}, "item"));
                }
                var specialAbilities = []
                var optionalModifiers = Array<SelectableModifier>();
                if (regiment['optional modifiers']) {
                    for (var optional of regiment['optional modifiers']) {
                        optionalModifiers.push(new SelectableModifier(optional.selections, optional.options.map(optionGroup=> {
                            optionGroup.description = optionGroup.map(o=>o.value).join(" or ");
                            return optionGroup.map(option=> {
                                option.value = result.placeholders.replace(option.value, option.property);
                                var options = [];
                                return option;
                            });

                        })));
                    }
                }
                return new Regiment(regiment.name, characteristics, characterSkills, characterTalents, regiment['fixed modifiers'].aptitudes,
                    characterTraits, kit, wounds, optionalModifiers, favoredWeapons, specialAbilities);
            });
        });
    }

    get regiments() {
        return this._regiments;
    }
}