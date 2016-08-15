import {Characteristic} from "../types/character/Characteristic";
import {SkillDescription} from "../types/character/Skill";
import {Talent} from "../types/character/Talent";
import {Regiment} from "../types/character/Regiment";
import {Trait} from "../types/character/Trait";
import {Item} from "../types/character/items/Item";
import {SelectableModifier} from "../types/character/CharacterModifier";
import {PlaceholderReplacement} from "./PlaceholderReplacement";
import {SpecialAbility} from "../types/regiment/SpecialAbility";
import {Specialty, SpecialtyType} from "../types/character/Specialty";
/**
 * Created by Damien on 7/12/2016.
 */
export class SpecialtyService {
    private _specialties;
    private _angular;

    constructor($resource, $q, characteroptions, placeholders:PlaceholderReplacement) {
        this._specialties = $q.all({
            specialties: $resource("pluginresource/Character/Specialties.json").query().$promise,
            placeholders: placeholders
        }).then(function (result) {
            return result.specialties.map(specialty => {
                var characteristics = new Map<Characteristic, number>();
                for (var characteristicName in specialty['fixed modifiers'].characteristics) {
                    characteristics.set(Characteristic.characteristics.get(characteristicName), specialty['fixed modifiers'].characteristics[characteristicName]);
                }
                var aptitudes = specialty['fixed modifiers'].aptitudes;
                var characterSkills = new Map<SkillDescription, number>();
                var skillContainer = specialty['fixed modifiers'].skills;
                for (var skillName in skillContainer) {
                    characterSkills.set(result.placeholders.replace(skillName, "skill"), skillContainer[skillName]);
                }

                var characterTalents = new Array<Talent>();
                if (specialty['fixed modifiers'].talents) {
                    for (var talentDescription of specialty['fixed modifiers'].talents) {
                        var talentName = talentDescription.substring(0, talentDescription.indexOf("(") == -1 ? talentDescription.length : talentDescription.indexOf("(")).trim();
                        let specialization = talentDescription.substring(talentDescription.indexOf("(") + 1, talentDescription.indexOf((")")));
                        var talent:Talent = result.placeholders.replace(talentDescription, "talent");
                        characterTalents.push(new Talent(talent.name, talent.source, talent.tier, talent.aptitudes
                            , specialization, talent.prerequisites, talent.maxTimesPurchaseable));
                    }
                }

                var characterTraits = new Array<Trait>();
                if (specialty['fixed modifiers'].traits) {
                    for (var traitDescription of specialty['fixed modifiers'].traits) {
                        var traitName = traitDescription.substring(0, traitDescription.indexOf("(") == -1 ? traitDescription.length : traitDescription.indexOf("(")).trim();
                        var specialization = traitDescription.substring(traitDescription.indexOf("(") + 1, traitDescription.indexOf(")"));
                        var trait:Trait = result.placeholders.replace(traitDescription, "trait");
                        characterTraits.push(new Trait(trait.name, trait.description));
                    }
                }

                var kit:Map<Item, number> = new Map<Item, number>();
                if (specialty['fixed modifiers']['character kit']) {
                    for (var itemDescription of specialty['fixed modifiers']['character kit']) {
                        var item = result.placeholders.replace(itemDescription.item, "item");
                        kit.set(item, itemDescription.count);
                    }
                }
                var wounds:number = specialty['fixed modifiers'].wounds;
                var optionalModifiers = Array<SelectableModifier>();
                if (specialty['optional modifiers']) {
                    for (var optional of specialty['optional modifiers']) {
                        optionalModifiers.push(new SelectableModifier(optional.numSelectionsNeeded, optional.options.map(optionGroup=> {
                            optionGroup.description = optionGroup.map(o=>o.value).join(" or ");
                            return optionGroup.map(option=> {
                                switch (option.property) {
                                    case "skill":
                                        option.value.skill = result.placeholders.replace(option.value.skill, option.property);
                                        break;
                                    case "character kit":
                                        option.value.item = result.placeholders.replace(option.value.item, "item");
                                        break;
                                    default:
                                        option.value = result.placeholders.replace(option.value, option.property);
                                }
                                var options = [];
                                return option;
                            });

                        }), optional['selection time']));
                    }
                }

                var type:SpecialtyType;
                switch (specialty.type) {
                    case "guardsman":
                        type = SpecialtyType.Guardsman;
                        break;
                    case "specialist":
                        type = SpecialtyType.Specialist;
                        break;
                    default:
                        throw "Type must be 'guardsman' or 'specialist', was " + specialty.type;
                }
                return new Specialty(specialty.name, characteristics, type, characterSkills, characterTalents, specialty['fixed modifiers'].aptitudes,
                    characterTraits, kit, wounds, optionalModifiers);
            });
        });
    }

    get specialties() {
        return this._specialties;
    }
}