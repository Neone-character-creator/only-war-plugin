/**
 * This service is responsible for replacing placeholder names in regiment
 * and character modifiers and replacing them with their actual object
 * representations.
 * Created by Damien on 7/9/2016.
 */

define(function () {
    return function (characteroptions, $q) {
        var placeholders = {};

        function replacePlaceholder(placeholder, source) {
            //Look for replacement object in source.
            var result = source.find(function (element) {
                return element.name === placeholder.name;
            });
            //If replacement was found, create a copy.
            if (result) {
                result = angular.copy(result);
            }
            if (placeholder.upgrades) {
                result.upgrades = placeholder.upgrades;
            }
            return result ? result : placeholder;
        }

        return $q.all({
            talents: characteroptions.talents,
            skills: characteroptions.skills,
            powers: characteroptions.powers,
            weapons: characteroptions.weapons,
            armor: characteroptions.armor,
            items: characteroptions.items,
            vehicles: characteroptions.vehicles,
            traits: characteroptions.traits
        }).then(function (characteroptions) {
            placeholders.replace = function (modifier) {
                var fixedModifiers = modifier['fixed modifiers'];
                if (fixedModifiers) {
                    var replacementSkills = {};
                    if (fixedModifiers.skills) {
                        for (skill in fixedModifiers.skills) {
                            var specialization = skill.indexOf("(") < 0 ? null : skill.substring(skill.indexOf("(") + 1, skill.indexOf(")"));
                            var baseName = skill.substring(0, skill.indexOf("(") < 0 ? skill.length : skill.indexOf("(")).trim();
                            replacementSkills[skill] = angular.copy(characteroptions.skills.find(function (element) {
                                return element.name === baseName;
                            }));
                            if (specialization) {
                                replacementSkills[skill].specialization = specialization;
                            }
                        }
                        ;
                    }

                    var replacementTraits = [];
                    if (fixedModifiers.traits) {
                        replacementTraits = fixedModifiers.traits.map(function (element) {
                            var name = element;
                            var rating = element.indexOf("(") < 0 ? null : element.substring(element.indexOf("(") + 1, element.indexOf(")"));
                            element = element.substring(0, rating ? element.indexOf("(") : element.length).trim();
                            element = angular.copy(characteroptions.traits.find(function (talent) {
                                return element === talent.name;
                            }));
                            if (!element) {
                                throw "Tried to get a trait name " + name + " but couldn't find it."
                            }
                            if (rating) {
                                element.name += " (" + rating + ")";
                                element.rating = rating;
                            }
                            return element;
                        });
                    }

                    var replacementTalents = [];
                    if (fixedModifiers.talents) {
                        replacementTalents = fixedModifiers.talents.map(function (element) {
                            var name = element;
                            var rating = element.indexOf("(") < 0 ? null : element.substring(element.indexOf("(") + 1, element.indexOf(")"));
                            element = element.substring(0, rating ? element.indexOf("(") : element.length).trim();
                            element = angular.copy(characteroptions.talents.find(function (talent) {
                                return element === talent.name;
                            }));
                            if (!element) {
                                throw "Tried to get a talent named " + name + " but couldn't find it."
                            }
                            if (rating) {
                                element.name += " (" + rating + ")";
                                element.rating = rating;
                            }
                            return element;
                        });
                    }
                    var replacementKit = [];
                    if (fixedModifiers['character kit']) {
                        replacementKit = fixedModifiers['character kit'].map(function (entry) {
                            entry.item = replacePlaceholder(entry.item, characteroptions.items.concat(characteroptions.weapons).concat(characteroptions.armor).concat(characteroptions.vehicles));
                            return entry;
                        });
                    }
                }
                var optionaModifiers = modifier['optional modifiers'];
                if (optionaModifiers) {

                }
                return modifier;
            }
            return placeholders;
        });
        return {
            replace: function (modifier) {
                $q.all([weapons, armor, items, vehicles]).then(function (results) {
                    var characterKit = fixedModifiers['character kit'];
                    var replacementMainWeapons;
                    var replacementOtherWeapons;
                    var replacementArmor;
                    var replacementOtherItems;
                    var replacementSquadKit;
                    if (characterKit) {
                        if (characterKit['main weapon']) {
                            replacementMainWeapons = characterKit['main weapon'].slice().map(function (weapon) {
                                weapon.item = replace(weapon.item, results[0]);
                                return weapon;
                            });
                        }
                        if (characterKit['standard melee weapon']) {
                            replacementOtherWeapons = characterKit['standard melee weapon'].slice().map(function (weapon) {
                                weapon.item = replace(weapon.item, results[0]);
                                return weapon;
                            });
                        }
                        if (characterKit['armor']) {
                            replacementArmor = characterKit['armor'].slice();
                            replacementArmor = replacementArmor.map(function (armor) {
                                armor.item = replace(armor.item, results[1]);
                                return armor;
                            });
                        }
                        if (characterKit['other gear']) {
                            replacementOtherItems = characterKit['other gear'].slice();
                            replacementOtherItems = replacementOtherItems.map(function (item) {
                                item.item = replace(item.item, results[2].concat(results[3]));
                                return item;
                            });
                        }
                        if (characterKit['squad kit']) {
                            replacementSquadKit = characterKit['squad kit'].slice();
                            replacementSquadKit = replacementSquadKit.map(function (item) {
                                item.item = replace(item.item, results[2].concat(results[3]));
                                return item;
                            });
                        }
                        modifierEquipment.resolve({
                            'main weapon': replacementMainWeapons,
                            'standard melee weapon': replacementOtherWeapons,
                            'armor': replacementArmor,
                            'other gear': replacementOtherItems,
                            'squad kit': replacementSquadKit
                        });
                    } else {
                        modifierEquipment.resolve(undefined);
                    }
                });
                //Optional Modifiers
                $q.all([talents, skills, weapons, armor, items]).then(function (result) {
                    $.each(optionalModifiers, function (index, element) {
                        $.each(element.options, function (index, elementOption) {
                            $.each(elementOption, function (index, option) {
                                if (Array.isArray(option.property)) {
                                    switch (option.property[0]) {
                                        case "character kit" :
                                            var name = option.value.item.name;
                                            switch (option.property[1]) {
                                                case "main weapon":
                                                case "standard melee weapon":
                                                    option.value.item = replace(option.value.item, result[2]);
                                                    break;
                                                case "armor":
                                                    option.value.item = replace(option.value.item, result[3]);
                                                    break;
                                                case "other gear":
                                                    option.value.item = replace(option.value.item, result[4]);
                                                    break;
                                            }
                                    }
                                } else {
                                    switch (option.property) {
                                        case "talents":
                                        case "traits":
                                            var name = option.value;
                                            var specialization = option.value.indexOf("(") < 0 ? null : option.value.substring(option.value.indexOf("(") + 1, option.value.indexOf(")"));
                                            option.value = option.value.substring(0, specialization ? option.value.indexOf("(") : option.value.length).trim();
                                            option.value = angular.copy(result[0].filter(function (talent) {
                                                return option.value === talent.name;
                                            })[0]);
                                            if (!option.value) {
                                                throw "Tried to get a talent name " + name + " but couldn't find it."
                                            }
                                            if (specialization) {

                                                option.value.name += " (" + specialization + ")";
                                            }
                                            if (!option.value) {
                                                throw "Tried to replace talent " + name + " in " + modifier.name + " but no talent by that name was found."
                                            }
                                            break;
                                        case "skills":
                                            break;
                                    }
                                    ;
                                }
                            });
                        });
                    });
                });

                return $q.all([modifierSkills, modifierTalents, modifierEquipment, modifierTraits]).then(function (results) {
                    results[0].promise.then(function (result) {
                        if (result) {
                            fixedModifiers['skills'] = result;
                        }
                    });
                    results[1].promise.then(function (result) {
                        if (result) {
                            fixedModifiers['talents'] = result;
                        }
                    });
                    results[2].promise.then(function (result) {
                        if (result) {
                            fixedModifiers['character kit'] = result;
                        }
                    });
                    results[3].promise.then(function (result) {
                        if (result) {
                            fixedModifiers['traits'] = result;
                        }
                    })
                    return modifier;
                });
            }
        };
    };
});