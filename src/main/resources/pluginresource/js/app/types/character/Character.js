define(["require", "exports", "./Characteristic"], function (require, exports, Characteristic_1) {
    "use strict";
    class OnlyWarCharacter {
        constructor() {
            this._name = "";
            this._player = "";
            this._description = "";
            this._skills = new Array();
            this._talents = [];
            this._traits = [];
            this._kit = [];
            this._wounds = new WoundsContainer();
            this._criticalDamage = [];
            this._insanity = new InsanityContainer();
            this._corruption = new CorruptionContainer();
            this._speeds = new SpeedContainer(this);
            this._fatePoints = 0;
            this._aptitudes = [];
            this._powers = new PsychicPowersContainer();
            this.addModifier = function (modifier) {
                modifier.apply(this);
            };
            this._characteristics = new Map();
            for (var c of Characteristic_1.Characteristic.characteristics.values()) {
                this._characteristics.set(c, new Characteristic_1.CharacteristicValue(c));
            }
            this._experience = new ExperienceContainer(this);
        }

        get fatigue() {
            return this._fatigue;
        }

        set fatigue(value) {
            this._fatigue = value;
        }

        get name() {
            return this._name;
        }

        get player() {
            return this._player;
        }

        get description() {
            return this._description;
        }

        get regiment() {
            return this._regiment;
        }

        get specialty() {
            return this._specialty;
        }

        get characteristics() {
            return this._characteristics;
        }

        get skills() {
            return this._skills;
        }

        get talents() {
            return this._talents;
        }

        get traits() {
            return this._traits;
        }

        get kit() {
            return this._kit;
        }

        get wounds() {
            return this._wounds;
        }

        get criticalDamage() {
            return this._criticalDamage;
        }

        get insanity() {
            return this._insanity;
        }

        get corruption() {
            return this._corruption;
        }

        get speeds() {
            return this._speeds;
        }

        get fatePoints() {
            return this._fatePoints;
        }

        get experience() {
            return this._experience;
        }

        get aptitudes() {
            return this._aptitudes;
        }

        get powers() {
            return this._powers;
        }

        set name(value) {
            this._name = value;
        }

        set player(value) {
            this._player = value;
        }

        set regiment(value) {
            this._regiment = value;
            this.addModifier(value);
        }

        set description(value) {
            this._description = value;
        }

        set specialty(value) {
            this._specialty = value;
            this.addModifier(value);
        }

        set fatePoints(value) {
            this._fatePoints = value;
        }
    }
    exports.OnlyWarCharacter = OnlyWarCharacter;
    class WoundsContainer {
        constructor() {
            /**
             * The base number of wounds from rolling.
             */
            this.rolled = 0;
            /**
             * The modifier from the character specialty.
             */
            this.specialtyModifier = 0;
            /**
             * The modifier from the character regiment.
             */
            this.regimentModifier = 0;
        }
        /**
         * Return the modified wounds total, including all modifiers.
         * @returns {number}
         */
        get total() {
            return this.rolled + this.specialtyModifier + this.regimentModifier;
        }
    }
    class InsanityContainer {
        constructor() {
            /**
             * The number of insanity points.
             */
            this.points = 0;
            /**
             * The disorders the character has.
             */
            this.disorders = [];
        }
    }
    class CorruptionContainer {
        constructor() {
            /**
             * The number of corruption points the character has.
             */
            this.points = 0;
            /**
             * The malignancies the character has.
             */
            this.malignancies = [];
            /**
             * The mutations the character has.
             */
            this.mutations = [];
        }
    }
    class SpeedContainer {
        constructor(character) {
            this.character = character;
        }

        get half() {
            let agilityBonus = this.character.characteristics.get(Characteristic_1.Characteristic.characteristics.get("Agility")).bonus;
            if (agilityBonus === 0) {
                return .5;
            }
            else {
                return agilityBonus;
            }
        }

        get full() {
            let agilityBonus = this.character.characteristics.get(Characteristic_1.Characteristic.characteristics.get("Agility")).bonus;
            if (agilityBonus === 0) {
                return 1;
            }
            else {
                return agilityBonus * 2;
            }
        }

        get charge() {
            let agilityBonus = this.character.characteristics.get(Characteristic_1.Characteristic.characteristics.get("Agility")).bonus;
            if (agilityBonus === 0) {
                return 2;
            }
            else {
                return agilityBonus * 3;
            }
        }

        get run() {
            let agilityBonus = this.character.characteristics.get(Characteristic_1.Characteristic.characteristics.get("Agility")).bonus;
            if (agilityBonus === 0) {
                return 3;
            }
            else {
                return agilityBonus * 6;
            }
        }
    }
    class ExperienceContainer {
        constructor(character) {
            /**
             * The total amount of experience the character has, including both available and spent.
             * @type {number}
             * @private
             */
            this._total = 0;
            /**
             * The amount of available experience the character has to spend on advancements.
             * @type {number}
             * @private
             */
            this._available = 0;
            /**
             * The advances for the character that have already been purchased.
             * @type {Array}
             * @private
             */
            this._advances = [];
            this._character = character;
        }
        /**
         * Get the total amount of experience, including both available and spent.
         * @returns {number}
         */
        get total() {
            return this._total;
        }

        get available() {
            return this._available;
        }
        /**
         * Set the amount of available experience. If the amount is less than or equal to the current amount, the total experience
         * amount is also recalculated.
         * @param value
         */
        set available(value) {
            this._total += value - this._available;
            this._available = value;
        }

        get advancements() {
            return this._advances;
        }
        /**
         * Attempt to add the given advancement to the character. The character will determine if
         * it can add the advancement. If it can, it will add the advancement and this method will return
         * true. Else, this will return false.
         * @param advancement
         * @returns return if the advancement was added
         */
        addAdvancement(advancement) {
            switch (advancement.property) {
                case AdvanceableProperty.CHARACTERISTIC:
                    //If the characteristic already has 4 advancements, can't add another.
                    if (this._character.characteristics.get(advancement.value).advancements.length >= 4) {
                        return false;
                    }
                    break;
                case AdvanceableProperty.SKILL:
                    //If the skill already has a rating of 4, can't improve any further.
                    var existingSkill = this._character.skills.find((skill) = > {
                            return advancement.value.name === skill.name &&
                            advancement.value.specialization === skill.specialization;
            }
        )
            ;
            if (existingSkill && existingSkill.rank >= 4) {
                return false;
            }
            break;
        case
            AdvanceableProperty.TALENT
        :
            let incomingTalent = advancement.value;
            //Don't add if the character has a talent with the same name and specialization.
            if (this._character.talents.find(function (talent) {
                    return talent.name === incomingTalent.name && talent.specialization === incomingTalent.specialization;
                })) {
                return false;
            }
            break;
        }
            this._available -= advancement.calculateExperienceCost(this._character);
            this._advances.push(advancement);
            advancement.apply(this._character);
            return true;
        }

        removeAdvancement(advancement) {
            let index = this.advancements.indexOf(advancement);
            if (index) {
                this.advancements.splice(index);
            }
        }
    }
    class PsychicPowersContainer {
        constructor() {
            /**
             * The psy rating of the character.
             * @type {number}
             */
            this._psyRating = 0;
            /**
             * The psychic powers the character has.
             * @type {Array}
             */
            this._powers = [];
            /**
             * The bonus xp that the character has for purchasing psychic powers.
             * @type {number}
             */
            this._bonusXp = 0;
        }

        /**
         * Add a psychic power to the character.
         * @param power
         * @param asBonus   if the power is purchased with the psychic power bonus xp
         */
        addPower(power, asBonus) {
            if (this.powers.indexOf(power) !== -1) {
                console.log("Tried to add power " + power.name + " but ");
            }
            else {
                if (asBonus) {
                    if (this.bonusXp < power.xpCost) {
                        throw "Tried to purchase a bonus psychic power but didn't have enough bonus xp.";
                    }
                    power.isBonus = true;
                    this._bonusXp -= power.xpCost;
                }
                this.powers.push(power);
            }
        }

        removePower(power) {
            this._powers = this._powers.filter(function (wrapper) {
                return !angular.equals(wrapper.power, power);
            });
            if (power.isBonus) {
                this._bonusXp += power.xpCost;
            }
        }

        get powers() {
            return this._powers.map((wrapper) = > {
                    return wrapper.power;
        })
            ;
        }

        get bonusXp() {
            return this.bonusXp;
        }

        set bonusXp(value) {
            this.bonusXp = value;
        }

        get psyRating() {
            return this._psyRating;
        }

        set psyRating(value) {
            this._psyRating = value;
        }
    }
    class EquipmentContainer {
        constructor() {
            this.items = [];
        }

        /**
         * Add all of the items in the given array to the character kit.
         *
         * Some of these items may replace existing items
         * @param items
         */
        addItems(items) {
        }
    }
    /**
     * Wraps individual psychic powers and the sources that add them to the character.
     */
    class PsychicPowerWrapper {
        get power() {
            return this._power;
        }

        get source() {
            return this._source;
        }
    }
    /**
     *  Enumeration of the properties that advancements can improve.
     */
    (function (AdvanceableProperty) {
        AdvanceableProperty[AdvanceableProperty["CHARACTERISTIC"] = 0] = "CHARACTERISTIC";
        AdvanceableProperty[AdvanceableProperty["SKILL"] = 1] = "SKILL";
        AdvanceableProperty[AdvanceableProperty["TALENT"] = 2] = "TALENT";
        AdvanceableProperty[AdvanceableProperty["PSY_RATING"] = 3] = "PSY_RATING";
        AdvanceableProperty[AdvanceableProperty["PSYCHIC_POWER"] = 4] = "PSYCHIC_POWER";
    })(exports.AdvanceableProperty || (exports.AdvanceableProperty = {}));
    var AdvanceableProperty = exports.AdvanceableProperty;
});
//# sourceMappingURL=Character.js.map