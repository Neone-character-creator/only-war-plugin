import {Serializer} from "./Serializer";
import {Regiment, RegimentBuilder} from "../character/Regiment";
import {PlaceholderReplacement} from "../../services/PlaceholderReplacement";
import {SpecialAbility} from "../regiment/SpecialAbility";
import {Characteristic, CharacteristicValue} from "../character/Characteristic";
import {SkillDescription} from "../character/Skill";
import {SelectableModifier} from "../character/CharacterModifier";

export class RegimentSerializer implements Serializer<Promise<Regiment>> {
    private _placeholders:Promise<PlaceholderReplacement>;

    constructor(placeholders:Promise<PlaceholderReplacement>) {
        this._placeholders = placeholders;
    }

    serialize(key:string, value:any):any {
        switch (key) {
            case "_characteristics":
            {
                let characteristics = {};
                for (let entry of value.entries()) {
                    characteristics[entry[0].name] = entry[1];
                }
                return characteristics;
            }
            case "_skills":
            {
                return Array.from(value.entries()).map(e=> {
                    return {
                        name: e[0].name,
                        specialization: e[0].specialization,
                        rating: e[1]
                    }
                });
            }
            case "_talents":
            {
                return value.map(e=> {
                    return {
                        name: e.name,
                        specialization: e.specialization
                    }
                })
            }
            case "_traits" :
            {
                return value.map(e=> {
                    return {
                        name: e.name,
                        rating: e.rating
                    }
                })
            }
            case "_favoredWeapons":
            {
                return {
                    basic: value.get("basic").map(e=> {
                        return {
                            name: e.name,
                            upgrades: e.upgrades,
                            craftsmanship: e.craftsmanship
                        }
                    }),
                    heavy: value.get("heavy").map(e=> {
                        return {
                            name: e.name,
                            upgrades: e.upgrades,
                            craftsmanship: e.craftsmanship
                        }
                    }),
                }
            }
            case "_appliedTo":
            case "_kit":
            {
                return undefined;
            }
            case "":
            {
                let result = {};
                for (let property in value) {
                    result[property] = this.serialize(property, value[property]);
                }
                return JSON.stringify(result);
            }
        }
        return value;
    }

    deserialize(inVal:string):Promise<Regiment> {
        return this._placeholders.then(placeholders => {
            if (!inVal) {
                return inVal;
            }
            let parsed = JSON.parse(inVal);
            let talents = parsed._talents.map(e=> {
                return placeholders.replace(e, "talent");
            });
            let characteristics:Map<Characteristic, number> = new Map();
            Array.from(Characteristic.characteristics.values()).map(e=> {
                let value:number = parsed._characteristics[e.name];
                if (!value) {
                    value = 0;
                }
                characteristics.set(e, value);
            });
            let skills:Map<SkillDescription, number> = new Map();
            parsed._skills.forEach(e=> {
                skills.set(placeholders.replace(e, "skill"), e.rating);
            })
            let traits = parsed._traits.map(e=> {
                return placeholders.replace(e, "trait");
            });
            let favoredWeapons = new Map();
            favoredWeapons.set("basic", []);
            favoredWeapons.set("heavy", []);
            parsed._favoredWeapons.basic.forEach(e=> {
                favoredWeapons.get("basic").push(placeholders.replace(e, "item"));
            });
            parsed._favoredWeapons.heavy.forEach(e=> {
                favoredWeapons.get("heavy").push(placeholders.replace(e, "item"));
            });
            let specialAbilities = parsed._specialAbilities.map(e=> {
                return new SpecialAbility(e._name, e._description);
            });
            let optionalModifiers = parsed._optionalModifiers.map(e=> {
                return new SelectableModifier(e._numSelectionsNeeded, e._options, e._selectionTime);
            });
            return new RegimentBuilder()
                .setCharacteristics(characteristics)
                .setName(parsed._name)
                .setAptitudes(parsed._aptitudes)
                .setTalents(talents)
                .setTraits(traits)
                .setSkills(skills)
                .setFavoredWeapons(favoredWeapons)
                .setSpecialAbilties(specialAbilities)
                .setOptionalModifiers(optionalModifiers)
                .setWounds(parsed._wounds)
                .build();
        });
    }
}