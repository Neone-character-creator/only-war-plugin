/// <reference path="../../../../../../../typings/index.d.ts" />
/**
 * Created by Damien on 7/1/2016.
 */
import {OnlyWarCharacter} from "../../app/types/character/Character"
import {Characteristic} from "../../app/types/character/Characteristic";
import {Regiment} from "../../app/types/character/Regiment";
import {Specialty} from "../../app/types/character/Specialty";
import {Talent} from "../../app/types/character/Talent";
import {Trait} from "../../app/types/character/Trait";
import {Item, Craftsmanship, ItemType, Availability} from "../../app/types/character/items/Item";
import {Skill} from "../../app/types/character/Skill";
import {
    TalentAdvancement,
    CharacteristicAdvancement, SkillAdvancement
} from "../../app/types/character/advancements/CharacterAdvancement";
describe("The character", ()=> {
    var theCharacter;
    beforeEach(function () {
        theCharacter = new OnlyWarCharacter();
    });

    describe("characteristics", function () {
        it("must exist.", ()=> {
            let character = new OnlyWarCharacter();
            for (var characteristic of Characteristic.characteristics.values()) {
                expect(character.characteristics.get(characteristic)).toBeDefined();
                expect(character.characteristics.get(characteristic).total).toEqual(0);
            }
        });
        it("must allow for adding modifiers to the characteristics from their regiment", function () {
            var characteristics = new Map<Characteristic, number>();
            characteristics.set(Characteristic.characteristics.get("Agility"), 5);
            var regiment = new Regiment("", characteristics, [], [], [], [], new Map<Item, number>(), 0, []);
            theCharacter.regiment = regiment;
            expect(theCharacter.characteristics.get(Characteristic.characteristics.get("Agility")).regimentModifier).toEqual(5);
            expect(theCharacter.characteristics.get(Characteristic.characteristics.get("Agility")).total).toEqual(5);
        });
        it("must allow for adding modifiers to the characteristics from their specialty", function () {
            var characteristics = new Map<Characteristic, number>();
            characteristics.set(Characteristic.characteristics.get("Agility"), 5);
            var specialty = new Specialty(characteristics, [], [], [], [], new Map<Item, number>(), 0, []);
            theCharacter.specialty = specialty;
            expect(theCharacter.characteristics.get(Characteristic.characteristics.get("Agility")).specialtyModifier).toEqual(5);
            expect(theCharacter.characteristics.get(Characteristic.characteristics.get("Agility")).total).toEqual(5);
        });
        it("must allow for improving characteristics from advancements", function () {
            var advancement = new CharacteristicAdvancement(Characteristic.characteristics.get("Agility"));
            theCharacter.experience.addAdvancement(advancement);
            expect(theCharacter.characteristics.get(Characteristic.characteristics.get("Agility")).advancements.length).toEqual(1);
            expect(theCharacter.characteristics.get(Characteristic.characteristics.get("Agility")).total).toEqual(5);
        })
        it("must allow for setting the base rolled value of a characteristic", function () {
            theCharacter.characteristics.get(Characteristic.characteristics.get("Agility")).rolled = 10;
            expect(theCharacter.characteristics.get(Characteristic.characteristics.get("Agility")).rolled).toEqual(10);
            expect(theCharacter.characteristics.get(Characteristic.characteristics.get("Agility")).total).toEqual(10);
        });
        it("must allow adding advancements for each characteristic a maximum of 4 times", function () {
            for (var i = 1; i <= 5; i++) {
                let advancement = new CharacteristicAdvancement(Characteristic.characteristics.get("Agility"));
                if (i <= 4) {
                    ;
                    expect(theCharacter.experience.addAdvancement(advancement)).toEqual(true);
                    expect(theCharacter.characteristics.get(Characteristic.characteristics.get("Agility")).advancements.length == i);
                } else {
                    expect(theCharacter.experience.addAdvancement(advancement)).toEqual(false);
                }
            }
        });
    });
    describe("skills", function () {
        it("must exist", ()=> {
            expect(theCharacter.skills).toBeDefined();
        });
        it("must allow for adding modifiers to the skills from their regiment", function () {
            var skills = [new Skill("Acrobatics", 1, [])];
            var regiment = new Regiment("", new Map<Characteristic, number>(), skills, [], [], [], new Map<Item, number>(), 0, []);
            theCharacter.regiment = regiment;
            expect(theCharacter.skills[0].rank).toEqual(1);
        });
        it("must allow for adding modifiers to the skills from their specialty", function () {
            var skills = [new Skill("Acrobatics", 1, [])];
            var specialty = new Specialty(new Map<Characteristic, number>(), skills, [], [], [], new Map<Item, number>(), 0, []);
            theCharacter.specialty = specialty;
            expect(theCharacter.skills[0].rank).toEqual(1);
        });
        it("must allow adding advancements for each skill and specialization", function () {
            var advancement = new SkillAdvancement(new Skill("Acrobatics", 1, []));
            theCharacter.experience.addAdvancement(advancement);
            expect(theCharacter.skills[0].rank).toEqual(1);
        });
        it("must not allow improving a skill beyond 4 by advancement", function () {
            var advancement = new SkillAdvancement(new Skill("Acrobatics", 1, []));
            for (var i = 0; i < 4; i++) {
                theCharacter.experience.addAdvancement(advancement);
            }
            expect(theCharacter.experience.addAdvancement(advancement)).toEqual(false);
        });
    });
    describe("talents", function () {
        it("must exist", ()=> {
            expect(theCharacter.talents).toBeDefined();
        });
        it("must allow gaining talents from the character regiment.", function () {
            var talent = new Talent("Test Talent", "Test", 1, [], false);
            var talents = [talent];
            var regiment = new Regiment("", new Map(),
                [],
                talents, [], [], new Map<Item, number>(), 0, []);
            theCharacter.regiment = regiment;
            expect(theCharacter.talents.indexOf(talent)).not.toEqual(-1);
        });
        it("must allow gaining talents from the character specialty.", function () {
            var talent = new Talent("Test Talent", "Test", 1, [], false);
            var talents = [talent];
            var specialty = new Specialty(new Map(),
                [],
                talents, [], [], new Map<Item, number>(), 0, []);
            theCharacter.specialty = specialty;
            expect(theCharacter.talents.indexOf(talent)).not.toEqual(-1);
        });
        it("must allow gaining talents by character advancement.", function () {
            var talent = new Talent("Test Talent", "Test", 1, [], false);
            var advancement = new TalentAdvancement(talent);
            theCharacter.experience.addAdvancement(advancement);
            expect(theCharacter.talents.indexOf(talent)).not.toEqual(-1);
        });
        it("must not allow adding a Talent by advancement with the same name and specialization as one the character already has.", function () {
            var talent = new Talent("Test Talent", "Test", 1, [], false);
            var advancement = new TalentAdvancement(talent);
            theCharacter.experience.addAdvancement(advancement);
            expect(theCharacter.experience.addAdvancement(advancement)).toEqual(false);
        })
    });
    describe("traits", function () {
        it("must exist", ()=> {
            expect(theCharacter.traits).toBeDefined();
        });
        it("must allow for adding traits to the character from the regiment", function () {
            var traits = new Array<Trait>();
            var testTrait = new Trait("", "");
            traits.push(testTrait);
            var regiment = new Regiment("", new Map<Characteristic, number>(), [], [], [], traits, new Map<Item, number>(), 0, []);
            theCharacter.regiment = regiment;
            expect(theCharacter.traits.indexOf(testTrait)).toEqual(0);
        });
        it("must allow for adding traits to the character from the specialty", function () {
            var traits = new Array<Trait>();
            var testTrait = new Trait("", "");
            traits.push(testTrait);
            var specialty = new Specialty(new Map<Characteristic, number>(), [], [], [], traits, new Map<Item, number>(), 0, []);
            theCharacter.specialty = specialty;
            expect(theCharacter.traits.indexOf(testTrait)).toEqual(0);
        });
        it("must not allow adding a trait the character already has", function () {
            var traits = new Array<Trait>();
            var testTrait = new Trait("", "");
            traits.push(testTrait);
            var regiment = new Regiment("", new Map<Characteristic, number>(), [], [], [], traits, new Map<Item, number>(), 0, []);
            theCharacter.regiment = regiment;
            expect(theCharacter.traits.indexOf(testTrait)).toEqual(0);
        });
    });
    describe("kit", function () {
        it("must allow for adding items from the regiment", function () {
            var item = new Item("", ItemType.Other, Availability.Abundant);
            var items:Map<Item, number> = new Map<Item, number>();
            items.set(item, 1);
            theCharacter.regiment = new Regiment("", new Map<Characteristic, number>(), [], [], [], [], items, 0, []);
            expect(theCharacter.kit.get(item)).toEqual(1);
        });
        it("must allow for adding items from the specialty", function () {
            var item = new Item("", ItemType.Other, Availability.Abundant);
            var items:Map<Item, number> = new Map<Item, number>();
            items.set(item, 1);
            theCharacter.specialty = new Specialty(new Map<Characteristic, number>(), [], [], [], [], items, 0, []);
            expect(theCharacter.kit.get(item)).toEqual(1);
        });
    });
    describe("wounds", function () {
        it("must allow for adding a modifier to wounds from the regiment", function () {
            theCharacter.regiment = new Regiment("", new Map<Characteristic, number>(), [], [], [], [], new Map<Item, number>(), 1, []);
            expect(theCharacter.wounds.regimentModifier).toEqual(1);
            expect(theCharacter.wounds.total).toEqual(1);
        });
        it("must allow for adding a modifier to wounds from the specialty", function () {
            theCharacter.specialty = new Specialty(new Map<Characteristic, number>(), [], [], [], [], new Map<Item, number>(), 1, []);
            expect(theCharacter.wounds.specialtyModifier).toEqual(1);
            expect(theCharacter.wounds.total).toEqual(1);
        });
    });
    describe("insanity", function () {
        it("must exist", function () {
            expect(theCharacter.insanity).toBeDefined();
        });
    });
    describe("corruption", function () {
        it("must exist", function () {
            expect(theCharacter.corruption).toBeDefined();
        });
    });
    describe("speeds", function () {
        it("must exist", function () {
            expect(theCharacter.speeds).toBeDefined();
        });
        it("must calculate the correct speed based on the character Agility bonus", function () {
            expect(theCharacter.speeds.half).toEqual(.5);
            expect(theCharacter.speeds.full).toEqual(1);
            expect(theCharacter.speeds.charge).toEqual(2);
            expect(theCharacter.speeds.run).toEqual(3);
            for (var i = 1; i <= 10; i++) {
                theCharacter._characteristics.get(Characteristic.characteristics.get("Agility")).rolled = i * 10;
                expect(theCharacter.speeds.half).toEqual(i);
                expect(theCharacter.speeds.full).toEqual(i * 2);
                expect(theCharacter.speeds.charge).toEqual(i * 3);
                expect(theCharacter.speeds.run).toEqual(i * 6);
            }
        })
    });
    describe("experience", function () {
        it("exists", function () {
            expect(theCharacter.experience).toBeDefined();
        });
        it("allows adding to the characters available experience and recalculates total experience when setting it", function () {
            theCharacter.experience.available = 100;
            expect(theCharacter.experience.available).toEqual(100);
            expect(theCharacter.experience.total).toEqual(100);
        });
        it("recalculate available experience after spending some", function () {
            theCharacter.experience.available = 500;
            var advancement = new CharacteristicAdvancement(Characteristic.characteristics.get("Agility"));
            theCharacter.experience.addAdvancement(advancement);
            expect(theCharacter.experience.total).toEqual(500);
            expect(theCharacter.experience.available).toEqual(0);
        });
    });
});
