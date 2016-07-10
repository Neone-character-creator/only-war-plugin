define(["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * A grouping of values that can be added to a Character, modifying its statistics.
     *
     * A modified can be the character's Regiment, their Specialty or an advancement bought with xp.
     * Created by Damien on 6/29/2016.
     */
    class CharacterModifier {
        constructor(characteristics, skills, talents, aptitudes, traits, kit, wounds, psyRating, type) {
            this._characteristics = characteristics;
            this._skills = skills;
            this._talents = talents;
            this._aptitudes = aptitudes;
            this._traits = traits;
            this._kit = kit;
            this._wounds = wounds;
            this._psyRating = psyRating;
            this.type = type;
        }

        apply(character) {
            this.applyCharacteristicModifiers(character);
            this.applySkillModifiers(character);
            this.applyAptitudesModifiers(character);
            this.applyKitModifiers(character);
            this.applyTalentModifiers(character);
            this.applyTraitsModifiers(character);
            this.applyWoundsModifier(character);
        }

        applyCharacteristicModifiers(character) {
            for (var characteristic of this._characteristics) {
                switch (this.type) {
                    case OnlyWarCharacterModifierTypes.REGIMENT:
                        character.characteristics.get(characteristic[0]).regimentModifier = characteristic[1];
                        break;
                    case OnlyWarCharacterModifierTypes.SPECIALTY:
                        character.characteristics.get(characteristic[0]).specialtyModifier = characteristic[1];
                        break;
                }
            }
        }
        ;

        applySkillModifiers(character) {
            for (var skill of this._skills) {
                var index = character.skills.indexOf(skill);
                if (index !== -1) {
                    character.skills[index].rank += skill.rank;
                }
                else {
                    character.skills.push(skill);
                }
            }
        }
        ;

        applyTalentModifiers(character) {
            for (var talent of this._talents) {
                character.talents.push(talent);
            }
        }

        applyAptitudesModifiers(character) {
            for (var aptitude of this._aptitudes) {
                character.aptitudes.push(aptitude);
            }
        }

        applyTraitsModifiers(character) {
            for (var trait of this._traits) {
                character.traits.push(trait);
            }
        }

        applyKitModifiers(character) {
            for (var item of this._kit) {
                character.kit.push(item);
            }
        }

        applyWoundsModifier(character) {
        }
        ;
    }
    exports.CharacterModifier = CharacterModifier;
    (function (OnlyWarCharacterModifierTypes) {
        OnlyWarCharacterModifierTypes[OnlyWarCharacterModifierTypes["REGIMENT"] = 0] = "REGIMENT";
        OnlyWarCharacterModifierTypes[OnlyWarCharacterModifierTypes["SPECIALTY"] = 1] = "SPECIALTY";
        OnlyWarCharacterModifierTypes[OnlyWarCharacterModifierTypes["ADVANCEMENT"] = 2] = "ADVANCEMENT";
    })(exports.OnlyWarCharacterModifierTypes || (exports.OnlyWarCharacterModifierTypes = {}));
    var OnlyWarCharacterModifierTypes = exports.OnlyWarCharacterModifierTypes;
    /**
     *  A portion of a modifier that consists of a set of possible values and a number of them
     *  that will be selected. After selection, the selected values will be added to the set values
     *  of the modifier.
     */
    class SelectableModifier {
        /**
         * Choose from this selection, decomposing it into the selected options.
         *
         * @param chosenIndices
         */
        makeSelection(chosenIndices) {
            if (chosenIndices.length != this.numSelectionsNeeded) {
                throw "The selection requires that " + this.numSelectionsNeeded + " selections be made but " + chosenIndices.length + " were instead.";
            }
            return this.options.filter((element, index) = > {
                    return chosenIndices.indexOf(index) !== -1;
        })
            ;
        }
    }
    exports.SelectableModifier = SelectableModifier;
});
//# sourceMappingURL=CharacterModifier.js.map