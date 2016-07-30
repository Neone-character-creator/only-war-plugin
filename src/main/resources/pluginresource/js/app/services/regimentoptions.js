define(function () {
    return function ($resource, $q, characteroptions, placeholders) {
        return placeholders.then(function (placeholders) {
            var homeworlds = $resource("pluginresource/Regiment/Creation/Homeworlds.json").query().$promise.then(function (result) {
                return $q.all(result.map(transformPlaceholders));
            });
            var officers = $resource("pluginresource/Regiment/Creation/CommandingOfficers.json").query().$promise.then(function (result) {
                return $q.all(result.map(transformPlaceholders));
            });
            var regimentTypes = $resource("pluginresource/Regiment/Creation/RegimentType.json").query().$promise.then(function (result) {
                return $q.all(result.map(transformPlaceholders));
            });
            var equipmentDoctrines = $resource("pluginresource/Regiment/Creation/Special Equipment.json").query().$promise.then(function (result) {
                return $q.all(result.map(transformPlaceholders));
            });
            var trainingDoctrines = $resource("pluginresource/Regiment/Creation/TrainingDoctrines.json").query().$promise.then(function (result) {
                return $q.all(result.map(transformPlaceholders));
            });
            var standardRegimentKit = $resource("pluginresource/Regiment/Creation/StandardRegimentalKit.json").get().$promise.then(function (result) {
                return transformPlaceholders(result);
            });
            var additionalKitChoices = $resource("pluginresource/Regiment/Creation/AdditionalKitChoices.json").query().$promise.then(function (result) {
                return result;
            });

            /** Goes through the given regiment or specialty modifier and replaces all of the placeholder skill, talent and
             equipment names with their actual object versions.
             */
            function transformPlaceholders(modifier) {
                var fixedModifiers = modifier['fixed modifiers'];
                var optionalModifiers = modifier['optional modifiers'];
                var modifierSkills = $q.defer();
                if (fixedModifiers) {
                    //Fixed Modifiers
                    if (fixedModifiers.skills) {
                        fixedModifiers.skills = Object.keys(fixedModifiers.skills).map(function (skill) {
                            return placeholders.replace(skill, "skill");
                        })
                    }
                    if (fixedModifiers.talents) {
                        fixedModifiers.talents = fixedModifiers.talents.map(function (talent) {
                            return placeholders.replace(talent, "talent");
                        })
                    }
                    if (fixedModifiers.traits) {
                        fixedModifiers.traits = fixedModifiers.traints.map(function (trait) {
                            return placeholders.replace(trait, "trait");
                        });
                    }
                    if (fixedModifiers['character kit']) {
                        fixedModifiers['character kit'] = fixedModifiers['character kit'].map(function (item) {
                            item.item = placeholders.replace(item.item, "item")
                            return item;
                        })
                    }
                }
                if (optionalModifiers) {
                    $.each(optionalModifiers, function (i, modifierChoice) {
                        modifierChoice.options.map(function (optionEntry) {
                            $.each(optionEntry, function (i, option) {
                                switch (option.property) {
                                    case "talent":
                                    case "skill":
                                    case "trait":
                                    case "item":
                                        option.value = placeholders.replace(option.value, option.property);
                                        break;
                                    case "character kit":
                                        option.value.item = placeholders.replace(option.value.item, "item");
                                        break;
                                }
                            })
                        })
                    });
                }
                return modifier;
            }

            return {
                get homeworlds() {
                    return homeworlds.then(function (result) {
                        return result.slice();
                    });
                },
                get officers() {
                    return officers.then(function (result) {
                        return result.slice();
                    });
                },
                get types() {
                    return regimentTypes.then(function (result) {
                        return result.slice();
                    });
                },
                get equipmentDoctrines() {
                    return equipmentDoctrines.then(function (result) {
                        return result.slice();
                    });
                },
                get trainingDoctrines() {
                    return trainingDoctrines.then(function (result) {
                        return result.slice();
                    });
                },
                get standardRegimentKit() {
                    return standardRegimentKit.then(function (result) {
                        return angular.copy(result);
                    });
                },
                get additionalKitChoices() {
                    return additionalKitChoices.then(function (result) {
                        return angular.copy(result);
                    })
                }
            }
        })
    }
})