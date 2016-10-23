/// <reference path="../../../index.d.ts" />
import {Characteristic} from "../../../app/types/character/Characteristic";
import {SpecialtySerializer} from  "../../../app/types/serializers/SpecialtySerializer";
import {RegimentBuilder, Regiment} from "../../../app/types/character/Regiment";
import {Skill, SkillDescription} from "../../../app/types/character/Skill";
import * as angular from "angular";
import {Talent} from "../../../app/types/character/Talent";
import {PlaceholderReplacement} from "../../../app/services/PlaceholderReplacement";
import createSpy = jasmine.createSpy;
import * as TypeMoq from "typemoq";
import It = TypeMoq.It;
import {Trait} from "../../../app/types/character/Trait";
import {Weapon} from "../../../app/types/character/items/Weapon";
import {SelectableModifier} from "../../../app/types/character/CharacterModifier";
import {SpecialAbility} from "../../../app/types/regiment/SpecialAbility";
import {SpecialtyBuilder, SpecialtyType} from "../../../app/types/character/Specialty";
/**
 * Created by Damien on 8/19/2016.
 */

describe("The specialty serializer", ()=> {
    let q;
    let specialty;
    let serializer;
    let placeholders:TypeMoq.Mock<PlaceholderReplacement>;

    beforeEach(angular.mock.inject(($q)=> {
        q = $q;

        placeholders = TypeMoq.Mock.ofType(PlaceholderReplacement, TypeMoq.MockBehavior.Strict);
        placeholders.setup(x=> x.replace(It.isAny(), It.isAnyString())).returns((e, type)=>{
            switch (type){
                case "skill":
                    return new SkillDescription(e.name, [], e.specialization);
                case "talent":
                    return new Talent(e.name, "test", 1, ["One", "Two"], e.specialization);
                case "trait":
                    return new Trait(e.name, "", e.rating);
                case "item":
                    switch (e.name){
                        case "Basic":
                            new Weapon("Basic", "", "", "", "", "", "", "", "", "", []);
                        case "Heavy":
                            new Weapon("Heavy", "", "", "", "", "", "", "", "", "", [])
                    }
            }
        });
        serializer = new SpecialtySerializer(q.resolve(placeholders.object));
        let characteristicsModifiers:Map<Characteristic, number> = new Map();
        characteristicsModifiers.set(Characteristic.characteristics.get("Agility"), 5);
        characteristicsModifiers.set(Characteristic.characteristics.get("Strength"), -5);

        let skills = new Map();
        skills.set(new SkillDescription("Skill", ["One", "Two"]), 1);
        skills.set(new SkillDescription("Skill", ["One", "Two"], "Specialization"), 1);

        let talents = [];
        talents.push(new Talent("Unspecialized", "test", 1, ["One", "Two"]));
        talents.push(new Talent("Specialized", "test", 1, ["One", "Two"], "Specialization"));

        let aptitudes = [];
        aptitudes.push("One");
        aptitudes.push("Two");

        let traits = [];
        traits.push(new Trait("Trait", ""));
        traits.push(new Trait("Rated Trait", "", 1));

        let favoredWeapons:Map<string, Array<Weapon>> = new Map();
        favoredWeapons.set("basic", [
            new Weapon("Basic", "", "", "", "", "", "", "", "", "", [])
        ]);
        favoredWeapons.set("heavy", [
            new Weapon("Heavy", "", "", "", "", "", "", "", "", "", []),
            new Weapon("Heavy", "", "", "", "", "", "", "", "", "", [])
        ])

        let optionalModifiers:Array<SelectableModifier> = [];
        optionalModifiers.push(new SelectableModifier(1, [[1], [2]], "regiment"));
        optionalModifiers.push(new SelectableModifier(1, [[1], [2]], "character"));

        let specialAbilities:Array<SpecialAbility> = [];
        specialAbilities.push(new SpecialAbility("One", "Description"));
        specialAbilities.push(new SpecialAbility("Two", "Description"));

        specialty = new SpecialtyBuilder()
            .setSpecialtyType(SpecialtyType.Guardsman)
            .setAptitudes(aptitudes)
            .setCharacteristics(characteristicsModifiers)
            .setSkills(skills)
            .setTalents(talents)
            .setTraits(traits)
            .setWounds(10)
            .build();
    }));

    it("must serialize the name and bonus of each characteristic modifier", ()=> {
        let stringified = serializer.serialize("", specialty);
        let serialized = JSON.parse(stringified);
        expect(serialized._characteristics["Agility"]).toEqual(specialty.characteristics.get(Characteristic.characteristics.get("Agility")));
        expect(serialized._characteristics["Strength"]).toEqual(specialty.characteristics.get(Characteristic.characteristics.get("Strength")));
    });
    it("must deserialize the name and bonus of the serialized characteristics correctly", inject($rootScope=> {
        let stringified = serializer.serialize("", specialty);
        let deserialized;
        serializer.deserialize(stringified).then(result=> {
            deserialized = result;
        });
        $rootScope.$apply();
        expect(deserialized.characteristics.get(Characteristic.characteristics.get("Agility"))).toEqual(specialty.characteristics.get(Characteristic.characteristics.get("Agility")));
        expect(deserialized.characteristics.get(Characteristic.characteristics.get("Strength"))).toEqual(specialty.characteristics.get(Characteristic.characteristics.get("Strength")));
    }));
    it("must serialize the name, specialization and rating of each skill", ()=> {
        let stringified = serializer.serialize("", specialty);
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
    it("must deserialize the skill name, specialization and ratings of each skill into their propery Skill objects", ()=> {
        let stringified = serializer.serialize("", specialty);
        let deserialized = serializer.deserialize(stringified).then(deserialized=> {
            let matches = 0;
            for (let deserializedSkill of deserialized.skills.entries()) {
                for (let regimentSkill of specialty.skills.entries()) {
                    if (angular.equals(deserializedSkill, regimentSkill)) {
                        matches++;
                    }
                }
            }
            expect(matches).toEqual(2);
        });
    });
    it("must serialize the name and specialization of each talent", ()=> {
        let stringified = serializer.serialize("", specialty);
        let serialized = JSON.parse(stringified);
        expect(serialized._talents.length).toEqual(2);
        expect(serialized._talents[0]).toEqual(
            {
                name: "Unspecialized"
            }
        );
        expect(serialized._talents[1]).toEqual(
            {
                name: "Specialized",
                specialization: "Specialization"
            }
        );
    });
    it("must deserialize the talents into their proper types", inject($rootScope=> {
        let stringified = serializer.serialize("", specialty);
        let deserialized:Regiment;
        serializer.deserialize(stringified).then(result => {
            deserialized = result;
        });
        $rootScope.$apply();
        expect(deserialized.talents.length).toEqual(2);
        expect(deserialized.talents[0]).toEqual(
            new Talent("Unspecialized", "test", 1, ["One", "Two"])
        );
        expect(deserialized.talents[1]).toEqual(
            new Talent("Specialized", "test", 1, ["One", "Two"], "Specialization")
        );
    }));
    it("must serialize the aptitudes", ()=> {
        let stringified = serializer.serialize("", specialty);
        let serialized = JSON.parse(stringified);
        expect(serialized._aptitudes.length).toEqual(2);
        expect(serialized._aptitudes[0]).toEqual(
            "One"
        );
        expect(serialized._aptitudes[1]).toEqual(
            "Two"
        );
    });
    it("must deserialize the aptitudes", inject($rootScope=> {
        let stringified = serializer.serialize("", specialty);
        let deserialized;
        placeholders.setup(x=>x.replace(It.isAny(), It.isValue("")))
        serializer.deserialize(stringified).then(e=> {
            deserialized = e;
        });
        $rootScope.$apply();
        expect(deserialized._aptitudes.length).toEqual(2);
        expect(deserialized._aptitudes[0]).toEqual(
            "One"
        );
        expect(deserialized._aptitudes[1]).toEqual(
            "Two"
        );
    }));
    it("must serialize the names and ratings of the traits", ()=> {
        let stringified = serializer.serialize("", specialty);
        let serialized = JSON.parse(stringified);
        expect(serialized._traits.length).toEqual(2);
        expect(serialized._traits[0]).toEqual(
            {
                name: "Trait"
            }
        );
        expect(serialized._traits[1]).toEqual(
            {
                name: "Rated Trait",
                rating: 1
            }
        );
    });
    it("must deserialize the traits", inject($rootScope=> {
        let stringified = serializer.serialize("", specialty);

        let deserialized;
        serializer.deserialize(stringified).then(e=> {
            deserialized = e;
        });
        $rootScope.$apply();
        expect(deserialized.traits.length).toEqual(2);
        expect(deserialized.traits[0]).toEqual(
            new Trait("Trait","")
        );
        expect(deserialized.traits[1]).toEqual(
            new Trait("Rated Trait", "", 1)
        );
    }));
    it("must serialize the wound modifier", ()=>{
        let stringified = serializer.serialize("", specialty);
        let parsed = JSON.parse(stringified);
        expect(parsed._wounds).toEqual(10);
    });
    it("must deserialize any unchosen optional modifiers", inject($rootScope=>{
        let stringified = serializer.serialize("", specialty);
        let deserialized;
        serializer.deserialize(stringified).then(r=>{
            deserialized = r;
        });
        $rootScope.$apply();
        expect(deserialized._wounds).toEqual(10);
    }));
});