/// <reference path="../../../libs/index.d.ts" />
import {Regiment, RegimentBuilder} from "../../../app/types/character/Regiment";
import {Characteristic} from "../../../app/types/character/Characteristic";
import {OnlyWarCharacter} from "../../../app/types/character/Character";
import {SkillDescription} from "../../../app/types/character/Skill";
import {Talent} from "../../../app/types/character/Talent";
import {Trait} from "../../../app/types/character/Trait";
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
});