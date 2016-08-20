import {Serializer} from "./Serializer";
import {OnlyWarCharacter} from "../character/Character";
import {CharacteristicValue, Characteristic} from "../character/Characteristic";
import {Regiment} from "../character/Regiment";
/**
 * Created by Damien on 8/18/2016.
 */

export class CharacterSerializer implements Serializer<OnlyWarCharacter> {
    serialize(key:string, value:any):any {
        switch (key) {
            case "_regiment":
            {
                return JSON.stringify(value, this._contentSerializers.get("Regiment").serialize);
            }
            case "_specialty":
            {
                return JSON.stringify(value, this._contentSerializers.get("Specialty").serialize);
            }
            case "_characteristics":
            {
                value = <Map<Characteristic, CharacteristicValue>>value;
                var characteristics = Array.from(value.entries()).map(e=> {
                    let r = {};
                    r[e[0].name] = {
                        "rolled": e[1].rolled
                    }
                    return r;
                })
            }
            case "_kit":
            {
                return Array.from(value.entries()).map(e=> {
                    return {
                        "item": e[0],
                        "count": e[1]
                    }
                });
            }
            case "_wounds":
            {
                return {
                    "rolled": value.rolled
                }
            }
            case "_speeds":
            {
                return {
                    half: value.half,
                    full: value.full,
                    run: value.run,
                    charge: value.charge
                }
            }
            case "_experience":
            {
                return {
                    total: value.total,
                    available: value.available,
                    advances: value.advances
                }
            }
            default:
                return value;
        }
    }

    deserialize(inVal:string):OnlyWarCharacter {
        return undefined;
    }

    private _contentSerializers:Map<string, Serializer<any>>;
}