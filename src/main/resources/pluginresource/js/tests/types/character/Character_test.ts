/// <reference path="../../../libs/index.d.ts" />
/**
 * Created by Damien on 7/1/2016.
 */
import {OnlyWarCharacter} from "../../../app/types/character/Character"
import {Characteristic} from "../../../app/types/character/Characteristic";
import {Regiment, RegimentBuilder} from "../../../app/types/character/Regiment";
import {Specialty, SpecialtyType, SpecialtyBuilder} from "../../../app/types/character/Specialty";
import {Talent} from "../../../app/types/character/Talent";
import {Trait} from "../../../app/types/character/Trait";
import {Item, Craftsmanship, ItemType, Availability} from "../../../app/types/character/items/Item";
import {Skill, SkillDescription} from "../../../app/types/character/Skill";
import {
    TalentAdvancement,
    CharacteristicAdvancement, SkillAdvancement, PsychicPowerAdvancement
} from "../../../app/types/character/advancements/CharacterAdvancement";
import {PsychicPower} from "../../../app/types/character/PsychicPower";
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
            var regiment = new RegimentBuilder().setCharacteristics(characteristics).build();
            theCharacter.regiment = regiment;
            expect(theCharacter.characteristics.get(Characteristic.characteristics.get("Agility")).regimentModifier).toEqual(5);
            expect(theCharacter.characteristics.get(Characteristic.characteristics.get("Agility")).total).toEqual(5);
        });
        it("must allow for adding modifiers to the characteristics from their specialty", function () {
            var characteristics = new Map<Characteristic, number>();
            characteristics.set(Characteristic.characteristics.get("Agility"), 5);
            var specialty = new SpecialtyBuilder().setSpecialtyType(SpecialtyType.Guardsman).setCharacteristics(characteristics).build();
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
            var skills = new Map<SkillDescription, number>();
            skills.set(new SkillDescription("Acrobatics", []), 1);
            var regiment = new RegimentBuilder().setSkills(skills).build();
            theCharacter.regiment = regiment;
            expect(theCharacter.skills[0].rank).toEqual(1);
        });
        it("must allow for adding modifiers to the skills from their specialty", function () {
            var skills = new Map<SkillDescription, number>();
            skills.set(new SkillDescription("Acrobatics", []), 1);
            var specialty = new SpecialtyBuilder().setSpecialtyType(SpecialtyType.Guardsman).setSkills(skills).build();
            theCharacter.specialty = specialty;
            expect(theCharacter.skills[0].rank).toEqual(1);
        });
        it("must allow adding advancements for each skill and specialization", function () {
            var advancement = new SkillAdvancement(new SkillDescription("Acrobatics", []));
            theCharacter.experience.addAdvancement(advancement);
            expect(theCharacter.skills[0].rank).toEqual(1);
        });
        it("must not allow improving a skill beyond 4 by advancement", function () {
            for (var i = 0; i < 4; i++) {
                var advancement = new SkillAdvancement(new SkillDescription("Acrobatics", []));
                theCharacter.experience.addAdvancement(advancement);
            }
            var advancement = new SkillAdvancement(new SkillDescription("Acrobatics", []));
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
            var regiment = new RegimentBuilder().setTalents(talents).build();
            theCharacter.regiment = regiment;
            expect(theCharacter.talents.indexOf(talent)).not.toEqual(-1);
        });
        it("must allow gaining talents from the character specialty.", function () {
            var talent = new Talent("Test Talent", "Test", 1, [], false);
            var talents = [talent];
            var specialty = new SpecialtyBuilder().setTalents(talents).setSpecialtyType(SpecialtyType.Guardsman).build();
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
            var regiment = new RegimentBuilder().setTraits(traits).build();
            theCharacter.regiment = regiment;
            expect(theCharacter.traits.indexOf(testTrait)).toEqual(0);
        });
        it("must allow for adding traits to the character from the specialty", function () {
            var traits = new Array<Trait>();
            var testTrait = new Trait("", "");
            traits.push(testTrait);
            var specialty = new SpecialtyBuilder().setSpecialtyType(SpecialtyType.Guardsman).setTraits(traits).build();
            theCharacter.specialty = specialty;
            expect(theCharacter.traits.indexOf(testTrait)).toEqual(0);
        });
        it("must not allow adding a trait the character already has", function () {
            var traits = new Array<Trait>();
            var testTrait = new Trait("", "");
            traits.push(testTrait);
            var regiment = new RegimentBuilder().setTraits(traits).build();
            theCharacter.regiment = regiment;
            expect(theCharacter.traits.indexOf(testTrait)).toEqual(0);
        });
    });
    describe("kit", function () {
        it("must allow for adding items from the regiment", function () {
            var item = new Item("", ItemType.Other, Availability.Abundant);
            var items:Map<Item, number> = new Map<Item, number>();
            items.set(item, 1);
            theCharacter.regiment = new RegimentBuilder().setKit(items).build();
            expect(theCharacter.kit.get(item)).toEqual(1);
        });
        it("must allow for adding items from the specialty", function () {
            var item = new Item("", ItemType.Other, Availability.Abundant);
            var items:Map<Item, number> = new Map<Item, number>();
            items.set(item, 1);
            theCharacter.specialty = new SpecialtyBuilder().setSpecialtyType(SpecialtyType.Guardsman).setKit(items).build();
            expect(theCharacter.kit.get(item)).toEqual(1);
        });
        it("must increase the count of an item when trying to add an identical item to the character", ()=> {
            var item = new Item("", ItemType.Other, Availability.Abundant);
            var items:Map<Item, number> = new Map<Item, number>();
            items.set(item, 1);
            theCharacter.specialty = new SpecialtyBuilder().setSpecialtyType(SpecialtyType.Guardsman).setKit(items).build();
            theCharacter.regiment = new RegimentBuilder().setKit(items).build();
            expect(theCharacter.kit.get(item)).toEqual(2);
        });
    });
    describe("wounds", function () {
        it("must allow for adding a modifier to wounds from the regiment", function () {
            theCharacter.regiment = new RegimentBuilder().setWounds(1).build();
            expect(theCharacter.wounds.regimentModifier).toEqual(1);
            expect(theCharacter.wounds.total).toEqual(1);
        });
        it("must allow for adding a modifier to wounds from the specialty", function () {
            theCharacter.specialty = new SpecialtyBuilder().setSpecialtyType(SpecialtyType.Guardsman).setWounds(1).build();
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
        it("allows improving the character characteristics by spending xp", function () {
            theCharacter.experience.available = 500;
            theCharacter.experience.addAdvancement(new CharacteristicAdvancement(Characteristic.characteristics.get("Agility")));
            expect(theCharacter.characteristics.get(Characteristic.characteristics.get("Agility")).total).toEqual(5);
            expect(theCharacter.experience.total).toEqual(500);
            expect(theCharacter.experience.available).toEqual(0);
        });
        it("allows removing an advancement that improves characteristics from the character, regaining the spent xp", function () {
            theCharacter.experience.available = 500;
            var advancement = new CharacteristicAdvancement(Characteristic.characteristics.get("Agility"));
            theCharacter.experience.addAdvancement(advancement);
            expect(theCharacter.characteristics.get(Characteristic.characteristics.get("Agility")).total).toEqual(5);
            expect(theCharacter.experience.total).toEqual(500);
            expect(theCharacter.experience.available).toEqual(0);
            theCharacter.experience.removeAdvancement(advancement);
            expect(theCharacter.characteristics.get(Characteristic.characteristics.get("Agility")).total).toEqual(0);
            expect(theCharacter.experience.total).toEqual(500);
            expect(theCharacter.experience.available).toEqual(500);
        });
        it("allows improving the character skills by spending xp", function () {
            theCharacter.experience.available = 300;
            theCharacter.experience.addAdvancement(new SkillAdvancement(new SkillDescription("Command", [])));
            expect(theCharacter.skills[0].rank).toEqual(1);
            expect(theCharacter.experience.total).toEqual(300);
            expect(theCharacter.experience.available).toEqual(0);
        });
        it("allows adding a talent to the character by spending xp", function () {
            theCharacter.experience.available = 600;
            theCharacter.experience.addAdvancement(new TalentAdvancement(new Talent("", "", 1, [])));
            expect(theCharacter.talents[0]).toBeDefined();
            expect(theCharacter.experience.total).toEqual(600);
            expect(theCharacter.experience.available).toEqual(0);
        });
        it("allows adding a psychic power to the character by spending xp", function () {
            theCharacter.experience.available = 100;
            theCharacter.experience.addAdvancement(new PsychicPowerAdvancement(new PsychicPower("", 100)));
            expect(theCharacter.powers.powers[0]).toBeDefined();
            expect(theCharacter.experience.total).toEqual(100);
            expect(theCharacter.experience.available).toEqual(0);
        });
        it("allows removing an advancement that gives a talent from the character, regaining the spent xp and removing the talent", function () {
            theCharacter.experience.available = 600;
            var advancement = new TalentAdvancement(new Talent("", "", 1, []));
            theCharacter.experience.addAdvancement(advancement);
            expect(theCharacter.experience.total).toEqual(600);
            expect(theCharacter.experience.available).toEqual(0);
            theCharacter.experience.removeAdvancement(advancement);
            expect(theCharacter.experience.total).toEqual(600);
            expect(theCharacter.experience.available).toEqual(600);
            expect(theCharacter.talents.length).toEqual(0);
        });
    });
    describe("psychic powers", function () {
        it("can be added to the character by spending xp", ()=> {
            theCharacter.experience.available = 200;
            var thePower = new PsychicPower("", 200);
            theCharacter.experience.addAdvancement(new PsychicPowerAdvancement(thePower));
            expect(theCharacter.experience.available).toEqual(0);
            expect(theCharacter.experience.total).toEqual(200);
        });
        it("will be paid with bonus xp if the character has enough", ()=> {
            theCharacter.powers.bonusXp = 200;
            var thePower = new PsychicPower("", 200);
            theCharacter.experience.addAdvancement(new PsychicPowerAdvancement(thePower));
            expect(theCharacter.powers.bonusXp).toEqual(0);
            expect(theCharacter.experience.total).toEqual(0);
        });
        it("can't add a power to a character that the character already has.", ()=> {
            theCharacter.experience.available = 200;
            var thePower = new PsychicPower("", 200);
            expect(theCharacter.experience.addAdvancement(new PsychicPowerAdvancement(thePower))).toEqual(true);
            expect(theCharacter.experience.addAdvancement(new PsychicPowerAdvancement(thePower))).toEqual(false);
            expect(theCharacter.powers.powers.length).toEqual(1);
        });
        it("can be removed, refunding the experience spent on it", ()=> {
            theCharacter.experience.available = 200;
            var thePower = new PsychicPower("", 200);
            var advancement = new PsychicPowerAdvancement(thePower);
            expect(theCharacter.experience.addAdvancement(advancement)).toEqual(true);
            theCharacter.experience.removeAdvancement(advancement);
            expect(theCharacter.powers.powers.length).toEqual(0);
            expect(theCharacter.experience.available).toEqual(200);
        });
        it("can be removed, refunding bonus xp if it was used to buy it.", ()=> {
            theCharacter.powers.bonusXp = 200;
            var thePower = new PsychicPower("", 200);
            var advancement = new PsychicPowerAdvancement(thePower);
            expect(theCharacter.experience.addAdvancement(advancement)).toEqual(true);
            theCharacter.experience.removeAdvancement(advancement);
            expect(theCharacter.powers.powers.length).toEqual(0);
            expect(theCharacter.powers.bonusXp).toEqual(200);
        });
    });
});
