import {CharacterAdvancement} from "./CharacterAdvancement";
import {AdvanceableProperty, OnlyWarCharacter} from "../Character";
import {Skill} from "../Skill";
import {OnlyWarCharacterModifierTypes} from "../CharacterModifier";
/**
 * Created by Damien on 6/29/2016.
 */

export class SkillAdvancement extends CharacterAdvancement {
    private skill:Skill;

    apply(character:OnlyWarCharacter) {
        var existingSkill = character.skills.find((skill)=> {
            return skill.name === this.skill.name && skill.specialization === this.skill.specialization;
        });
        if (existingSkill) {
            return existingSkill.rank++;
        } else {
            character.skills.push(this.skill);
        }
    }

    constructor(skill:Skill) {
        var skills:Array<Skill> = [skill];
        super(AdvanceableProperty.SKILL, new Map(), skills, [], [], [], [], 0, 0, OnlyWarCharacterModifierTypes.ADVANCEMENT);
        this.skill = skill;
    }

    get value():Skill {
        return this.skill;
    }

    public calculateExperienceCost(character:OnlyWarCharacter):number {
        var matchingAptitudes:number = 0;
        var existingSkillRating = character.skills.find((skill)=> {
            return this.skill.name === skill.name && this.skill.specialization === skill.specialization;
        }).rank;
        character.aptitudes.forEach((aptitude)=> {
            if (this.skill.aptitudes.indexOf(aptitude) !== -1) {
                matchingAptitudes++;
            }
        });
        return (existingSkillRating + 1) * (3 - matchingAptitudes) * 100;
    }
}