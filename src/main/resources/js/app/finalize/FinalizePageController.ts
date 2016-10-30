import {Characteristic} from "../types/character/Characteristic";
import {
    CharacteristicAdvancement, SkillAdvancement,
    TalentAdvancement, PsychicPowerAdvancement
} from "../types/character/advancements/CharacterAdvancement";
import {Aptitudes} from "../types/character/Aptitudes";
/**
 * Created by Damien on 7/29/2016.
 */
export class FinalizePageController {

    constructor($q, $scope, characterService, characterOptions, dice) {
        characterOptions.then(characterOptions=> {
            $scope.character = characterService.character;

            $scope.rollWounds = function () {
                characterService.character.wounds.rolled = dice.roll(1, 5);
            };

            $scope.rollFP = function () {
                $scope.fpRoll = dice.roll(1, 10);
                characterService.character.fatePoints = characterOptions.fatePointRolls[$scope.fpRoll];

                $scope.character = characterService.character;
            };
            $scope.availableXp = characterService.character.experience.available;
            $scope.categories = [{
                id: 1,
                value: "Characteristics"
            },
                {
                    id: 2,
                    value: "Skills"
                },
                {
                    id: 3,
                    value: "Talents"
                },
                {
                    id: 4,
                    value: "Psychic Powers"
                }
            ].filter(function (element) {
                return element.value !== "Psychic Powers" || characterService.character.traits.find(function (trait) {
                        return trait.name === "Psyker";
                    });
            });
            $scope.selectedCategory;
            $scope.options;
            $scope.displayedOption;

            function setDisplayedOptions(options) {
                $scope.options = options;
            };
            $scope.toggleDisplayedCategory = function () {
                switch ($scope.selectedCategory.value) {
                    case "Skills":
                        setDisplayedOptions(characterOptions.skills.filter(function (skill) {
                            var characterSkill = characterService.character.skills[skill.name];
                            return !characterSkill || characterSkill.advancements < 4;
                        }));
                        break;
                    case "Talents":
                        setDisplayedOptions(characterOptions.talents.filter(function (talent) {
                            return characterService.character.talents.indexOf(talent) === -1;
                        }));
                        break;
                    case "Psychic Powers":
                        setDisplayedOptions(characterOptions.powers.filter(function (power) {
                            return characterService.character.powers().all().indexOf(power) === -1;
                        }));
                        break;
                    case "Characteristics":
                        setDisplayedOptions(Array.from(Characteristic.characteristics.values()));
                        break;
                }
                ;
            };
            $scope.displayXpCost = function () {
                if ($scope.displayedOption) {
                    var matchingAptitudes = 0;
                    if ($scope.selectedCategory.value !== 'Psychic Powers') {
                        for (var a = 0; a < $scope.displayedOption.aptitudes.length; a++) {
                            if (characterService.character.aptitudes.indexOf($scope.displayedOption.aptitudes[a]) !== -1) {
                                matchingAptitudes++;
                            }
                        }
                    }
                    var advancement;
                    switch ($scope.selectedCategory.value) {
                        case "Characteristics":
                        {
                            //Characteristic.characteristics.get($)
                            advancement = new CharacteristicAdvancement($scope.displayedOption);
                            break;
                        }
                        case "Skills":
                        {
                            advancement = new SkillAdvancement($scope.displayedOption);
                            break;
                        }
                        case "Talents":
                            advancement = new SkillAdvancement($scope.displayedOption);
                            break;
                        case "Psychic Powers":
                            advancement = new PsychicPowerAdvancement($scope.displayedOption);
                            break;
                    }
                    $scope.optionXpCost = advancement.calculateExperienceCost($scope.character);
                }
            }
            $scope.buyAdvancement = function () {
                var property = [$scope.selectedCategory.value];
                var value;
                var advancement;
                switch ($scope.selectedCategory.value) {
                    case "Characteristics":
                        property.push($scope.displayedOption.name);
                        value = Characteristic.characteristics.get($scope.displayedOption.name);
                        advancement = new CharacteristicAdvancement(value);
                        break;
                    case "Skills":
                        value = (characterService.character.skills().byName($scope.displayedOption.name.toLowerCase()) | -1) + 1;
                        advancement = new SkillAdvancement(value);
                        break;
                    case "Talents":
                        value = $scope.displayedOption.name;
                        advancement = new TalentAdvancement(value);
                        break;
                }
                characterService.character.experience.addAdvancement(advancement);
                $scope.availableXp = characterService.character.experience.available;
            };
            $scope.duplicateAptitudes = characterService.character.aptitudes.filter((aptitude, index, original)=> {
                return original.indexOf(aptitude, index + 1) !== -1;
            });

            $scope.availableAptitudes = Array.from(Characteristic.characteristics.keys()).filter(function (aptitude) {
                var possessedAptitudes = characterService.character.aptitudes;
                return possessedAptitudes.indexOf(aptitude) === -1;
            });

            $scope.chosenBonusAptitudes = [];
            $scope.$watch("chosenBonusAptitudes", function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    for (var aptitude of oldValue) {
                        $scope.character.aptitudes.splice($scope.character.aptitudes.indexOf(aptitude));
                    }
                    $scope.character.aptitudes = $scope.character.aptitudes.concat(newValue);
                }
            });
        })
    }

    private $scope;
    private characterService;
    private characteroption;
    private dice;
}