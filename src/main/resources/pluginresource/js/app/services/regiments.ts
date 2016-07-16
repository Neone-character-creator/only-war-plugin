///<reference path="../../../../../../../typings/globals/angular/index.d.ts" />
///<reference path="../../../../../../../typings/globals/angular-resource/index.d.ts" />
import {Characteristic} from "../types/character/Characteristic";
import {Skill} from "../types/character/Skill";
import {Talent} from "../types/character/Talent";
import {Regiment} from "../types/character/Regiment";
import {Trait} from "../types/character/Trait";
import {Item, Craftsmanship} from "../types/character/items/Item";
import {SelectableModifier} from "../types/character/CharacterModifier";
import {PlaceholderReplacement} from "./PlaceholderReplacement";
/**
 * Created by Damien on 7/12/2016.
 */
export class RegimentService {
    private _regiments;
    private _angular;

    constructor($resource, $q, placeholders:PlaceholderReplacement) {
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
                var characterSkills = new Array<Skill>();
                for (var skillName in regiment['fixed modifiers'].skills) {
                    var skill:Skill = result.placeholders.replace(skillName, "skill");
                    characterSkills.push(skill);
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
                var optionalModifiers = Array<SelectableModifier>();
                return new Regiment(regiment.name, characteristics, characterSkills, characterTalents, regiment['fixed modifiers'].aptitudes,
                    characterTraits, kit, wounds, optionalModifiers);
            })
        });
    }

    get regiments() {
        return this._regiments;
    }
}