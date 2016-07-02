import {CharacterAdvancement} from "./CharacterAdvancement";
import {AdvanceableProperty, OnlyWarCharacter} from "../Character";
import {Skill} from "../Skill";
import {OnlyWarCharacterModifierTypes} from "../CharacterModifier";
/**
 * Created by Damien on 6/29/2016.
 */

export class SkillAdvancement extends CharacterAdvancement {
    private skill:[string,string];

    apply(character:OnlyWarCharacter) {
        let existingSkill = (<Map<[string,string],Skill>>character.skills).get(this.value);
        if (existingSkill) {
            existingSkill.rank += 1
        } else {
            existingSkill = new Skill(this.value[0], 1, this.value[1]);
            character.skills.set(this.value, existingSkill);
        }
    }

    constructor(skillAndSpecialization:[string,string]) {
        var skills = new Map();
        skills.set(skillAndSpecialization, 1);
        super(AdvanceableProperty.SKILL, skills, new Map(), [], [], [], [], 0, 0, OnlyWarCharacterModifierTypes.ADVANCEMENT);
        this.skill = skillAndSpecialization;
    }

    get value():[string,string] {
        return this.skill;
    }
}