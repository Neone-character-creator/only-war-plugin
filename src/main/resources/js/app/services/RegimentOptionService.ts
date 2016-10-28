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
import IPromise = angular.IPromise;
/**
 * Created by Damien on 7/31/2016.
 */
export class RegimentOptionService {
    private _homeworlds:Array<Homeworld>;
    private _commandingOfficers:Array<CommandingOfficer>;
    private _regimentTypes:Array<RegimentType>;
    private _equipmentDoctrines:Array<SpecialEquipmentorTrainingDoctrine>;
    private _trainingDoctrines:Array<SpecialEquipmentorTrainingDoctrine>;
    private _standardRegimentalKit:StandardRegimentKit;
    private _additionalKitChoices;

    constructor(regimentOptions, placeholders:PlaceholderReplacement) {
        var transformPlaceholders = (modifier) => {
            if (modifier['fixed modifiers']) {
                var characteristics = new Map <Characteristic, number>();
                for (var characteristicName in modifier['fixed modifiers'].characteristics) {
                    characteristics.set(Characteristic.characteristics.get(characteristicName), modifier['fixed modifiers'].characteristics[characteristicName]);
                }
                modifier.characteristics = characteristics;
                var characterSkills = new Map <SkillDescription, number>();
                if (modifier['fixed modifiers'].skills) {
                    var skillContainer = modifier['fixed modifiers'].skills;
                    for (var skillPlaceholder of modifier['fixed modifiers'].skills) {
                        let skill:SkillDescription = placeholders.replace(skillPlaceholder, "skill");
                        characterSkills.set(skill, skillPlaceholder.rating);
                    }
                }
                modifier.skills = characterSkills;

                var characterTalents = new Array < Talent >();
                if (modifier['fixed modifiers'].talents) {
                    for (let talentDescription of modifier['fixed modifiers'].talents) {
                        var talent = placeholders.replace(talentDescription, "talent");
                        characterTalents.push(new Talent(talent.name, talent.source, talent.tier, talent.aptitudes
                            , specialization, talent.prerequisites, talent.maxTimesPurchaseable));
                    }
                    ;
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
        };
        var error = message => console.log(message);
        this._homeworlds = regimentOptions.homeworlds.map(transformPlaceholders);
        this._commandingOfficers = regimentOptions.commandingOfficers.map(transformPlaceholders);
        this._regimentTypes = regimentOptions.regimentTypes.map(transformPlaceholders);
        this._equipmentDoctrines = regimentOptions.equipmentDoctrines.map(transformPlaceholders);
        this._trainingDoctrines = regimentOptions.trainingDoctrines.map(transformPlaceholders);
        this._standardRegimentalKit = transformPlaceholders(regimentOptions.standardRegimentalKit);
        this._additionalKitChoices = regimentOptions.additionalKitChoices.map((choice):KitModifier => {
            switch (choice.effect.type) {
                case "Upgrade":
                    return new UpgradeItemKitModifier(choice.description, choice.cost, choice.effect.target, choice.effect.results);
                case "Replace":
                    var replacementItems:Map<Item, number> = new Map();
                    for (let entry of choice.effect.results) {
                        replacementItems.set(placeholders.replace(entry.item, "item"), entry.count
                        );
                    }

                    return new ReplaceItemKitModifier(choice.description, choice.cost, choice.effect.target, replacementItems);
                case "Add":
                    var itemsToAdd:Map<Item, number> = new Map();
                    for (let entry of choice.effect.results) {
                        itemsToAdd.set(placeholders.replace(entry.item, "item"), entry.count
                        );
                    }

                    return new AddSpecificItemKitModifier(choice.description, choice.cost, itemsToAdd);
                case "AddAvailability":
                    return new AddItemMatchingPropertiesKitModifier(choice.description, choice.cost, choice.effect.target);
                case "AddFavored":
                    return new AddFavoredItemKitModifier(choice.description, choice.cost, choice.effect.target);
            }
        })

    }

    get homeworlds():Array < Homeworld > {
        return this._homeworlds;
    }

    get commandingOfficers():Array < CommandingOfficer > {
        return this._commandingOfficers;
    }

    get regimentTypes():Array < RegimentType > {
        return this._regimentTypes;
    }

    get equipmentDoctrines():Array < SpecialEquipmentorTrainingDoctrine > {
        return this._equipmentDoctrines;
    }

    get trainingDoctrines():Array < SpecialEquipmentorTrainingDoctrine > {
        return this._trainingDoctrines;
    }

    get standardRegimentalKit():StandardRegimentKit {
        return this._standardRegimentalKit;
    }

    get additionalKitChoices() {
        return this._additionalKitChoices;
    }
}