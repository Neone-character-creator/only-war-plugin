import {Serializer} from "./Serializer";
import {OnlyWarCharacter, AdvanceableProperty} from "../character/Character";
import {CharacteristicValue, Characteristic} from "../character/Characteristic";
import IQService = angular.IQService;
import IPromise = angular.IPromise;
import {
    CharacteristicAdvancement, SkillAdvancement,
    TalentAdvancement, PsychicPowerAdvancement, PsyRatingAdvancement
} from "../character/advancements/CharacterAdvancement";
import {SkillDescription} from "../character/Skill";
import {PlaceholderReplacement} from "../../services/PlaceholderReplacement";
/**
 * This class is for serializing OnlyWarCharacter instances into a compressed json form and recreating them.
 * Created by Damien on 8/18/2016.
 */

export class CharacterSerializer implements Serializer<IPromise<OnlyWarCharacter>> {
    serialize(key:string, value:any):any {
        switch (key) {
            case "_regiment":
            {
                return this._contentSerializers.get("Regiment").serialize("", value);
            }
            case "_specialty":
            {
                return this._contentSerializers.get("Specialty").serialize("", value);
            }
            case "_characteristics":
            {
                value = <Map<Characteristic, CharacteristicValue>>value;
                let characteristics = Array.from(value.entries()).map(e=> {
                    return {
                        "name" : e[0].name,
                        "rolled" : e[1].rolled
                    };
                })
                return characteristics;
            }
            case "_kit":
            {
                return Array.from(value.entries()).map(e=> {
                    return {
                        item: {
                            name: e[0].name,
                            craftsmanship: e[0].craftsmanship && e[0].craftsmanship != "Common" ? e[0].craftsmanship : undefined,
                            upgrades : e[0].upgrades
                        },
                        count: e[1]
                    }
                });
            }
            case "_wounds":
            {
                return {
                    rolled: value.rolled,
                    criticalDamage : value.criticalDamage
                };
            }
            case "_speeds":
            {
                return {
                    half: value.half,
                    full: value.full,
                    run: value.run,
                    charge: value.charge
                };
            }
            case "_experience":
            {
                return {
                    total: value._total,
                    available: value._available,
                    advances: value._advances.map(e=> {
                        switch (e.property) {
                            case AdvanceableProperty.CHARACTERISTIC:
                                return {
                                    property: "characteristic",
                                    value: e.characteristic.name
                                }
                            case AdvanceableProperty.SKILL:
                                return {
                                    property: "skill",
                                    value: {
                                        name : e.skill.name,
                                        specialization : e.skill.specialization
                                    }
                                }
                            case AdvanceableProperty.TALENT:
                                return {
                                    "property" : "talent",
                                    value: {
                                        name: e.talent.name,
                                        specialization : e.talent.specialization
                                    }
                                }
                            case AdvanceableProperty.PSYCHIC_POWER:
                                return {
                                    property : "power",
                                    value : {
                                        name : e.power.name
                                    }
                                }
                            case AdvanceableProperty.PSY_RATING:
                                return {
                                    "property":"psy rating",
                                    value: 1
                                }
                        }
                    })
                };
            }
            case "_skills":
            case "_talents":
            case "_powers":
            case "_aptitudes":
            {
                return undefined;
            }
            case "":
            {
                let result = {};
                for(let property in value){
                    result[property] = this.serialize(property, value[property]);
                }
                return JSON.stringify(result);
            }
            default:
                return value;
        }
    }

    deserialize(inVal:string):IPromise<OnlyWarCharacter> {
        let parsed = JSON.parse(inVal);
        return this._q.all({"regiment" : this._contentSerializers.get("Regiment").deserialize(parsed._regiment),
        "specialty" : this._contentSerializers.get("Specialty").deserialize(parsed._specialty),
        "placeholders": this._placeholders}).then(result=> {
            let character = new OnlyWarCharacter();
            character.characteristics.forEach((v, k)=>{
                v.rolled = parsed._characteristics.find(e=>{
                    return e.name = k.name;
                }).rolled;
            });
            character.name = parsed._name;
            character.player = parsed._player;
            character.description = parsed._description;
            character.demeanor = parsed._demeanor;
            character.regiment = result["regiment"];
            character.specialty = result["specialty"];
            character.experience.total = parsed._experience.total;
            character.experience.available = parsed._experience.total;
            character.wounds.rolled = parsed._wounds.rolled;
            character.wounds.criticalDamage = parsed._wounds.criticalDamage;
            character.fatePoints = parsed._fatePoints;
            character.comrade = parsed._comrade;
            parsed._experience.advances.forEach(a=>{
                switch (a.property) {
                    case "characteristic":
                        character.experience.addAdvancement(new CharacteristicAdvancement(Characteristic.characteristics.get(a.value)));
                        break;
                    case "skill":
                        let skill =result["placeholders"].replace(a.value, "skill");
                        character.experience.addAdvancement(new SkillAdvancement(skill));
                        break;
                    case "talent":
                        let talent = result['placeholders'].replace(a.value, "talent");
                        character.experience.addAdvancement(new TalentAdvancement(talent));
                        break;
                    case "power":
                        let power = result['placeholders'].replace(a.value, "power");
                        character.experience.addAdvancement(new PsychicPowerAdvancement(power));
                        break;
                    case "psy rating":
                        character.experience.addAdvancement(new PsyRatingAdvancement());
                        break;
                }
            });
            character.kit = new Map();
            parsed._kit.forEach(e=>{
                character.kit.set(result["placeholders"].replace(e.item, "item"), e.count);
            })
            return character;
        });
    }

    private _contentSerializers:Map<string, Serializer<any>>;
    private _q:IQService;
    private _placeholders:IPromise<PlaceholderReplacement>;
    constructor(contentSerializers:Map<string, Serializer<any>>, placeholders:IPromise<PlaceholderReplacement>, $q:IQService) {
        this._contentSerializers = contentSerializers;
        this._placeholders = placeholders;
        this._q = $q;
    }
}