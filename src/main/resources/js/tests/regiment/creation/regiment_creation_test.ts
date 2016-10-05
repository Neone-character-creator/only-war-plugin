/// <reference path="../../../libs/globals/jasmine/index.d.ts" />
import {
    RegimentCreationModifier,
    CommandingOfficer, Homeworld, RegimentType
} from "../../../app/types/regiment/creation/RegimentCreationModifier";
import {RegimentCreationElementsContainer} from "../../../app/types/regiment/creation/RegimentCreationElementsContainer";
import {Characteristic} from "../../../app/types/character/Characteristic";
import {Talent} from "../../../app/types/character/Talent";
import {SkillDescription, Skill} from "../../../app/types/character/Skill";
import {Item, ItemType} from "../../../app/types/character/items/Item";
/**
 * Created by Damien on 8/1/2016.
 */
describe("The regiment creation container", ()=> {
    it("must correctly add together the characteristic modifiers", ()=> {
        let characteristics = new Map<Characteristic, number>();
        characteristics.set(Characteristic.characteristics.get("Agility"), 5);
        var homeworld = new Homeworld({characteristics: characteristics});
        ;

        characteristics = new Map<Characteristic, number>();
        characteristics.set(Characteristic.characteristics.get("Agility"), -3);
        var commander = new CommandingOfficer({characteristics: characteristics});
        ;
        var container = new RegimentCreationElementsContainer();
        container.homeworld.selected = homeworld;
        container.commander.selected = commander;
        container.regimentType.selected = new RegimentType({});
        ;
        expect(container.build().characteristics.get(Characteristic.characteristics.get("Agility"))).toEqual(2);
    });
    it("must combine the talents provided by all the modifiers without duplication", ()=> {
        var container = new RegimentCreationElementsContainer();
        var talent = new Talent("", "", 1, [])
        container.homeworld.selected = new Homeworld({talents: [talent]});
        ;
        container.commander.selected = new CommandingOfficer({talents: [talent]});
        ;
        container.regimentType.selected = new RegimentType({});
        ;
        expect(container.build().talents.find(t=> {
            return t === talent
        })).toBeDefined();
    });
    it("must combine the skills provided by all of the modifiers", ()=> {
        var container = new RegimentCreationElementsContainer();

        var skill = new SkillDescription("", []);
        var skills = new Map<SkillDescription, number>();
        skills.set(skill, 1)
        container.homeworld.selected = new Homeworld({skills: skills});
        ;
        skills = new Map<SkillDescription, number>();
        skills.set(skill, 1)
        container.commander.selected = new CommandingOfficer({skills: skills});
        ;
        container.regimentType.selected = new RegimentType({});
        ;
        expect(container.build().skills.get(skill)).toEqual(2);
    });
    it("must combine the talents provided by all the modifiers without duplication", ()=> {
        var container = new RegimentCreationElementsContainer();
        container.homeworld.selected = new Homeworld({aptitudes: ["Aptitude"]});
        ;
        container.commander.selected = new CommandingOfficer({aptitudes: ["Aptitude"]});
        ;
        container.regimentType.selected = new RegimentType({});
        ;
        expect(container.build().aptitudes.length).toEqual(1);
        expect(container.build().aptitudes.find(a=> {
            return a === "Aptitude";
        })).toBeDefined();
    });
    it("must correctly combine items provided by all the modifiers that have different names and craftsmanships.", ()=> {
        var container = new RegimentCreationElementsContainer();
        var kit = new Map<Item, number>();
        var theItem = new Item("", ItemType.Other, "Abundant");
        kit.set(theItem, 1);
        container.homeworld.selected = new Homeworld({kit: kit});
        ;
        container.commander.selected = new CommandingOfficer({kit: kit});
        ;
        container.regimentType.selected = new RegimentType({});
        ;
        expect(container.build().kit.get(theItem)).toEqual(2);
    });
})