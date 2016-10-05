/// <reference path="../../../libs/index.d.ts" />
import {Characteristic, CharacteristicValue} from "../../../app/types/character/Characteristic";
import {RegimentBuilder, Regiment} from "../../../app/types/character/Regiment";
import {RegimentSerializer} from "../../../app/types/serializers/RegimentSerializer";
import {Skill, SkillDescription} from "../../../app/types/character/Skill";
import * as angular from "angular";
import {Talent} from "../../../app/types/character/Talent";
import {PlaceholderReplacement} from "../../../app/services/PlaceholderReplacement";
import It = TypeMoqIntern.It;
import createSpy = jasmine.createSpy;
import {Trait} from "../../../app/types/character/Trait";
import {Weapon} from "../../../app/types/character/items/Weapon";
import {SelectableModifier} from "../../../app/types/character/CharacterModifier";
import {SpecialAbility} from "../../../app/types/regiment/SpecialAbility";
import {Item, ItemType} from "../../../app/types/character/items/Item";
import {Armor} from "../../../app/types/character/items/Armor";
/**
 * Created by Damien on 8/19/2016.
 */

describe("The regiment serializer", ()=> {
    let q;
    let regiment;
    let serializer;
    let placeholders:TypeMoq.Mock<PlaceholderReplacement>;

    beforeEach(angular.mock.inject(($q)=> {
        q = $q;

        placeholders = TypeMoq.Mock.ofType(PlaceholderReplacement, TypeMoq.MockBehavior.Strict);
        placeholders.setup(x=>x.replace(It.isAny(), It.isAnyString())).returns((e, type:string)=> {
            switch (type) {
                case "skill":
                    return new SkillDescription(e.name, ["One", "Two"], e.specialization);
                case "talent":
                    return new Talent(e.name, "test", 1, ["One", "Two"], e.specialization);
                case "trait":
                    return new Trait(e.name, "test", e.rating);
                case "item":
                    return new Weapon(e.name, "", "", "", "", "", "", "", "", "", []);
            }
        })
        serializer = new RegimentSerializer(q.resolve(placeholders.object));
        let characteristicsModifiers:Map<Characteristic, number> = new Map();
        characteristicsModifiers.set(Characteristic.characteristics.get("Agility"), 5);
        characteristicsModifiers.set(Characteristic.characteristics.get("Strength"), -5);

        let skills:Map<SkillDescription, number> = new Map();
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
            new Weapon("Heavy", "", "", "", "", "", "", "", "", "", [])
        ])

        let optionalModifiers:Array<SelectableModifier> = [];
        optionalModifiers.push(new SelectableModifier(1, [[1], [2]], "regiment"));
        optionalModifiers.push(new SelectableModifier(1, [[1], [2]], "character"));

        let specialAbilities:Array<SpecialAbility> = [];
        specialAbilities.push(new SpecialAbility("One", "Description"));
        specialAbilities.push(new SpecialAbility("Two", "Description"));

        let kit = new Map();
        kit.set(new Item("Item", ItemType.Other, ""), 1);
        kit.set(new Weapon("Weapon", "", "", "", "", "", "", "", "", "",[],0,null,["Upgrade"]), 1);
        kit.set(new Armor("Armor", "",[],0,"",0, [],"Best"), 1);

        regiment = new RegimentBuilder()
            .setAptitudes(aptitudes)
            .setCharacteristics(characteristicsModifiers)
            .setSkills(skills)
            .setTalents(talents)
            .setTraits(traits)
            .setFavoredWeapons(favoredWeapons)
            .setSpecialAbilties(specialAbilities)
            .setOptionalModifiers(optionalModifiers)
            .setWounds(1)
            .setKit(kit)
            .build();
    }));

    it("must serialize the name and bonus of each characteristic modifier", ()=> {
        let stringified = serializer.serialize("", regiment);;
        let serialized = JSON.parse(stringified);
        expect(serialized._characteristics["Agility"]).toEqual(regiment.characteristics.get(Characteristic.characteristics.get("Agility")));
        expect(serialized._characteristics["Strength"]).toEqual(regiment.characteristics.get(Characteristic.characteristics.get("Strength")));
    });
    it("must deserialize the name and bonus of the serialized characteristics correctly", inject($rootScope=> {
        let stringified = serializer.serialize("", regiment);;
        let deserialized;
        serializer.deserialize(stringified).then(result=> {
            deserialized = result;
        });
        $rootScope.$apply();
        expect(deserialized.characteristics.get(Characteristic.characteristics.get("Agility")).rolled).toEqual(regiment.characteristics.get(Characteristic.characteristics.get("Agility")).rolled);
        expect(deserialized.characteristics.get(Characteristic.characteristics.get("Strength")).rolled).toEqual(regiment.characteristics.get(Characteristic.characteristics.get("Strength")).rolled);
    }));
    it("must serialize the name, specialization and rating of each skill", ()=> {
        let stringified = serializer.serialize("", regiment);;
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
    it("must deserialize the skill name, specialization and ratings of each skill into their propery Skill objects", inject($rootScope=> {
        let stringified = serializer.serialize("", regiment);;
        let matches = 0;
        let deserialized = serializer.deserialize(stringified).then(deserialized=> {
            for (let deserializedSkill of deserialized.skills.entries()) {
                for (let regimentSkill of regiment.skills.entries()) {
                    if (angular.equals(deserializedSkill[0], regimentSkill[0])) {
                        matches++;
                    }
                }
            }
        });
        $rootScope.$apply();
        expect(matches).toEqual(2);
    }));
    it("must serialize the name and specialization of each talent", ()=> {
        let stringified = serializer.serialize("", regiment);;
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
        let stringified = serializer.serialize("", regiment);;
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
        let stringified = serializer.serialize("", regiment);;
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
        let stringified = serializer.serialize("", regiment);;
        let deserialized;
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
        let stringified = serializer.serialize("", regiment);;
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
        let stringified = serializer.serialize("", regiment);;
        let deserialized;
        serializer.deserialize(stringified).then(e=> {
            deserialized = e;
        });
        $rootScope.$apply();
        expect(deserialized.traits.length).toEqual(2);
        expect(deserialized.traits[0]).toEqual(
            new Trait("Trait", "test")
        );
        expect(deserialized.traits[1]).toEqual(
            new Trait("Rated Trait", "test", 1)
        );
    }));
    it("must serialize the favored weapons", ()=> {
        let stringified = serializer.serialize("", regiment);;
        let serialized = JSON.parse(stringified);
        expect(serialized._favoredWeapons.basic.length).toEqual(1);
        expect(serialized._favoredWeapons.heavy.length).toEqual(1);
        expect(serialized._favoredWeapons.basic[0]).toEqual(
            {
                name: "Basic",
                craftsmanship: "Common",
                upgrades: []
            }
        );
        expect(serialized._favoredWeapons.heavy[0]).toEqual(
            {
                name: "Heavy",
                craftsmanship: "Common",
                upgrades: []
            }
        );
    });
    it("must deserialize the favored weapons into their full instances", inject($rootScope=> {
        let stringified = serializer.serialize("", regiment);;

        let deserialized;
        serializer.deserialize(stringified).then(e=> {
            deserialized = e;
        });
        $rootScope.$apply();
        expect(deserialized.favoredWeapons.size).toEqual(2);
        expect(deserialized.favoredWeapons.get("basic").length).toEqual(1);
        expect(deserialized.favoredWeapons.get("heavy").length).toEqual(1);
        expect(deserialized.favoredWeapons.get("basic")[0]).toEqual(
            new Weapon("Basic", "", "", "", "", "", "", "", "", "", [])
        );
        expect(deserialized.favoredWeapons.get("heavy")[0]).toEqual(
            new Weapon("Heavy", "", "", "", "", "", "", "", "", "", [])
        );
    }));
    it("must serialize the special abilities", ()=> {
        let stringified = serializer.serialize("", regiment);;
        let serialized = JSON.parse(stringified);
        expect(serialized._specialAbilities.length).toEqual(2);
        expect(serialized._specialAbilities[0]).toEqual(
            {
                _name: "One",
                _description: "Description"
            }
        );
        expect(serialized._specialAbilities[1]).toEqual(
            {
                _name: "Two",
                _description: "Description"
            }
        );
    });
    it("must deserialize the special abilities", inject($rootScope=> {
        let stringified = serializer.serialize("", regiment);
        let deserialized;
        serializer.deserialize(stringified).then(e=> {
            deserialized = e;
        });
        $rootScope.$apply();
        expect(deserialized.specialAbilities.length).toEqual(2);
        expect(deserialized.specialAbilities[0]).toEqual(
            new SpecialAbility("One", "Description")
        );
        expect(deserialized.specialAbilities[1]).toEqual(
            new SpecialAbility("Two", "Description")
        );
    }));
    it("must serialize any unchosen optional modifiers", ()=>{
        let stringified = serializer.serialize("", regiment);
        let parsed = JSON.parse(stringified);
        expect(parsed._optionalModifiers.length).toEqual(2);
    });
    it("must deserialize any unchosen optional modifiers", inject($rootScope=>{
        let stringified = serializer.serialize("", regiment);
        let deserialized;
        serializer.deserialize(stringified).then(r=>{
            deserialized = r;
        });
        $rootScope.$apply();
        expect(deserialized.optionalModifiers).toEqual(regiment.optionalModifiers);
    }));
    it("must serialize the wound modifier", ()=>{
        let stringified = serializer.serialize("", regiment);
        let parsed = JSON.parse(stringified);
        expect(parsed._wounds).toEqual(1);
    });
    it("must deserialize any unchosen optional modifiers", inject($rootScope=>{
        let stringified = serializer.serialize("", regiment);
        let deserialized;
        serializer.deserialize(stringified).then(r=>{
            deserialized = r;
        });
        $rootScope.$apply();
        expect(deserialized._wounds).toEqual(1);
    }));
    it("must")
});