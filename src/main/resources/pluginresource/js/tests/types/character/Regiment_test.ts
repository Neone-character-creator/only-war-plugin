/// <reference path="../../../libs/index.d.ts" />
import {Regiment, RegimentBuilder} from "../../../app/types/character/Regiment";
import {Characteristic} from "../../../app/types/character/Characteristic";
import {OnlyWarCharacter} from "../../../app/types/character/Character";
import {SkillDescription} from "../../../app/types/character/Skill";
import {Talent} from "../../../app/types/character/Talent";
import {Trait} from "../../../app/types/character/Trait";
import {Item, ItemType, Availability} from "../../../app/types/character/items/Item";
/**
 * Created by Damien on 7/24/2016.
 */
describe("A regiment", ()=> {
    var theCharacter:OnlyWarCharacter;
    beforeEach(()=> {
        theCharacter = new OnlyWarCharacter();
    });
    it("must be able to modify the characteristics of the character it is added to", ()=> {
        var characteristics = new Map<Characteristic, number>();
        characteristics.set(Characteristic.characteristics.get("Agility"), 5);
        var regiment = new RegimentBuilder().characteristics(characteristics).build();
        theCharacter.regiment = regiment;
        expect(theCharacter.characteristics.get(Characteristic.characteristics.get("Agility")).regimentModifier).toEqual(5);
        expect(theCharacter.characteristics.get(Characteristic.characteristics.get("Agility")).total).toEqual(5);
    });
    it("must correctly undo any characteristic modifiers it applied when removed", ()=> {
        var characteristics = new Map<Characteristic, number>();
        characteristics.set(Characteristic.characteristics.get("Agility"), 5);
        var regiment = new RegimentBuilder().characteristics(characteristics).build();
        theCharacter.regiment = regiment;
        expect(theCharacter.characteristics.get(Characteristic.characteristics.get("Agility")).regimentModifier).toEqual(5);
        expect(theCharacter.characteristics.get(Characteristic.characteristics.get("Agility")).total).toEqual(5);
        theCharacter.regiment = null;
        expect(theCharacter.characteristics.get(Characteristic.characteristics.get("Agility")).regimentModifier).toEqual(0);
        expect(theCharacter.characteristics.get(Characteristic.characteristics.get("Agility")).total).toEqual(0);
    });
    it("must be able to improve the skills of the character it is added to", ()=> {
        var skills = new Map<SkillDescription, number>();
        skills.set(new SkillDescription("Acrobatics", []), 1);
        var regiment = new RegimentBuilder().skills(skills).build();
        theCharacter.regiment = regiment;
        expect(theCharacter.skills.find(skill=> {
            return angular.equals(skill.identifier, new SkillDescription("Acrobatics", []))
        })).toBeDefined();
        expect(theCharacter.skills.find(skill=> {
            return angular.equals(skill.identifier, new SkillDescription("Acrobatics", []))
        }).rank).toEqual(1);
    });
    it("must correctly undo any skill modifiers it applied when removed", ()=> {
        var skills = new Map<SkillDescription, number>();
        skills.set(new SkillDescription("Acrobatics", []), 1);
        var regiment = new RegimentBuilder().skills(skills).build();
        theCharacter.regiment = regiment;
        expect(theCharacter.skills.find(skill=> {
            return angular.equals(skill.identifier, new SkillDescription("Acrobatics", []))
        })).toBeDefined();
        expect(theCharacter.skills.find(skill=> {
            return angular.equals(skill.identifier, new SkillDescription("Acrobatics", []))
        }).rank).toEqual(1);
        theCharacter.regiment = null;
        expect(theCharacter.skills.find(skill=> {
            return angular.equals(skill.identifier, new SkillDescription("Acrobatics", []))
        })).not.toBeDefined();
    });
    it("must be able to add talents to the character", ()=> {
        var talents = [new Talent("", "", 0, [], false)];
        var regiment = new RegimentBuilder().talents(talents).build();
        theCharacter.regiment = regiment;
        expect(theCharacter.talents.find(t=> {
            return t.name === "";
        })).toBeDefined();
    });
    it("must correctly remove any talents it added when removed", ()=> {
        var talents = [new Talent("", "", 0, [], false)];
        var regiment = new RegimentBuilder().talents(talents).build();
        theCharacter.regiment = regiment;
        expect(theCharacter.talents.find(t=> {
            return t.name === "";
        })).toBeDefined();
        theCharacter.regiment = null;
        expect(theCharacter.talents.find(t=> {
            return t.name === "";
        })).not.toBeDefined();
    });
    it("must be able to add traits to the character", ()=> {
        var traits = [new Trait("", "")];
        var regiment = new RegimentBuilder().traits(traits).build();
        theCharacter.regiment = regiment;
        expect(theCharacter.traits.find(t=> {
            return t.name === "";
        })).toBeDefined();
    });
    it("must correctly remove any traits it added when removed", ()=> {
        var traits = [new Trait("", "")];
        var regiment = new RegimentBuilder().traits(traits).build();
        theCharacter.regiment = regiment;
        expect(theCharacter.traits.find(t=> {
            return t.name === "";
        })).toBeDefined();
        theCharacter.regiment = null;
        expect(theCharacter.traits.find(t=> {
            return t.name === "";
        })).not.toBeDefined();
    });
    it("must correctly set the regiment modifier to wounds of the character", ()=> {
        var regiment = new RegimentBuilder().wounds(1).build();
        theCharacter.regiment = regiment;
        expect(theCharacter.wounds.total).toEqual(1);
        expect(theCharacter.wounds.regimentModifier).toEqual(1);
    });
    it("must unset the regiment modifier to wounds of the character when removed", ()=> {
        var regiment = new RegimentBuilder().wounds(1).build();
        theCharacter.regiment = regiment;
        expect(theCharacter.wounds.total).toEqual(1);
        expect(theCharacter.wounds.regimentModifier).toEqual(1);
        theCharacter.regiment = null;
        expect(theCharacter.wounds.total).toEqual(0);
        expect(theCharacter.wounds.regimentModifier).toEqual(0);
    });
    it("must be able to add aptitudes to the character", ()=> {
        var regiment = new RegimentBuilder().aptitudes(["Aptitude"]).build();
        theCharacter.regiment = regiment;
        expect(theCharacter.aptitudes.indexOf("Aptitude")).toEqual(0);
    });
    it("must correctly remove any aptitudes it added when removed", ()=> {
        var regiment = new RegimentBuilder().aptitudes(["Aptitude"]).build();
        theCharacter.regiment = regiment;
        expect(theCharacter.aptitudes.indexOf("Aptitude")).toEqual(0);
        theCharacter.regiment = null;
        expect(theCharacter.aptitudes.indexOf("Aptitude")).toEqual(-1);
    });
    it("must be able to add items to the character kit", ()=> {
        var kit = new Map<Item, number>();
        var item = new Item("", ItemType.Other, Availability.Common);
        kit.set(item, 1);
        var regiment = new RegimentBuilder().kit(kit).build();
        theCharacter.regiment = regiment;
        expect(theCharacter.kit.get(item)).toEqual(1);
    });
});