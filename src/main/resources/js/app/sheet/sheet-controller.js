define(["../types/character/advancements/CharacterAdvancement", "../types/character/Characteristic", "../types/character/items/Item"], function (Advancements, Characteristics, Item) {
    return function ($scope, characterService, characteroptions, characteristicTooltipService, armorTooltipService, $uibModal, cookies, $state, tutorials, $q) {
        $q.all({
            talents: characteroptions.talents,
            skills: characteroptions.skills,
            weapons: characteroptions.weapons,
            armor: characteroptions.armor,
            powers: characteroptions.powers
        }).then(function (characteroptions) {
                $scope.character = characterService.character;
                $scope.characteristics = Array.from($scope.character.characteristics.values());

                $scope.characteristicTooltip = function (characteristic) {
                    characteristicTooltipService.displayed = characteristic;
                }

                function updateAvailableSkills() {
                    $scope.availableSkills = characteroptions.skills.filter(function (element) {
                        for (var skill in characterService.character.skills) {
                            if (skill === element.name) {
                                return false;
                            }
                        }
                        return true;
                    });
                };
                updateAvailableSkills();

                function updateAvailableTalents() {
                    $scope.availableTalents = characteroptions.talents.filter(function (element) {
                        return character && characterService.character && characterService.character.talents && characterService.character.talents.indexOf(element) === -1;
                    });
                };
                updateAvailableTalents();
                $scope.newSkillSpecialization;

                $scope.$watch('character.skills', function () {
                    updateAvailableTalents();
                });

                $scope.$watch('character.talents.all().length', function (newVal, oldVal) {
                    updateAvailableTalents();
                });

                $scope.$watch('newSkill', function (newVal, oldVal) {
                    if (newVal) {
                        var newSkill = angular.copy($scope.availableSkills[$scope.newSkill]);
                        $scope.newSkillXpCost = new Advancements.SkillAdvancement(newSkill).calculateExperienceCost($scope.character);
                    } else {
                        $scope.newSkillXpCost = undefined;
                    }
                });

                $scope.$watch('newTalent', function (newVal) {
                    if (newVal) {
                        var newTalent = angular.copy($scope.availableTalents[$scope.newTalent]);
                        $scope.newTalentXpCost = new Advancements.TalentAdvancement(newTalent).calculateExperienceCost($scope.character);
                    } else {
                        $scope.newTalentXpCost = undefined;
                    }
                });

                $scope.addSkill = function () {
                    if ($scope.newSkill) {
                        var newSkillIdentifier = $scope.availableSkills[$scope.newSkill];
                        newSkillIdentifier.specialization = $scope.newSkillSpecialization;
                        characterService.character.experience.addAdvancement(new Advancements.SkillAdvancement(newSkillIdentifier));
                        $scope.newSkill = null;
                        updateAvailableSkills();
                    }
                };

                $scope.setSkillLevel = function (skill, newRating) {
                    if (skill && newRating >= 0) {
                        //If the new rating is an increase, add advancements.
                        if (newRating > skill.rank) {
                            for (var i = skill.rank; i <= newRating; i++) {
                                $scope.character.experience.addAdvancement(new Advancements.SkillAdvancement(skill.identifier));
                            }
                        }
                        //If the new rating is lower, attempt to remove advancements.
                        else if (newRating < skill.rank) {
                            while (newRating < skill.rank && skill.rankSources.find(function (advancement) {
                                return advancement.constructor.name === "SkillAdvancement";
                            })) {
                                $scope.character.experience.removeAdvancement(skill.rankSources.find(function (advancement) {
                                    return advancement.constructor.name === Advancements.SkillAdvancement.name;
                                }));
                            }
                        }
                        updateAvailableSkills();
                    }
                }

                $scope.newTalent;

                $scope.addTalent = function () {
                    if ($scope.newTalent) {
                        var newTalent = $scope.availableTalents[$scope.newTalent];
                        characterService.character.experience.addAdvancement(new Advancements.TalentAdvancement(newTalent));
                        updateAvailableTalents();
                    }
                }

                $scope.removeTalent = function (talent) {
                    var talentAdvancement = characterService.character.experience.advancements.find(function (advancement) {
                        return advancement.value == talent;
                    });
                    characterService.character.experience.removeAdvancement(talentAdvancement);
                    updateAvailableTalents();
                }

                $scope.criticalInjuries = characterService.character.wounds.criticalInjuries;
                $scope.newCriticalInjury;

                $scope.addCriticalInjury = function () {
                    if ($scope.newCriticalInjury) {
                        $scope.criticalInjuries.push($scope.newCriticalInjury);
                        $scope.newCriticalInjury = null;
                    }
                };

                $scope.removeCriticalInjury = function (index) {
                    $scope.criticalInjuries.splice(index, 1);
                };

                $scope.mentalDisorders = characterService.character.insanity ? characterService.character.insanity.disorders : [];
                $scope.newMentalDisorder;

                $scope.addMentalDisorder = function () {
                    if ($scope.newMentalDisorder) {
                        $scope.mentalDisorders.push($scope.newMentalDisorder);
                        $scope.newMentalDisorder = null;
                    }
                };

                $scope.removeMentalDisorder = function (index) {
                    $scope.mentalDisorders.splice(index, 1);
                };

                $scope.malignancies = characterService.character.corruption.malignancies;
                $scope.newMalignancy;

                $scope.addMalignancy = function () {
                    if ($scope.newMalignancy) {
                        $scope.malignancies.push($scope.newMalignancy);
                        $scope.newMalignancy = null;
                    }
                };

                $scope.removeMalignancy = function (index) {
                    $scope.malignancies.splice(index, 1);
                };

                $scope.mutations = characterService.character.corruption.mutations;
                $scope.newMutation;

                $scope.addMutation = function () {
                    if ($scope.newMutation) {
                        $scope.mutations.push($scope.newMutation);
                        $scope.newMutation = null;
                    }
                };

                $scope.removeMutation = function (index) {
                    $scope.mutations.splice(index, 1);
                };

                $scope.armor = {
                    locations: {
                        head: {
                            rating: 0,
                            providers: []
                        },
                        body: {
                            rating: 0,
                            providers: []
                        },
                        arms: {
                            rating: 0,
                            providers: []
                        },
                        legs: {
                            rating: 0,
                            providers: []
                        }
                    },
                    update: function () {
                        $.each(this.locations, function (i, location) {
                            location.providers = [];
                            location.rating = 0;
                        });
                        $.each(Array.from(characterService.character.kit.keys()).filter(function(i){
                            return i.type === Item.ItemType.Armor;
                        }), function (i, armor) {
                            $.each(armor.locations, function (i, location) {
                                switch (location) {
                                    case "Head":
                                        $scope.armor.locations.head.providers.push(armor);
                                        break;
                                    case "Body":
                                        $scope.armor.locations.body.providers.push(armor);
                                        break;
                                    case "Arms":
                                        $scope.armor.locations.arms.providers.push(armor);
                                        break;
                                    case "Legs":
                                        $scope.armor.locations.legs.providers.push(armor);
                                        break;
                                }
                            });
                        });
                        $.each(this.locations, function (i, location) {
                            var stackableArmor = location.providers.filter(function (armor) {
                                return armor.tags && armor.tags.contains("cybernetic");
                            });
                            var bestWornArmor = location.providers.reduce(function (previous, current) {
                                //Ignore cybernetics
                                if (current.tags && current.tags.contains("cybernetic")) {
                                    return previous;
                                } else if (!previous || previous.ap < current.ap) {
                                    return current;
                                }
                            }, null);
                            if (bestWornArmor) {
                                stackableArmor.push(bestWornArmor);
                            }
                            location.providers = stackableArmor;
                            location.rating = location.providers.reduce(function (previous, current) {
                                return previous + current.ap;
                            }, 0);
                        });
                    }
                };

                $scope.armorTooltip = function (location) {
                    armorTooltipService.location = location;
                    armorTooltipService.modifiers = $scope.armor.locations[location].providers;
                }

                $scope.$watch('character.psychicPowers.psyRating', function (newVal, oldVal) {
                    if (newVal > oldVal) {
                        for (var i = oldVal + 1; i <= newVal; i++) {
                            characterService.character.experience.addAdvancement(i * 200, "psy rating", i);
                        }
                    } else if (newVal < oldVal) {
                        var indexesToRemove = [];
                        $.each(characterService.character.experience._advancementsBought, function (index, element) {
                            if (element.property === "psy rating" && element.value > newVal) {
                                indexesToRemove.push(index);
                            }
                            ;
                        });
                        indexesToRemove = indexesToRemove.sort(function (a, b) {
                            return b - a;
                        })
                        $.each(indexesToRemove, function (index, element) {
                            characterService.character.experience.removeAdvancement(element);
                        });
                    }
                });

                var updateAvailableWeapons = function () {
                    $scope.availableWeapons = characteroptions.weapons.filter(function (element) {
                        var weapons = Array.from(characterService.character.kit.values()).filter(function (item) {
                            return item.type === "Weapon";
                        }).map(function (weapon) {
                            return weapon.item;
                        });
                        return weapons.indexOf(element) === -1;
                    });
                };
                updateAvailableWeapons();

                $scope.addNewWeapon = function () {
                    var weapon = $scope.availableWeapons[parseInt($scope.newWeapon)];
                    var existing = $scope.character.kit.get(weapon);
                    if(existing){
                        $scope.character.kit.set(weapon, existing+1);
                    } else {
                        $scope.character.kit.set(weapon, 1);
                    }
                    $scope.newWeapon = null;
                    updateAvailableWeapons();
                };
                $scope.removeWeapon = function (weapon) {
                    var existing = $scope.character.kit.get(weapon);
                    if(existing > 1){
                        $scope.character.kit.set(weapon, existing-1);
                    } else {
                        $scope.character.kit.delete(weapon);
                    }
                    $scope.newWeapon = null;
                    updateAvailableWeapons();
                }

                $scope.$watch("character.kit.armor.length", function (newVal) {
                    $scope.armor.update();
                });

                var updateAvailableArmor = function () {
                    $scope.availableArmor = characteroptions.armor.filter(function (element) {
                        var armor = Array.from(characterService.character.kit.values()).filter(function (item) {
                            return item.type === "Armor";
                        }).map(function (armor) {
                            return armor.item;
                        });
                        return armor.indexOf(element) === -1;
                    });
                };
                updateAvailableArmor();

                $scope.addNewArmor = function () {
                    var existing = $scope.character.kit.get($scope.availableArmor[$scope.newArmor]);
                    if(existing){
                        $scope.character.kit.set($scope.availableArmor[$scope.newArmor], existing+1);
                    } else {
                        $scope.character.kit.set($scope.availableArmor[$scope.newArmor],1);
                    }
                    $scope.newArmor = null;
                    updateAvailableArmor();
                };
                $scope.removeArmor = function (armor) {
                    var existing = $scope.character.kit.get(armor);
                    if(existing > 1){
                        $scope.character.kit.set(armor, existing-1);
                    } else {
                        $scope.character.kit.delete(armor);
                    }
                    $scope.newArmor = null;
                    updateAvailableArmor();
                }

                var tutorialShown = cookies.get("tutorial-shown");
                if (!tutorials.introduction) {
                    tutorials.show('introduction');
                    $state.go("modal.tutorial");
                }

                $scope.availablePowers;
                function updateAvailablePowers() {
                    $scope.availablePowers = characteroptions.powers.filter(function (power) {
                        for (var i = 0; i < $scope.character.powers.powers.length; i++) {
                            if (power.name === $scope.character.powers.powers[i].name) {
                                return false;
                            }
                        }
                        return true;
                    });
                }

                updateAvailablePowers();

                $scope.addNewPower = function () {
                    $scope.character.experience.addAdvancement(new Advancements.PsychicPowerAdvancement(angular.copy($scope.availablePowers[parseInt($scope.newPower)]), false));
                    updateAvailablePowers();
                };

                $scope.$watchCollection("character.skills", function () {
                    $scope.characterSkills = Array.from($scope.character.skills);
                });

                $scope.$watch(function(){
                    return Array.from($scope.character.kit.entries());
                }, function () {
                    $scope.characterWeapons = Array.from($scope.character.kit.keys()).filter(function (entry) {
                        return entry.type === Item.ItemType.Weapon;
                    }).map(function (entry) {
                        return entry;
                    });
                    $scope.characterArmor = Array.from($scope.character.kit.entries()).filter(function (entry) {
                        return entry[0].type === Item.ItemType.Armor;
                    }).map(function (entry) {
                        return entry[0];
                    });
                    $scope.armor.update();
                    $scope.characterOtherItems = Array.from($scope.character.kit.entries()).filter(function (entry) {
                        return entry[0].type === Item.ItemType.Other;
                    }).map(function (entry) {
                        return {item: entry[0], count: entry[1]};
                    });
                }, true);

                $scope.addCharacteristicAdvancement = function(characteristic){
                    var advancement = new Advancements.CharacteristicAdvancement(characteristic.characteristic);
                    characterService.character.experience.addAdvancement(advancement);
                }

            $scope.removeCharacteristicAdvancement = function(characteristic){
                var advancement = characterService.character.experience.advancements.find(function(a){
                       return a.value === characteristic.characteristic;
                    });
                if(advancement){
                    characterService.character.experience.removeAdvancement(advancement);
                }
            }
            }
        );
    }
});