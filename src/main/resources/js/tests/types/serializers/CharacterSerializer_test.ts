/// <reference path="../../../libs/globals/jasmine/index.d.ts" />
/// <reference path="../../../libs/typemoq/dist/typemoq.d.ts" />
import {OnlyWarCharacter} from "../../../app/types/character/Character";
import {CharacterSerializer} from "../../../app/types/serializers/CharacterSerializer";
import {Characteristic} from "../../../app/types/character/Characteristic";
import {RegimentSerializer} from "../../../app/types/serializers/RegimentSerializer";
import {
    CharacteristicAdvancement,
    SkillAdvancement, TalentAdvancement, PsychicPowerAdvancement, PsyRatingAdvancement
} from "../../../app/types/character/advancements/CharacterAdvancement";
import {Serializer} from "../../../app/types/serializers/Serializer";
import {PlaceholderReplacement} from "../../../app/services/PlaceholderReplacement";
import {SpecialtySerializer} from "../../../app/types/serializers/SpecialtySerializer";
import {SkillDescription} from "../../../app/types/character/Skill";
import {Talent} from "../../../app/types/character/Talent";
import {Trait} from "../../../app/types/character/Trait";
import {Weapon} from "../../../app/types/character/items/Weapon";
import MockBehavior = TypeMoqIntern.MockBehavior;
import Times = TypeMoqIntern.Times;
import Mock = TypeMoqIntern.Mock;
import It = TypeMoqIntern.It;
import {PsychicPower} from "../../../app/types/character/PsychicPower";
import {RegimentBuilder, Regiment} from "../../../app/types/character/Regiment";
import {SpecialAbility} from "../../../app/types/regiment/SpecialAbility";
import {Item, ItemType, SpecialEquipmentCategory} from "../../../app/types/character/items/Item";
import {Armor} from "../../../app/types/character/items/Armor";
import {Prerequisite} from "../../../app/types/Prerequisite";
import {SpecialtyBuilder, Specialty, SpecialtyType} from "../../../app/types/character/Specialty";
import Spec = jasmine.Spec;
/**
 * Created by Damien on 8/19/2016.
 */
