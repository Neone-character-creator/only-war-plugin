import {
    Homeworld, CommandingOfficer,
    SpecialEquipmentorTrainingDoctrine, StandardRegimentKit, RegimentType
} from "../types/regiment/creation/RegimentCreationModifier";
import {Characteristic} from "../types/character/Characteristic";
import {SkillDescription, Skill} from "../types/character/Skill";
import {PlaceholderReplacement} from "./PlaceholderReplacement";
import {SelectableModifier} from "../types/character/CharacterModifier";
import {SpecialAbility} from "../types/regiment/SpecialAbility";
import {Item} from "../types/character/items/Item";
import {Trait} from "../types/character/Trait";
import {Talent} from "../types/character/Talent";
import * as $ from "jquery";
import {
    UpgradeItemKitModifier, ReplaceItemKitModifier,
    AddSpecificItemKitModifier, AddItemMatchingPropertiesKitModifier, AddFavoredItemKitModifier, KitModifier
} from "../types/regiment/creation/KitModifier";
/**
 * Created by Damien on 7/31/2016.
 */
export class RegimentOptionService {
    private _homeworlds:Promise<Array<Homeworld>>;
    private _commandingOfficers:Promise<Array<CommandingOfficer>>;
    private _regimentTypes:Promise<Array<RegimentType>>;
    private _equipmentDoctrines:Promise<Array<SpecialEquipmentorTrainingDoctrine>>;
    private _trainingDoctrines:Promise<Array<SpecialEquipmentorTrainingDoctrine>>;
    private _standardRegimentalKit:Promise<StandardRegimentKit>;
    private _additionalKitChoices;

