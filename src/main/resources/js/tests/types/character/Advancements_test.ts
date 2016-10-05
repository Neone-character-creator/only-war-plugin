/// <reference path="../../../libs/globals/jasmine/index.d.ts" />
import {OnlyWarCharacter} from "../../../app/types/character/Character";
import {Talent} from "../../../app/types/character/Talent";
import {
    TalentAdvancement,
    CharacteristicAdvancement
} from "../../../app/types/character/advancements/CharacterAdvancement";
import {Characteristic} from "../../../app/types/character/Characteristic";
/**
 * Created by Damien on 7/17/2016.
 */
describe("Advancements", ()=> {
    it("for characteristics cost different amount of xp based on the number of previous advancements and matching aptitudes", ()=> {
        var theCharacter = new OnlyWarCharacter();
        for (var characteristic of Characteristic.characteristics.values()) {
            for (var aptitudes = 0; aptitudes <= 2; aptitudes++) {
                theCharacter = new OnlyWarCharacter();
                for (var a = 0; a < aptitudes; a++) {
                    theCharacter.aptitudes.push(characteristic.aptitudes[a]);
                }
                for (var previousAdvancements = 0; previousAdvancements < 4; previousAdvancements++) {
                    var advancement = new CharacteristicAdvancement(characteristic);
                    switch (aptitudes) {
                        case 0:
                            switch (previousAdvancements) {
                                case 0:
                                    expect(advancement.calculateExperienceCost(theCharacter)).toEqual(500);
                                    break;
                                case 1:
                                    expect(advancement.calculateExperienceCost(theCharacter)).toEqual(750);
                                    break;
                                case 2:
                                    expect(advancement.calculateExperienceCost(theCharacter)).toEqual(1000);
                                    break;
                                case 3:
                                    expect(advancement.calculateExperienceCost(theCharacter)).toEqual(2500);
                                    break;
                            }
                            break;
                        case 1:
                            expect(advancement.calculateExperienceCost(theCharacter)).toEqual((1 + previousAdvancements) * 250);
                            break;
                        case 2:
                            switch (previousAdvancements) {
                                case 0:
                                    expect(advancement.calculateExperienceCost(theCharacter)).toEqual(100);
                                    break;
                                case 1:
                                    expect(advancement.calculateExperienceCost(theCharacter)).toEqual(250);
                                    break;
                                case 2:
                                    expect(advancement.calculateExperienceCost(theCharacter)).toEqual(500);
                                    break;
                                case 3:
                                    expect(advancement.calculateExperienceCost(theCharacter)).toEqual(750);
                                    break;
                            }
                            break;
                    }
                    theCharacter.experience.addAdvancement(advancement);
                }
            }
        }
    });
    it("for talents cos different amounts of xp based on the tier of the talent and the number of matching aptitudes the character has", ()=> {
        for (var tier = 1; tier <= 3; tier++) {
            var theCharacter = new OnlyWarCharacter();
            var talent = new Talent("", "", tier, ["a", "b"]);
            for (var aptitudes = 0; aptitudes <= 2; aptitudes++) {
                theCharacter.aptitudes.push(talent.aptitudes[aptitudes - 1]);
                switch (aptitudes) {
                    case 0:
                        expect(new TalentAdvancement(talent).calculateExperienceCost(theCharacter)).toEqual((tier + 1) * 300);
                        break;
                    case 1:
                        expect(new TalentAdvancement(talent).calculateExperienceCost(theCharacter)).toEqual((tier + 1) * 150);
                        break;
                    case 2:
                        expect(new TalentAdvancement(talent).calculateExperienceCost(theCharacter)).toEqual((tier + 1) * 100);
                        break;
                }
            }
        }
    });
});