describe("The character serializer", ()=> {
    let character:OnlyWarCharacter;
    let placeholders:TypeMoq.Mock<PlaceholderReplacement>;

    let serializer:CharacterSerializer;
    beforeEach(angular.mock.inject(($q)=> {
        let serializers:Map<string,Serializer<any>> = new Map();
        placeholders = Mock.ofType(PlaceholderReplacement, MockBehavior.Strict);
        serializers.set("Regiment", new RegimentSerializer($q.resolve(placeholders.object)));
        serializers.set("Specialty", new SpecialtySerializer($q.resolve(placeholders.object)));
        character = new OnlyWarCharacter();
        let replacementItems = new Map();
        replacementItems.set("M36 Lasgun", new Weapon("M36 Lasgun", "Common", "Basic", "Las", "100m", "S/3/-", "1d10+3 E", "0", "30", "Full", ["Reliable"], 4, SpecialEquipmentCategory.MainWeapon, [], "Good"));
        replacementItems.set("Knife", new Weapon("Knife", "Common", "Melee/Thrown", "Low-Tech", "5m", "", "1d5 R", "0", "", "", [], 1, SpecialEquipmentCategory.StandardMeleeWeapon));
        replacementItems.set("Frag Grenade", new Weapon("Frag Grenade", "Common", "Thrown", "Grenade", "SBx3 m", "S/-/-", "2d10 X", "0", "1", "", ["Blast", "Ogryn"], .5));
        replacementItems.set("Krak Grenade", new Weapon("Krak Grenade", "Rare", "Thrown", "Grenade", "SBx3 m", "S/-/-", "2d10+4 E", "6", "1", "", ["Concussive (0)"], .5));
        replacementItems.set("Imperial Guard Flak Armor", new Armor("Imperial Guard Flak Armor", "Scarce", ["Left Arm", "Right Arm", "Body", "Right Leg", "Left Leg"], 3, "Flak", 8))
        replacementItems.set("Charge Pack (Basic)", new Item("Charge Pack (Basic)", ItemType.Other, "Common"));
        replacementItems.set("Uniform", new Item("Uniform", ItemType.Other, "Common"));
        replacementItems.set("Poor Weather Gear", new Item("Poor Weather Gear", ItemType.Other, "Common"));
        replacementItems.set("Rucksack", new Item("Rucksack", ItemType.Other, "Common"));
        replacementItems.set("Basic Toolkit", new Item("Basic Toolkit", ItemType.Other, "Common"));
        replacementItems.set("Mess Kit and Water Canteen", new Item("Mess Kit and Water Canteen", ItemType.Other, "Common"));
        replacementItems.set("Blanket and Sleep Bag", new Item("Blanket and Sleep Bag", ItemType.Other, "Common"));
        replacementItems.set("Rechargeable Lamp-Pack", new Item("Rechargeable Lamp-Pack", ItemType.Other, "Common"));
        replacementItems.set("Grooming Kit", new Item("Grooming Kit", ItemType.Other, "Common"));
        replacementItems.set("Dog Tags", new Item("Dog Tags", ItemType.Other, "Common"));
        replacementItems.set("Imperial Infantryman's Uplifting Primer", new Item("Imperial Infantryman's Uplifting Primer", ItemType.Other, "Common"));
        replacementItems.set("Week's Rations", new Item("Week's Rations", ItemType.Other, "Common"));
        replacementItems.set("Gas Mask", new Item("Gas Mask", ItemType.Other, "Common"));
        replacementItems.set("Micro-bead", new Item("Micro-bead", ItemType.Other, "Common"));
        replacementItems.set("Chimera Armored Transport", new Item("Chimera Armored Transport", ItemType.Other, "Common"));
        replacementItems.set("Heavy Stubber", new Weapon("Heavy Stubber", "Scarce", "Heavy", "Solid Projectile", "100m", "-/-/8", "1d10+4 I", "3", "75", "2 Full", ["Ogryn-Proof"], 30));
        placeholders.setup(x=> x.replace(It.isAny(), It.isAnyString())).returns((e, type)=> {
            switch (type) {
                case "skill":
                    switch (e.name) {
                        case "Common Lore":
                            return new SkillDescription("Common Lore", ["Intelligence", "General"], e.specialization);
                        case "Command":
                            return new SkillDescription("Command", ["Fellowship", "Leadership"]);
                        case "Linguistics":
                            return new SkillDescription("Linguistics", ["Intelligence", "General"], e.specialization);
                        case "Operate":
                            return new SkillDescription("Operate", ["Agility", "Fieldcraft"], e.specialization);
                        case "Intimidate":
                            return new SkillDescription("Intimidate", ["Strength", "Social"]);
                        case "Survival":
                            return new SkillDescription("Survival", ["Perception", "Fieldcraft"]);
                    }
                    return new SkillDescription(e.name, [], e.specialization);
                case "talent":
                    switch (e.name) {
                        case "Iron Jaw":
                            return new Talent("Iron Jaw", "core", 1, ["Toughness", "Defense"], false, new Prerequisite(
                                (character:OnlyWarCharacter)=> {
                                    return character.characteristics.get(Characteristic.characteristics.get("Toughness")).total >= 40;
                                }
                            ))
                        case "Weapon Training":
                            return new Talent("Weapon Training", "core", 1, ["General", "Finesse"], e.specialization);
                        case "Combat Formation":
                            return new Talent("Combat Formation", "core", 1, [
                                "Weapon Skill",
                                "Defense"
                            ]);
                        case "Hatred":
                            return new Talent("Hatred", "core", 1, [
                                "Weapon Skill",
                                "Social"
                            ], e.specialization);
                        case "Nerves of Steel":
                            return new Talent("Nerves of Steel", "core", 1, [
                                "Willpower",
                                "Defense"
                            ]);
                        case "Rapid Reload":
                            return new Talent("Rapid Reload", "core", 1, [
                                "Agility",
                                "Fieldcraft"
                            ])
                    }
                    return new Talent(e.name, "test", 1, ["One", "Two"], e.specialization);
                case "trait":
                    return new Trait(e.name, "", e.rating);
                case "item":
                    return replacementItems.get(e.name);
                case "power":
                    return new PsychicPower(e.name, 500);
            }
        });
        serializer = new CharacterSerializer(serializers, $q.resolve(placeholders.object), $q);
    }));
    it("must leave the character name unmodified", inject($rootScope=> {
        character.name = "test";
        let serialized = serializer.serialize("", character)
        let result;
        serializer.deserialize(serialized).then(r=> {
            result = r
        });
        $rootScope.$apply();
        expect(result.name).toEqual(character.name);
    }));
    it("must leave the character player name unmodified", inject($rootScope=> {
        character.player = "test";
        let serialized = serializer.serialize("", character)
        let result;
        serializer.deserialize(serialized).then(r=> {
            result = r
        });
        $rootScope.$apply();
        expect(result.player).toEqual(character.player);
    }));
    it("must leave the character description unmodified", inject($rootScope=> {
        character.description = "test";
        let serialized = serializer.serialize("", character)
        let result;
        serializer.deserialize(serialized).then(r=> {
            result = r
        });
        $rootScope.$apply();
        expect(result.description).toEqual(character.description);
    }));
    it("must leave the character demeanor unmodified", ()=> {
        character.demeanor = "test";
        let serialized = serializer.serialize("", character)
        let result = JSON.parse(serialized);
        expect(result._demeanor).toEqual(character.demeanor);
    });
    it("must serialize the characters rolled wounds", ()=> {
        character.wounds.rolled = 5;
        let serialized = JSON.parse(serializer.serialize("", character))
        expect(serialized._wounds.rolled).toEqual(5);
    });
    it("must deserialize the character rolled wounds", inject($rootScope=> {
        character.wounds.rolled = 5;
        let serialized = serializer.serialize("", character)
        let deserialized;
        serializer.deserialize(serialized).then(r=> {
            deserialized = r;
        });
        $rootScope.$apply();
        expect(deserialized.wounds.rolled).toEqual(5);
    }));
    it("must serialize the characters critical injuries", ()=> {
        character.wounds.criticalDamage.push("Broken Arm");
        let serialized = JSON.parse(serializer.serialize("", character))
        expect(serialized._wounds.criticalDamage[0]).toEqual("Broken Arm");
    });
    it("must deserialize the characters critical injuries", inject($rootScope=> {
        character.wounds.criticalDamage.push("Broken Arm");
        let serialized = serializer.serialize("", character)
        let deserialized;
        serializer.deserialize(serialized).then(r=> {
            deserialized = r;
        });
        $rootScope.$apply();
        expect(deserialized.wounds.criticalDamage[0]).toEqual("Broken Arm");
    }));
    it("must serialize the characters fate points", ()=> {
        character.fatePoints = 1;
        let serialized = JSON.parse(serializer.serialize("", character))
        expect(serialized._fatePoints).toEqual(1);
    });
    it("must deserialize the characters critical injuries", inject($rootScope=> {
        character.fatePoints = 1;
        let serialized = serializer.serialize("", character)
        let deserialized;
        serializer.deserialize(serialized).then(r=> {
            deserialized = r;
        });
        $rootScope.$apply();
        expect(deserialized.fatePoints).toEqual(1);
    }));
    it("must deserialize the characters critical injuries", inject($rootScope=> {
        let serialized = serializer.serialize("", character)
        let deserialized;
        serializer.deserialize(serialized).then(r=> {
            deserialized = r;
        });
        $rootScope.$apply();
        expect(deserialized.aptitudes[0]).toEqual("General");
    }));
    describe("must serialize the advancements of the character by", ()=> {
        it("serializing characteristic advancements", ()=> {
            character.experience.addAdvancement(
                new CharacteristicAdvancement(Characteristic.characteristics.get("Agility")));
            let serialized = JSON.parse(serializer.serialize("", character))
            expect(serialized._experience.advances[0]).toEqual(
                {
                    property: "characteristic",
                    value: "Agility"
                }
            )
        });
        it("deserializing and applying characteristic advancements", inject($rootScope=> {
            character.experience.addAdvancement(
                new CharacteristicAdvancement(Characteristic.characteristics.get("Agility")));
            let deserialized:OnlyWarCharacter;
            character.experience.total = 500;
            serializer.deserialize(serializer.serialize("", character)).then(r=> {
                deserialized = r;
            });
            $rootScope.$apply();
            expect(deserialized.experience.advancements.length).toEqual(1);
            expect(deserialized.experience.available).toEqual(0);
            expect(deserialized.experience.total).toEqual(500);
            expect(deserialized.characteristics.get(Characteristic.characteristics.get("Agility")).total).toEqual(5);
        }));
        it("serializing skill advancements", ()=> {
            character.experience.addAdvancement(
                new SkillAdvancement(new SkillDescription("Skill", []))
            );
            let serialized = JSON.parse(serializer.serialize("", character))
            expect(serialized._experience.advances[0]).toEqual(
                {
                    property: "skill",
                    value: {
                        "name": "Skill"
                    }
                }
            );
        });
        it("deserializing and applying skill advancements", inject($rootScope=> {
            character.experience.addAdvancement(
                new SkillAdvancement(new SkillDescription("Skill", []))
            );
            let deserialized;
            character.experience.total = 300;
            serializer.deserialize(serializer.serialize("", character)).then(r=> {
                deserialized = r;
            });
            $rootScope.$apply();
            expect(deserialized.experience.advancements.length).toEqual(1);
            expect(deserialized.experience.available).toEqual(0);
            expect(deserialized.experience.total).toEqual(300);
        }));
        it("serializing talent advancements", ()=> {
            character.experience.addAdvancement(
                new TalentAdvancement(new Talent("Talent", "test", 1, ["One", "Two"]))
            );
            let serialized = JSON.parse(serializer.serialize("", character))
            expect(serialized._experience.advances[0]).toEqual(
                {
                    property: "talent",
                    value: {
                        "name": "Talent"
                    }
                }
            );
        });
        it("deserializing and applying talent advancements", inject($rootScope=> {
            character.experience.addAdvancement(
                new TalentAdvancement(new Talent("Talent", "test", 1, ["One", "Two"]))
            );
            let deserialized:OnlyWarCharacter;
            character.experience.total = 600;
            serializer.deserialize(serializer.serialize("", character)).then(r=> {
                deserialized = r;
            });
            $rootScope.$apply();
            expect(deserialized.experience.advancements.length).toEqual(1);
            expect(deserialized.talents[0]).toEqual(new Talent("Talent", "test", 1, ["One", "Two"]));
            expect(deserialized.experience.available).toEqual(0);
            expect(deserialized.experience.total).toEqual(600);
        }));
        it("serializing talent advancements", ()=> {
            character.experience.addAdvancement(
                new TalentAdvancement(new Talent("Talent", "test", 1, ["One", "Two"]))
            );
            let serialized = JSON.parse(serializer.serialize("", character))
            expect(serialized._experience.advances[0]).toEqual(
                {
                    property: "talent",
                    value: {
                        "name": "Talent"
                    }
                }
            );
        });
        it("deserializing and applying talent advancements", inject($rootScope=> {
            character.experience.addAdvancement(
                new TalentAdvancement(new Talent("Talent", "test", 1, ["One", "Two"]))
            );
            let deserialized:OnlyWarCharacter;
            character.experience.total = 600;
            serializer.deserialize(serializer.serialize("", character)).then(r=> {
                deserialized = r;
            });
            $rootScope.$apply();
            expect(deserialized.experience.advancements.length).toEqual(1);
            expect(deserialized.talents[0]).toEqual(new Talent("Talent", "test", 1, ["One", "Two"]));
            expect(deserialized.experience.available).toEqual(0);
            expect(deserialized.experience.total).toEqual(600);
        }));
        it("serializing psychic power advancements", ()=> {
            character.experience.addAdvancement(
                new PsychicPowerAdvancement(new PsychicPower("Power", 500))
            );
            let serialized = JSON.parse(serializer.serialize("", character))
            expect(serialized._experience.advances[0]).toEqual(
                {
                    property: "power",
                    value: {
                        name: "Power"
                    }
                }
            );
        });
        it("deserializing and applying psychic power advancements", inject($rootScope=> {
            character.experience.addAdvancement(
                new TalentAdvancement(new Talent("Talent", "test", 1, ["One", "Two"]))
            );
            let deserialized:OnlyWarCharacter;
            character.experience.total = 600;
            serializer.deserialize(serializer.serialize("", character)).then(r=> {
                deserialized = r;
            });
            $rootScope.$apply();
            expect(deserialized.experience.advancements.length).toEqual(1);
            expect(deserialized.talents[0]).toEqual(new Talent("Talent", "test", 1, ["One", "Two"]));
            expect(deserialized.experience.available).toEqual(0);
            expect(deserialized.experience.total).toEqual(600);
        }));
        it("serializing psy rating advancements", ()=> {
            character.experience.addAdvancement(
                new PsyRatingAdvancement()
            );
            let serialized = JSON.parse(serializer.serialize("", character))
            expect(serialized._experience.advances[0]).toEqual(
                {
                    property: "psy rating",
                    value: 1
                }
            );
        });
        it("deserializing and applying psy rating advancements", inject($rootScope=> {
            character.experience.addAdvancement(
                new PsyRatingAdvancement()
            );
            character.experience.total = 200;
            let deserialized:OnlyWarCharacter;
            serializer.deserialize(serializer.serialize("", character)).then(r=> {
                deserialized = r;
            });
            $rootScope.$apply();
            expect(deserialized.experience.advancements.length).toEqual(1);
            expect(deserialized.powers.psyRating).toEqual(1);
            expect(deserialized.experience.available).toEqual(0);
            expect(deserialized.experience.total).toEqual(200);
        }));
    });
    it("can serialize a complete character", ()=> {
        let regimentCharacteristics:Map<Characteristic, number> = new Map();
        regimentCharacteristics.set(Characteristic.characteristics.get("Agility"), 3);
        regimentCharacteristics.set(Characteristic.characteristics.get("Ballistic Skill"), 3);
        regimentCharacteristics.set(Characteristic.characteristics.get("Perception"), -3);
        regimentCharacteristics.set(Characteristic.characteristics.get("Willpower"), 3);

        let regimentAptitudes:Array<string> = ["Willpower"];

        let regimentSkills:Map<SkillDescription, number> = new Map();
        regimentSkills.set(new SkillDescription("Command", ["Fellowship", "Leadership"]), 1);
        regimentSkills.set(new SkillDescription("Common Lore", ["Intelligence", "General"], "Imperial Guard"), 1);
        regimentSkills.set(new SkillDescription("Common Lore", ["Intelligence", "General"], "Imperium"), 1);
        regimentSkills.set(new SkillDescription("Common Lore", ["Intelligence", "General"], "War"), 1);
        regimentSkills.set(new SkillDescription("Linguistics", ["Intelligence", "General"], "Low Gothic"), 1);
        regimentSkills.set(new SkillDescription("Operate", ["Agility", "Fieldcraft"], "Surface"), 1);

        let regimentTalents:Array<Talent> = [
            new Talent("Combat Formation", "core", 1, [
                "Weapon Skill",
                "Defense"
            ]),
            new Talent("Hatred", "core", 1, [
                "Weapon Skill",
                "Social"
            ], "Servants of Chaos"),
            new Talent("Nerves of Steel", "core", 1, [
                "Willpower",
                "Defense"
            ]),
            new Talent("Rapid Reload", "core", 1, [
                "Agility",
                "Fieldcraft"
            ])
        ];

        let regimentSpecialAbilities:Array<SpecialAbility> = [
            new SpecialAbility("Bred For War", ""),
            new SpecialAbility("Hated Enemy", ""),
        ];

        let regimentKit:Map<Item, number> = new Map();
        regimentKit.set(new Weapon("M36 Lasgun", "Common", "Basic", "Las", "100m", "S/3/-", "1d10+3 E", "0", "30", "Full", ["Reliable"], 4, SpecialEquipmentCategory.MainWeapon, [], "Good"), 1);
        regimentKit.set(new Weapon("Knife", "Common", "Melee/Thrown", "Low-Tech", "5m", "", "1d5 R", "0", "", "", [], 1, SpecialEquipmentCategory.StandardMeleeWeapon), 1);
        regimentKit.set(new Weapon("Frag Grenade", "Common", "Thrown", "Grenade", "SBx3 m", "S/-/-", "2d10 X", "0", "1", "", ["Blast", "Ogryn"], .5), 2);
        regimentKit.set(new Weapon("Krak Grenade", "Rare", "Thrown", "Grenade", "SBx3 m", "S/-/-", "2d10+4 E", "6", "1", "", ["Concussive (0)"], .5), 2);
        regimentKit.set(new Armor("Imperial Guard Flak Armor", "Scarce", ["Left Arm", "Right Arm", "Body", "Right Leg", "Left Leg"], 3, "Flak", 8), 1)
        regimentKit.set(new Item("Charge Pack (Basic)", ItemType.Other, "Common"), 4);
        regimentKit.set(new Item("Uniform", ItemType.Other, "Common"), 1);
        regimentKit.set(new Item("Poor Weather Gear", ItemType.Other, "Common"), 1);
        regimentKit.set(new Item("Rucksack", ItemType.Other, "Common"), 1);
        regimentKit.set(new Item("Basic Toolkit", ItemType.Other, "Common"), 1);
        regimentKit.set(new Item("Mess Kit and Water Canteen", ItemType.Other, "Common"), 1);
        regimentKit.set(new Item("Blanket and Sleep Bag", ItemType.Other, "Common"), 1);
        regimentKit.set(new Item("Rechargeable Lamp-Pack", ItemType.Other, "Common"), 1);
        regimentKit.set(new Item("Grooming Kit", ItemType.Other, "Common"), 1);
        regimentKit.set(new Item("Dog Tags", ItemType.Other, "Common"), 1);
        regimentKit.set(new Item("Imperial Infantryman's Uplifting Primer", ItemType.Other, "Common"), 1);
        regimentKit.set(new Item("Week's Rations", ItemType.Other, "Common"), 1);
        regimentKit.set(new Item("Gas Mask", ItemType.Other, "Common"), 1);
        regimentKit.set(new Item("Micro-bead", ItemType.Other, "Common"), 1);
        regimentKit.set(new Item("Chimera Armored Transport", ItemType.Other, "Common"), 1);

        let favoredWeapons:Map<string, Array<Weapon>> = new Map();
        favoredWeapons.set("heavy", [
            new Weapon("Autocannon", "Very Rate", "Heavy", "Solid Projectile", "300m", "S/3/-", "3d10+8 I", "6", "20", "2 Full", ["Ogryn-Proof", "Reliable"], 40)
        ]);
        favoredWeapons.set("basic", [
            new Weapon("Grenade Launcher", "Average", "Basic", "Launcher", "60m", "S/-/-", "By Ammunition", "By Ammunition", "6", "2 Full", ["By Ammunition"], 12)
        ])

        let regiment:Regiment = new RegimentBuilder()
            .setName("Cadian 99th Mechanized Infantry")
            .setCharacteristics(regimentCharacteristics)
            .setAptitudes(regimentAptitudes)
            .setSkills(regimentSkills)
            .setTalents(regimentTalents)
            .setWounds(0)
            .setKit(regimentKit)
            .setFavoredWeapons(favoredWeapons)
            .build();

        let specialtyCharacteristics:Map<Characteristic, number> = new Map();
        specialtyCharacteristics.set(Characteristic.characteristics.get("Toughness"), 5);

        let specialtyAptitudes:Array<string> = [
            "Ballistic Skill",
            "Defense",
            "Fellowship",
            "Offense",
            "Perception",
            "Toughness"
        ];

        let specialtySkills:Map<SkillDescription, number> = new Map();
        specialtySkills.set(new SkillDescription("Common Lore", ["Intelligence", "General"], "Imperial Guard"), 1);
        specialtySkills.set(new SkillDescription("Common Lore", ["Intelligence", "General"], "War"), 1);
        specialtySkills.set(new SkillDescription("Intimidate", ["Strength", "Social"]), 1);
        specialtySkills.set(new SkillDescription("Survival", ["Perception", "Fieldcraft"]), 1);

        let specialtyTalent:Array<Talent> = [
            new Talent("Iron Jaw", "core", 1, ["Toughness", "Defense"], false, new Prerequisite(
                (character:OnlyWarCharacter)=> {
                    return character.characteristics.get(Characteristic.characteristics.get("Toughness")).total >= 40;
                }
            )),
            new Talent("Weapon Training", "core", 1, ["General", "Finesse"], "Las"),
            new Talent("Weapon Training", "core", 1, ["General", "Finesse"], "Bolt"),
            new Talent("Weapon Training", "core", 1, ["General", "Finesse"], "Chain"),
            new Talent("Weapon Training", "core", 1, ["General", "Finesse"], "Flame")
        ];

        let specialtyKit:Map<Item, number> = new Map();
        specialtyKit.set(new Weapon("Heavy Stubber", "Scarce", "Heavy", "Solid Projectile", "100m", "-/-/8", "1d10+4 I", "3", "75", "2 Full", ["Ogryn-Proof"], 30));

        let specialty:Specialty = new SpecialtyBuilder()
            .setSpecialtyType(SpecialtyType.Guardsman)
            .setCharacteristics(specialtyCharacteristics)
            .setAptitudes(specialtyAptitudes)
            .setSkills(specialtySkills)
            .setWounds(10)
            .setKit(specialtyKit)
            .build();

        let character = new OnlyWarCharacter();
        character.name = "Character Name";
        character.demeanor = "Demeanor";
        character.description = "Description";
        character.regiment = regiment;
        character.specialty = specialty;
        character.characteristics.forEach((v)=> {
            v.rolled = 20;
        });

        let serialized:string = serializer.serialize("", character)
        let parsed = JSON.parse(serialized);

        expect(parsed._characteristics.find((e)=> {
            return e.name == "Weapon Skill"
        }).rolled).toEqual(20);
        expect(parsed._characteristics.find((e)=> {
            return e.name == "Ballistic Skill"
        }).rolled).toEqual(20);
        expect(parsed._characteristics.find((e)=> {
            return e.name == "Strength"
        }).rolled).toEqual(20);
        expect(parsed._characteristics.find((e)=> {
            return e.name == "Agility"
        }).rolled).toEqual(20);
        expect(parsed._characteristics.find((e)=> {
            return e.name == "Toughness"
        }).rolled).toEqual(20);
        expect(parsed._characteristics.find((e)=> {
            return e.name == "Perception"
        }).rolled).toEqual(20);
        expect(parsed._characteristics.find((e)=> {
            return e.name == "Willpower"
        }).rolled).toEqual(20);
        expect(parsed._characteristics.find((e)=> {
            return e.name == "Fellowship"
        }).rolled).toEqual(20);
        expect(parsed._characteristics.find((e)=> {
            return e.name == "Intelligence"
        }).rolled).toEqual(20);
    });
    it("can deserialize a complete character", inject($rootScope=> {
        let regimentCharacteristics:Map<Characteristic, number> = new Map();
        regimentCharacteristics.set(Characteristic.characteristics.get("Agility"), 3);
        regimentCharacteristics.set(Characteristic.characteristics.get("Ballistic Skill"), 3);
        regimentCharacteristics.set(Characteristic.characteristics.get("Perception"), -3);
        regimentCharacteristics.set(Characteristic.characteristics.get("Willpower"), 3);

        let regimentAptitudes:Array<string> = ["Willpower"];

        let regimentSkills:Map<SkillDescription, number> = new Map();
        regimentSkills.set(new SkillDescription("Command", ["Fellowship", "Leadership"]), 1);
        regimentSkills.set(new SkillDescription("Common Lore", ["Intelligence", "General"], "Imperial Guard"), 1);
        regimentSkills.set(new SkillDescription("Common Lore", ["Intelligence", "General"], "Imperium"), 1);
        regimentSkills.set(new SkillDescription("Common Lore", ["Intelligence", "General"], "War"), 1);
        regimentSkills.set(new SkillDescription("Linguistics", ["Intelligence", "General"], "Low Gothics"), 1);
        regimentSkills.set(new SkillDescription("Operate", ["Agility", "Fieldcraft"], "Surface"), 1);

        let regimentTalents:Array<Talent> = [
            new Talent("Combat Formation", "core", 1, [
                "Weapon Skill",
                "Defense"
            ]),
            new Talent("Hatred", "core", 1, [
                "Weapon Skill",
                "Social"
            ], "Servants of Chaos"),
            new Talent("Nerves of Steel", "core", 1, [
                "Willpower",
                "Defense"
            ]),
            new Talent("Rapid Reload", "core", 1, [
                "Agility",
                "Fieldcraft"
            ])
        ];

        let regimentSpecialAbilities:Array<SpecialAbility> = [
            new SpecialAbility("Bred For War", ""),
            new SpecialAbility("Hated Enemy", ""),
        ];

        let regimentKit:Map<Item, number> = new Map();
        regimentKit.set(new Weapon("M36 Lasgun", "Common", "Basic", "Las", "100m", "S/3/-", "1d10+3 E", "0", "30", "Full", ["Reliable"], 4, SpecialEquipmentCategory.MainWeapon, [], "Good"), 1);
        regimentKit.set(new Weapon("Knife", "Common", "Melee/Thrown", "Low-Tech", "5m", "", "1d5 R", "0", "", "", [], 1, SpecialEquipmentCategory.StandardMeleeWeapon), 1);
        regimentKit.set(new Weapon("Frag Grenade", "Common", "Thrown", "Grenade", "SBx3 m", "S/-/-", "2d10 X", "0", "1", "", ["Blast", "Ogryn"], .5), 2);
        regimentKit.set(new Weapon("Krak Grenade", "Rare", "Thrown", "Grenade", "SBx3 m", "S/-/-", "2d10+4 E", "6", "1", "", ["Concussive (0)"], .5), 2);
        regimentKit.set(new Armor("Imperial Guard Flak Armor", "Scarce", ["Left Arm", "Right Arm", "Body", "Right Leg", "Left Leg"], 3, "Flak", 8), 1)
        regimentKit.set(new Item("Charge Pack (Basic)", ItemType.Other, "Common"), 4);
        regimentKit.set(new Item("Uniform", ItemType.Other, "Common"), 1);
        regimentKit.set(new Item("Poor Weather Gear", ItemType.Other, "Common"), 1);
        regimentKit.set(new Item("Rucksack", ItemType.Other, "Common"), 1);
        regimentKit.set(new Item("Basic Toolkit", ItemType.Other, "Common"), 1);
        regimentKit.set(new Item("Mess Kit and Water Canteen", ItemType.Other, "Common"), 1);
        regimentKit.set(new Item("Blanket and Sleep Bag", ItemType.Other, "Common"), 1);
        regimentKit.set(new Item("Rechargeable Lamp-Pack", ItemType.Other, "Common"), 1);
        regimentKit.set(new Item("Grooming Kit", ItemType.Other, "Common"), 1);
        regimentKit.set(new Item("Dog Tags", ItemType.Other, "Common"), 1);
        regimentKit.set(new Item("Imperial Infantryman's Uplifting Primer", ItemType.Other, "Common"), 1);
        regimentKit.set(new Item("Week's Rations", ItemType.Other, "Common"), 1);
        regimentKit.set(new Item("Gas Mask", ItemType.Other, "Common"), 1);
        regimentKit.set(new Item("Micro-bead", ItemType.Other, "Common"), 1);
        regimentKit.set(new Item("Chimera Armored Transport", ItemType.Other, "Common"), 1);

        let favoredWeapons:Map<string, Array<Weapon>> = new Map();
        favoredWeapons.set("heavy", [
            new Weapon("Autocannon", "Very Rate", "Heavy", "Solid Projectile", "300m", "S/3/-", "3d10+8 I", "6", "20", "2 Full", ["Ogryn-Proof", "Reliable"], 40)
        ]);
        favoredWeapons.set("basic", [
            new Weapon("Grenade Launcher", "Average", "Basic", "Launcher", "60m", "S/-/-", "By Ammunition", "By Ammunition", "6", "2 Full", ["By Ammunition"], 12)
        ])

        let regiment:Regiment = new RegimentBuilder()
            .setName("Cadian 99th Mechanized Infantry")
            .setCharacteristics(regimentCharacteristics)
            .setAptitudes(regimentAptitudes)
            .setSkills(regimentSkills)
            .setTalents(regimentTalents)
            .setWounds(0)
            .setKit(regimentKit)
            .setFavoredWeapons(favoredWeapons)
            .build();

        let specialtyCharacteristics:Map<Characteristic, number> = new Map();
        specialtyCharacteristics.set(Characteristic.characteristics.get("Toughness"), 5);

        let specialtyAptitudes:Array<string> = [
            "Ballistic Skill",
            "Defense",
            "Fellowship",
            "Offense",
            "Perception",
            "Toughness"
        ];

        let specialtySkills:Map<SkillDescription, number> = new Map();
        specialtySkills.set(new SkillDescription("Common Lore", ["Intelligence", "General"], "Imperial Guard"), 1);
        specialtySkills.set(new SkillDescription("Common Lore", ["Intelligence", "General"], "War"), 1);
        specialtySkills.set(new SkillDescription("Intimidate", ["Strength", "Social"]), 1);
        specialtySkills.set(new SkillDescription("Survival", ["Perception", "Fieldcraft"]), 1);

        let specialtyTalent:Array<Talent> = [
            new Talent("Iron Jaw", "core", 1, ["Toughness", "Defense"], false, new Prerequisite(
                (character:OnlyWarCharacter)=> {
                    return character.characteristics.get(Characteristic.characteristics.get("Toughness")).total >= 40;
                }
            )),
            new Talent("Weapon Training", "core", 1, ["General", "Finesse"], "Las"),
            new Talent("Weapon Training", "core", 1, ["General", "Finesse"], "Bolt"),
            new Talent("Weapon Training", "core", 1, ["General", "Finesse"], "Chain"),
            new Talent("Weapon Training", "core", 1, ["General", "Finesse"], "Flame")
        ];

        let specialtyKit:Map<Item, number> = new Map();
        specialtyKit.set(new Weapon("Heavy Stubber", "Scarce", "Heavy", "Solid Projectile", "100m", "-/-/8", "1d10+4 I", "3", "75", "2 Full", ["Ogryn-Proof"], 30));

        let specialty:Specialty = new SpecialtyBuilder()
            .setSpecialtyType(SpecialtyType.Guardsman)
            .setCharacteristics(specialtyCharacteristics)
            .setAptitudes(specialtyAptitudes)
            .setSkills(specialtySkills)
            .setWounds(10)
            .setKit(specialtyKit)
            .build();

        let character = new OnlyWarCharacter();
        character.regiment = regiment;
        character.specialty = specialty;
        character.characteristics.forEach((v)=> {
            v.rolled = 20;
        });

        let serialized:string = serializer.serialize("", character)
        let deserialized:OnlyWarCharacter;
        serializer.deserialize(serialized).then((result)=> {
            deserialized = result;
        });
        $rootScope.$apply();
        expect(deserialized.name).toEqual(character.name);
        expect(deserialized.player).toEqual(character.player);
        expect(deserialized.description).toEqual(character.description);
        expect(deserialized.demeanor).toEqual(character.demeanor);
        expect(deserialized.characteristics).toEqual(character.characteristics);
        expect(deserialized.talents).toEqual(character.talents);
        expect(deserialized.skills.length).toEqual(character.skills.length);
        character.skills.forEach(s=>{
            let deserializedSkill = deserialized.skills.find(e=>{
                return angular.equals(e.identifier, s.identifier);
            });
            expect(deserializedSkill.rank).toEqual(s.rank);
            expect(deserializedSkill.rankSources.length).toEqual(s.rankSources.length);
        });
        deserialized.aptitudes.sort();
        character.aptitudes.sort();
        expect(deserialized.aptitudes).toEqual(character.aptitudes);
        expect(deserialized.kit).toEqual(character.kit);
        expect(deserialized.experience.total).toEqual(character.experience.total);
        expect(deserialized.experience.available).toEqual(character.experience.available);
        expect(deserialized.speeds.charge).toEqual(character.speeds.charge);
        expect(deserialized.speeds.full).toEqual(character.speeds.full);
        expect(deserialized.speeds.half).toEqual(character.speeds.half);
        expect(deserialized.speeds.run).toEqual(character.speeds.run);

        //Have to compare fields individually, comparing by object gives inexplicable failures.
        expect(deserialized.regiment.favoredWeapons).toEqual(character.regiment.favoredWeapons);
        expect(deserialized.regiment.name).toEqual(character.regiment.name);
        expect(deserialized.regiment.optionalModifiers).toEqual(character.regiment.optionalModifiers);
        expect(deserialized.regiment.specialAbilities).toEqual(character.regiment.specialAbilities);
        expect(deserialized.regiment.aptitudes).toEqual(character.regiment.aptitudes);
        expect(deserialized.regiment.characteristics).toEqual(character.regiment.characteristics);
        expect(deserialized.regiment.kit).toEqual(character.regiment.kit);
        expect(deserialized.regiment.psyRating).toEqual(character.regiment.psyRating);
        expect(deserialized.regiment.skills).toEqual(character.regiment.skills);
        expect(deserialized.regiment.talents).toEqual(character.regiment.talents);
        expect(deserialized.regiment.traits).toEqual(character.regiment.traits);
        expect(deserialized.regiment.type).toEqual(character.regiment.type);
        expect(deserialized.regiment.wounds).toEqual(character.regiment.wounds);

        expect(deserialized.specialty.name).toEqual(character.specialty.name);
        expect(deserialized.specialty.optionalModifiers).toEqual(character.specialty.optionalModifiers);
        expect(deserialized.specialty.characteristics).toEqual(character.specialty.characteristics);
        expect(deserialized.specialty.kit).toEqual(character.specialty.kit);
        expect(deserialized.specialty.psyRating).toEqual(character.specialty.psyRating);
        expect(deserialized.specialty.skills).toEqual(character.specialty.skills);
        expect(deserialized.specialty.talents).toEqual(character.specialty.talents);
        expect(deserialized.specialty.traits).toEqual(character.specialty.traits);
        expect(deserialized.specialty.type).toEqual(character.specialty.type);
        expect(deserialized.specialty.wounds).toEqual(character.specialty.wounds);
        expect(deserialized.specialty.specialtyType).toEqual(deserialized.specialty.specialtyType);
    }));
});