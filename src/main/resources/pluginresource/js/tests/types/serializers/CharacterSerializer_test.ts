/// <reference path="../../../libs/globals/jasmine/index.d.ts" />
import {OnlyWarCharacter} from "../../../app/types/character/Character";
import {CharacterSerializer} from "../../../app/types/serializers/CharacterSerializer";
import {RegimentBuilder} from "../../../app/types/character/Regiment";
import {Characteristic, CharacteristicValue} from "../../../app/types/character/Characteristic";
import {RegimentSerializer} from "../../../app/types/serializers/RegimentSerializer";
/**
 * Created by Damien on 8/19/2016.
 */
describe("The character serializer", ()=> {
    let character:OnlyWarCharacter;
    let serializer:CharacterSerializer = new CharacterSerializer();
    beforeEach(()=> {
        character = new OnlyWarCharacter();
    });
    it("must leave the character name unmodified", ()=> {
        character.name = "test";
        let serialized = JSON.stringify(character, serializer.serialize);
        let result = JSON.parse(serialized);
        expect(result._name).toEqual(character.name);
    });
    it("must leave the character player name unmodified", ()=> {
        character.player = "test";
        let serialized = JSON.stringify(character, serializer.serialize);
        let result = JSON.parse(serialized);
        expect(result._player).toEqual(character.player);
    });
    it("must leave the character description unmodified", ()=> {
        character.description = "test";
        let serialized = JSON.stringify(character, serializer.serialize);
        let result = JSON.parse(serialized);
        expect(result._description).toEqual(character.description);
    });
    it("must leave the character demeanor unmodified", ()=> {
        character.demeanor = "test";
        let serialized = JSON.stringify(character, serializer.serialize);
        let result = JSON.parse(serialized);
        expect(result._demeanor).toEqual(character.demeanor);
    });
    it("must reduce the character regiment to a collapsed form", ()=> {
        describe("the collapsed regiment characteristics must save the rolled value", ()=> {
            let characteristics = new Map<Characteristic, number>();
            characteristics.set(Characteristic.characteristics.get("Agility"), 5);
            let regiment = new RegimentBuilder().setCharacteristics(characteristics).build();
            let stringified = JSON.stringify(regiment, serializer.serialize);
            let serialized = JSON.parse(stringified);
            expect(serialized.characteristics.get("Agility")).toBeDefined();
        });
    });
});