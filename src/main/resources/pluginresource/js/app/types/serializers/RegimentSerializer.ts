import {Serializer} from "./Serializer";
import {Regiment, RegimentBuilder} from "../character/Regiment";
import {Characteristic} from "../character/Characteristic";
import {Skill} from "../character/Skill";
import {CharacterOptionsService} from "../../services/CharacterOptionsService";

export class RegimentSerializer implements Serializer<Regiment> {
    private _characterOptions:Promise<CharacterOptionsService>;

    constructor(characterOptions:Promise<CharacterOptionsService>) {
        this._characterOptions = characterOptions;
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
                        name: e[0].identifier.name,
                        specialization: e[0].identifier.specialization,
                        rating: e[1]
                    }
                });
            }
        }
        return value;
    }

    deserialize(inVal:string):Promise<Regiment> {
        return this._characterOptions.then(characterOptions=> {
            let parsed = JSON.parse(inVal);
            return new RegimentBuilder().setName(parsed._name)
                .setAptitudes(parsed._aptitudes)
                .build();
        });
    }
}