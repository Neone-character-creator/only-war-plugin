/// <reference path="../../index.d.ts" />
/**
 * Created by Damien on 7/16/2016.
 */
import {Prerequisite} from "../../app/types/Prerequisite";
import {OnlyWarCharacter} from "../../app/types/character/Character";
import {Characteristic, CharacteristicValue} from "../../app/types/character/Characteristic";
describe("A prerequisite", ()=> {
    it("must always match with an no matcher object", ()=> {
        var prerequisite:Prerequisite<OnlyWarCharacter> = new Prerequisite();
        var character:OnlyWarCharacter = new OnlyWarCharacter();
        expect(prerequisite.match(character)).toEqual(true);
    });
    it("must match only if all predicate functions match", ()=> {
        var character = new OnlyWarCharacter();
        character.name = "Coolguy";
        var prerequisite:Prerequisite<OnlyWarCharacter> = new Prerequisite((target)=> {
                return target.name == "Coolguy"
                    && target.characteristics.get(Characteristic.characteristics.get("Agility")).total == 0;
            }
        );
        expect(prerequisite.match(character)).toEqual(true);
    });
});