    constructor($resource, $q, placeholders:Promise<PlaceholderReplacement>) {
        var transformPlaceholders = placeholders.then((placeholders)=> {
            return function (modifier) {
                if (modifier['fixed modifiers']) {
                    var characteristics = new Map <Characteristic, number>();
                    for (var characteristicName in modifier['fixed modifiers'].characteristics) {
                        characteristics.set(Characteristic.characteristics.get(characteristicName), modifier['fixed modifiers'].characteristics[characteristicName]);
                    }
                    modifier.characteristics = characteristics;
                    var characterSkills = new Map <SkillDescription, number>();
                    var skillContainer = modifier['fixed modifiers'].skills;
                    for (var skillName in modifier['fixed modifiers'].skills) {
                        let skill:SkillDescription = placeholders.replace(skillName, "skill");
                        characterSkills.set(skill, skillContainer[skillName]);
                    }
                    modifier.skills = characterSkills;

                    var characterTalents = new Array < Talent >();
                    if (modifier['fixed modifiers'].talents) {
                        $.each(modifier['fixed modifiers'].talents, function (i, talentDescription) {
                            var talentName = talentDescription.substring(0, talentDescription.indexOf("(") == -1 ? talentDescription.length : talentDescription.indexOf("(")).trim();
                            var specialization = talentDescription.substring(talentDescription.indexOf("(") + 1, talentDescription.indexOf((")")));
                            var talent = placeholders.replace(talentDescription, "talent");
                            characterTalents.push(new Talent(talent.name, talent.source, talent.tier, talent.aptitudes
                                , specialization, talent.prerequisites, talent.maxTimesPurchaseable));
                        });
                    }
                    modifier.talents = characterTalents;

                    var characterTraits = new Array < Trait >();
                    if (modifier['fixed modifiers'].traits) {
                        for (var traitDescription of modifier['fixed modifiers'].traits) {
                            var traitName = traitDescription.substring(0, traitDescription.indexOf("(") == -1 ? traitDescription.length : traitDescription.indexOf("(")).trim();
                            var specialization = traitDescription.substring(traitDescription.indexOf("(") + 1, traitDescription.indexOf(")"));
                            var trait:Trait = placeholders.replace(traitDescription, "trait");
                            characterTraits.push(new Trait(trait.name, trait.description));
                        }
                    }
                    modifier.traits = characterTraits;
                    var characterKit = new Map();
                    if (modifier['fixed modifiers']['character kit']) {
                        for (var itemDescription of modifier['fixed modifiers']['character kit']) {
                            var item = placeholders.replace(itemDescription.item, "item");
                            characterKit.set(item, itemDescription.count);
                        }
                    }
                    modifier.kit = characterKit;
                    var specialAbilities = []
                    $.each(modifier['fixed modifiers']['special abilities'], function (i, ability) {
                        specialAbilities.push(new SpecialAbility(ability.name, ability.description));
                    });
                    modifier.specialAbilities = specialAbilities;
                    if (modifier['fixed modifiers'].aptitudes) {
                        modifier.aptitudes = modifier['fixed modifiers'].aptitudes;
                    }
                }
                if (modifier['optional modifiers']) {
                    var optionalModifiers = [];
                    for (var optional of modifier['optional modifiers']) {
                        optionalModifiers.push(new SelectableModifier(optional.numSelectionsNeeded, optional.options.map((optionGroup)=> {
                            return optionGroup.map(option => {
                                switch (option.property) {
                                    case "character kit":
                                        option.value.item = placeholders.replace(option.value.item, "item");
                                        break;
                                    default:
                                        option.value = placeholders.replace(option.value, option.property);
                                }
                                var options = [];
                                return option;
                            })
                        }), optional['selection time']))

                    }
                    modifier.optionalModifiers = optionalModifiers;
                }
                return modifier;
            }
        });
        var error = message => {
            console.log(message);
        }
        this._homeworlds = $q.all({
            resource: $resource("pluginresource/Regiment/Creation/Homeworlds.json").query().$promise,
            placeholders: transformPlaceholders
        }).then(results=> {
            return results.resource.map(results.placeholders);
        }, error);
        this._commandingOfficers = $q.all({
            resource: $resource("pluginresource/Regiment/Creation/CommandingOfficers.json").query().$promise,
            placeholders: transformPlaceholders
        }).then(results=> {
            return results.resource.map(results.placeholders);
        }, error);
        this._regimentTypes = $q.all({
            resource: $resource("pluginresource/Regiment/Creation/RegimentType.json").query().$promise,
            placeholders: transformPlaceholders
        }).then(results=> {
            return results.resource.map(results.placeholders)
        }, error);
        this._equipmentDoctrines = $q.all({
            resource: $resource("pluginresource/Regiment/Creation/Special Equipment.json").query().$promise,
            placeholders: transformPlaceholders
        }).then(results=> {
            return results.resource.map(results.placeholders);
        }, error);
        this._trainingDoctrines = $q.all({
            resource: $resource("pluginresource/Regiment/Creation/TrainingDoctrines.json").query().$promise,
            placeholders: transformPlaceholders
        }).then(results=> {
            return results.resource.map(results.placeholders)
        }, error);
        this._standardRegimentalKit = $q.all({
            resource: $resource("pluginresource/Regiment/Creation/StandardRegimentalKit.json").get().$promise,
            placeholders: transformPlaceholders
        }).then(results=> {
            results.resource.cost = 0;
            return results.placeholders(results.resource);
        }, error);
        this._additionalKitChoices = $q.all({
            resource: $resource("pluginresource/Regiment/Creation/AdditionalKitChoices.json").query().$promise,
            placeholders: placeholders
        }).then(results=> {
            return results.resource.map((choice):KitModifier=> {
                switch (choice.effect.type) {
                    case "Upgrade":
                        return new UpgradeItemKitModifier(choice.description, choice.cost, choice.effect.target, choice.effect.results);
                    case "Replace":
                        var replacementItems:Map<Item, number> = new Map();
                        choice.effect.results.forEach((entry)=> {
                            replacementItems.set(results.placeholders.replace(entry.item, "item"), entry.count);
                        })
                        return new ReplaceItemKitModifier(choice.description, choice.cost, choice.effect.target, replacementItems);
                    case "Add":
                        var itemsToAdd:Map<Item, number> = new Map();
                        choice.effect.results.forEach(entry=> {
                            itemsToAdd.set(results.placeholders.replace(entry.item, "item"), entry.count);
                        });
                        return new AddSpecificItemKitModifier(choice.description, choice.cost, itemsToAdd);
                    case "AddAvailability":
                        return new AddItemMatchingPropertiesKitModifier(choice.description, choice.cost, choice.effect.target);
                    case "AddFavored":
                        return new AddFavoredItemKitModifier(choice.description, choice.cost, choice.effect.target);
                }
            });
        }, error);
    }


    get homeworlds():Promise < Array < Homeworld >> {
        return this._homeworlds;
    }

    get commandingOfficers():Promise < Array < CommandingOfficer >> {
        return this._commandingOfficers;
    }

    get regimentTypes():Promise < Array < RegimentType >> {
        return this._regimentTypes;
    }

    get equipmentDoctrines():Promise < Array < SpecialEquipmentorTrainingDoctrine >> {
        return this._equipmentDoctrines;
    }

    get trainingDoctrines():Promise < Array < SpecialEquipmentorTrainingDoctrine >> {
        return this._trainingDoctrines;
    }

    get standardRegimentalKit():Promise < StandardRegimentKit > {
        return this._standardRegimentalKit;
    }

    get additionalKitChoices() {
        return this._additionalKitChoices;
    }
}