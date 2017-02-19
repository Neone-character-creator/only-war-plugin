import {Characteristic} from "../types/character/Characteristic";
import {SkillDescription} from "../types/character/Skill";
import {Talent} from "../types/character/Talent";
import {Regiment, RegimentBuilder} from "../types/character/Regiment";
import {Trait} from "../types/character/Trait";
import {Item} from "../types/character/items/Item";
import {SelectableModifier} from "../types/character/CharacterModifier";
import {PlaceholderReplacement} from "./PlaceholderReplacement";
import {Weapon} from "../types/character/items/Weapon";
import IPromise = angular.IPromise;
/**
 * Created by Damien on 7/12/2016.
 */
export class RegimentService {
    private _regiments;
    private _angular;

    constructor(regiments, placeholders:IPromise<PlaceholderReplacement>) {
        placeholders.then(placeholders=> {
            this._regiments = regiments.map((regiment) => {
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
                            optionGroup.description = optionGroup.map(o=>o.value).join(" or ");
                            return optionGroup.map((option)=> {
                                option.value = placeholders.replace(option.value, option.property);
                                return option;
                            });

                        }), optional['selection time']));
                    }
                }
                return new RegimentBuilder().setName(regiment.name).setCharacteristics(characteristics).setSkills(characterSkills)
                    .setTalents(characterTalents).setAptitudes(regiment['fixed modifiers'].aptitudes).setTraits(characterTraits)
                    .setKit(kit).setWounds(wounds).setOptionalModifiers(optionalModifiers).setFavoredWeapons(favoredWeapons).build();
            });
        })
    }

    get regiments() {
        return this._regiments;
    }
}