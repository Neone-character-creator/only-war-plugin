/// <reference path="../../../libs/globals/jasmine/index.d.ts" />
import {Characteristic, CharacteristicValue} from "../../../app/types/character/Characteristic";
import {RegimentBuilder} from "../../../app/types/character/Regiment";
import {RegimentSerializer} from "../../../app/types/serializers/RegimentSerializer";
import {Skill, SkillDescription} from "../../../app/types/character/Skill";
import * as angular from "angular";
import {CharacterOptionsService} from "../../../app/services/CharacterOptionsService";
/**
 * Created by Damien on 8/19/2016.
 */

describe("The regiment serializer", ()=> {
    let q;
    let regiment;
    let serializer;

    beforeEach(angular.mock.inject(($q)=> {
        q = $q;
        let deferred = q.defer();
        deferred.resolve({});
        serializer = new RegimentSerializer(deferred.promise);
        let characteristicsModifiers:Map<Characteristic, number> = new Map();
        characteristicsModifiers.set(Characteristic.characteristics.get("Agility"), 5);
        characteristicsModifiers.set(Characteristic.characteristics.get("Strength"), -5);

        let skills = new Map();
        skills.set(new Skill(new SkillDescription("Skill", ["One", "Two"])), 1);
        skills.set(new Skill(new SkillDescription("Skill", ["One", "Two"], "Specialization")), 1);

        regiment = new RegimentBuilder()
            .setCharacteristics(characteristicsModifiers)
            .setSkills(skills).build();
    }));
    it("must serialize the name and bonus of each characteristic modifier", ()=> {
        let stringified = JSON.stringify(regiment, serializer.serialize);
        let serialized = JSON.parse(stringified);
        expect(serialized._characteristics["Agility"]).toEqual(regiment.characteristics.get(Characteristic.characteristics.get("Agility")));
        expect(serialized._characteristics["Strength"]).toEqual(regiment.characteristics.get(Characteristic.characteristics.get("Strength")));
    });
    it("must deserialize the name and bonus of the serialized characteristics correctly", ()=> {
        let stringified = JSON.stringify(regiment, serializer.serialize);
        let deserialized = serializer.deserialize(stringified).then(deserialized=> {
            expect(deserialized.characteristics.get(Characteristic.characteristics.get("Agility"))).toEqual(regiment.characteristics.get(Characteristic.characteristics.get("Agility")));
            expect(deserialized.characteristics.get(Characteristic.characteristics.get("Strength"))).toEqual(regiment.characteristics.get(Characteristic.characteristics.get("Strength")));
        });
    });
    it("must serialize the name, specialization and rating of each skill", ()=> {
        let stringified = JSON.stringify(regiment, serializer.serialize.bind(serializer));
        let serialized = JSON.parse(stringified);
        expect(serialized._skills.length).toEqual(2);
        expect(serialized._skills[0]).toEqual(
            {
                name: "Skill",
                rating: 1
            }
        );
        expect(serialized._skills[1]).toEqual(
            {
                name: "Skill",
                specialization: "Specialization",
                rating: 1
            }
        );
    });
    it("must deserialize the skills and ratings of each skill into their propery Skill objects", ()=> {
        let stringified = JSON.stringify(regiment, serializer.serialize);
        let deserialized = serializer.deserialize(stringified).then(deserialized=> {
            let matches = 0;
            for (let deserializedSkill of deserialized.skills.entries()) {
                for (let regimentSkill of regiment.skills.entries()) {
                    if (angular.equals(deserializedSkill, regimentSkill)) {
                        matches++;
                    }
                }
            }
            expect(matches).toEqual(2);
        });
    });
});