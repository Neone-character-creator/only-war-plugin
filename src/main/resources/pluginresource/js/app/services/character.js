/*
Service for the character currently being created.

character() returns the current character.
refresh() replaces the current character with a new one.
*/
define(function() {
    return function($q) {
    	//A single characteristic value.
        function Characteristic(name) {
        	//The amount that the value increases for each advancement purchased for it
            var _perAdvancementBonus = 5;
            return {
                name: name,
                //The base rolled value
                rolled: 0,
                //Bonus from character specialty
                specialty: 0,
                //Bonust from character regiment
                regiment: 0,
                //Number of advancements applied
                advancements: 0,
                get total() {
                    return Number.parseInt(this.rolled) + this.specialty + this.regiment + (this.advancements * _perAdvancementBonus);
                }
            }
        };
		//A skill a character has
        function Skill(name, rating) {
            var _name = name;
            //The number of advancements of the skill
            var _advancements = rating | 0;
            return {
                name: function() {
                    return _name;
                },
                set advancements(value) {
                        _advancements = value;
                },
                get advancements(){
                        return _advancements;
                }
            }
        }
        /*A purchased advancement. Cost is the amount of spent xp, property is the property the advancement improves
        and the value is the added value.

        The property names and values depend on what on the character is modified.
        For a characteristic, the property is 'characteristics[name]' and the value is the number of advancements added.
        For a skill, the property is 'skills[name]' and the value is the number of advancements added.
        For a talent, the property is 'talents' and the value is the talent object.
        For a psychic power, the property is 'psychic power' and the value is the power object.
        For psy rating, the property is 'psy rating' and the value is the amount it increases.
        */
        Advancement = function(cost, property, value) {
            return {
                cost: cost,
                property: property,
                value: value
            };
        };

        var OnlyWarCharacter = function(original) {
            var _regiment = null;
            var _specialty = null;
            var _characteristics = [
                new Characteristic("weapon skill"),
                new Characteristic("ballistic skill"),
                new Characteristic("strength"),
                new Characteristic("toughness"),
                new Characteristic("agility"),
                new Characteristic("intelligence"),
                new Characteristic("perception"),
                new Characteristic("willpower"),
                new Characteristic("fellowship")
            ].reduce(function(previous, current, index, input) {
                previous[current.name] = current;
                return previous;
            }, {})
            var _skills = {
            	skills : {},
                add: function(name, rating) {
                    if (this.skills[name] !== undefined) {
                        console.log("Tried to add a skill named " + name + " but " + this.name + " already has that skill.")
                    }
                    var newSkill = new Skill(name, rating);
                    this.skills[name] = newSkill;
                },
                remove: function(name) {
                    for (var i = 0; i < this.skills.length; i++) {
                        if (this.skills[i].name = name) {
                            this.skills.splice(i, 1);
                            break;
                        }
                    };
                    delete this.skills[name];
                },
                get all() {
                    return this.skills;
                },
                byName: function(name) {
                    return {
                        name: this.skills[name]
                    };
                }
            };
            var _talents = [];
            var _traits = [];
            var _wounds = {
                rolled: 0
            };
            var _criticalDamage = [];
            var _insanity = {
                points: 0,
                disorders: []
            };
            var _corruption = {
                points: 0,
                malignancies: [],
                mutations: []
            };
            var _speeds = {
                half: 0,
                full: 0,
                charge: 0,
                run: 0,
                calc: function(agilityBonus) {
                    if (agilityBonus === 0 || !agilityBonus) {
                        _speeds.half = .5;
                        _speeds.full = 1;
                        _speeds.charge = 2;
                        _speeds.run = 3;
                    } else {
                        _speeds.half = agilityBonus;
                        _speeds.full = agilityBonus * 2;
                        _speeds.charge = agilityBonus * 3;
                        _speeds.run = agilityBonus * 6;
                    }
                }
            };
            var _fatePoints = {
                total: 0
            };
            var _equipment = {
                "weapons": [],
                "armor": [],
                "other gear": []
            };
            var _experience = {
                total: 0,
                available: 0,
                advancementsBought: []
            };
            var _aptitudes = ["General"];
            var _powers = {
                bonusXp: 0,
                powers: [],
                psyRating: 0
            };

            var _character = {
                name: "",
                player: "",
                get regiment() {
                    return _regiment;
                },
                set regiment(regiment) {
                    if (_regiment) {
                        removeModifier(_regiment, "Regiment");
                    }
                    _regiment = regiment;
                    addModifier(_regiment, "Regiment");
                },
                get specialty() {
                    return _specialty;
                },
                set specialty(specialty) {
                    if (_specialty) {
                        removeModifier(_specialty, "Specialty");
                    }
                    _specialty = specialty;
                    addModifier(_specialty, "Specialty");
                },
                description: "",
                get characteristics() {
                    return _characteristics
                },
                get skills() {
                    return _skills.skills;
                },
                get talents() {
                    return _talents;
                },
                get wounds() {
                    return {
                        get fromSpecialty() {
                            if (_specialty) {
                                return _specialty['fixed modifiers'].wounds;
                            }
                            return 0;
                        },
                        get fromRegiment() {
                            if (_regiment) {
                                return _regiment['fixed modifiers'].wounds;
                            }
                            return 0;
                        },
                        set fromRoll(rolledAmount) {
                            _wounds.rolled = rolledAmount;
                        },
                        get fromRoll() {
                            return _wounds.rolled;
                        },
                        get total() {
                            var specialty = _specialty ? _specialty['fixed modifiers'].wounds : 0;
                            var regiment = _regiment ? _regiment['fixed modifiers'].wounds : 0;
                            return _wounds.rolled + specialty + regiment;
                        },
                        get criticalDamage() {
                            return _criticalDamage;
                        }
                    }
                },
                fatigue: 0,
                get insanity() {
                    return {
                        points: function(points) {
                            if (points === undefined) {
                                _insanity.points = points;
                            } else {
                                return _insanity.points;
                            }
                        },
                        get disorders() {
                            return _insanity.disorders;
                        }
                    }
                },
                get corruption() {
                    return {
                        points: function(points) {
                            if (points === undefined) {
                                _insanity.points = points;
                            } else {
                                return _insanity.points;
                            }
                        },
                        get malignancies() {
                            return _corruption.malignancies;
                        },
                        get mutations() {
                            return _corruption.mutations;
                        }

                    }
                },
                get movement() {
                    return {
                        get half() {
                            _speeds.calc()
                            return _speeds.half;
                        },
                        get full() {
                            _speeds.calc()
                            return _speeds.full;
                        },
                        get charge() {
                            _speeds.calc()
                            return _speeds.charge;
                        },
                        get run() {
                            _speeds.calc()
                            return _speeds.run;
                        }
                    }
                },
                get fatePoints() {
                    return _fatePoints
                },
                get equipment() {
                    return _equipment;
                },
                get experience() {
                    return {
                        get total() {
                            return _experience.total;
                        },
                        set available(xp) {
                            _experience.available = xp;
                            _experience.total += xp - _experience.available;
                        },
                        get available() {
                            return _experience.available;
                        },
                        addAdvancement: function(cost, property, value) {
                        	var advancement = new Advancement(cost, property,value);
                            _experience.advancementsBought.push(advancement);
                            _experience.available -= advancement.cost;
                            switch (advancement.property.toLowerCase()) {
                                case "characteristics":
                                    _characteristicMap[advancement.value.name.toLowerCase()].advancements = advancement.value;
                                    break;
                                case "skills":
                                    if(_skills.skills[value.name] && _skills.skills[value.name].advancements < value.rating){
                                    	_skills.skills[value.name].advancements = value.rating;
                                    } else {
                                    	_skills.add(value.name, value.rating);
                                    }
                                    break;
                                case "talents":
                                    _talents.push(advancement.value);
                                    break;
                                    powers.push(advancement.value);
                                    break;
                            }
                        },
                        removeAdvancement : function(advancement){
                        	var advancement = _experience.advancementsBought.splice(_experience.advancementsBought.indexOf(advancement), 1)[0];
                        	switch (advancement.property.toLowerCase()) {
                                case "characteristics":
                                	if(_characteristicMap[advancement.value.name.toLowerCase()].advancements >= advancement.value.rating){
                                		_characteristicMap[advancement.value.name.toLowerCase()].advancements = advancement.value.rating-1;
                                	}
                                    break;
                                case "skills":
                                    if(_skills.skills[advancement.value.name].advancements >= advancement.value.rating){
                                    	_skills.skills[advancement.value.name].advancements = advancement.value.rating-1;
                                    }
                                    break;
                                case "talents":
                                    _talents.splice(_talents.indexOf(advancement.value), 1);
                                    break;
                                    powers.push(advancement.value);
                                    break;
                            }
                        },
                        get advancements(){
                        	return _experience.advancementsBought;
                        }
                    }
                },
                get traits(){
                	return _traits;
                },
                get aptitudes() {
                    return _aptitudes;
                },
                get powers() {
                    return {
                        addPower: function(power, isBonus) {
                            if (_powers.powers.indexOf(power) !== -1) {
                                console.log("Tried to add power " + power + " which the character already had.")
                            }
                            if (isBonus) {
                                power.bonus = true;
                                this.bonusXp -= power.value;
                            }
                            this._psychicPowers.powers.push(power);
                        },
                        removePower: function(power) {
                            this._psychicPowers.splice(this._psychicPowers.indexOf(power), 1);
                            if (power.bonus) {
                                this.bonusXp += power.value;
                            }
                        },
                        get all() {
                            return _powers.powers.slice();
                        },
                        get bonusXp() {
                            return _powers.bonusXp;
                        },
                        set bonusXp(xp) {
                            _powers.bonusXp = xp
                        },
                        set psyRating(value) {
                            _powers.psyRating = value;
                        },
                        get psyRating() {
                            return _powers.psyRating
                        }
                    }
                }
            }
            var addModifier = function(modifier, type) {
                for (var property in modifier['fixed modifiers']) {
                    if (modifier['fixed modifiers'].hasOwnProperty(property)) {
                        switch (property) {
                            case "characteristics":
                                {
                                    if (type === "Regiment") {
                                        for (var characteristic in modifier['fixed modifiers']["characteristics"]) {
                                            _characteristics[characteristic.toLowerCase()].regiment = modifier['fixed modifiers'][property][characteristic];
                                        };
                                    } else if (type === "Specialty") {
                                        for (var characteristic in modifier['fixed modifiers']["characteristics"]) {
                                            _characteristics[characteristic.toLowerCase()].specialty = modifier['fixed modifiers'][property][characteristic];
                                        };
                                    }
                                }
                                break;
                            case "skills":
                                var incomingSkills = modifier['fixed modifiers']['skills'];
                                for (var skill in incomingSkills) {
                                    var existingSkill = _skills.skills[skill];
                                    if (existingSkill) {
                                        existingSkill.advancements += incomingSkills[skill];
                                    } else {
                                        _skills.add(skill, incomingSkills[skill]);
                                    }
                                }
                                break;
                            case "talents":
                                var incomingTalents = modifier['fixed modifiers']['talents'];
                                for (var i = 0; i < incomingTalents.length; i++) {
                                    _talents.push(incomingTalents[i]);
                                }
                                break;
                            case "aptitudes":
                                var incomingAptitudes = modifier['fixed modifiers']['aptitudes'];
                                _aptitudes = _aptitudes.concat(incomingAptitudes);
                                break;
                            case "starting power experience":
                                _powers.bonusXp = modifier['fixed modifiers']['starting power experience'];
                                break;
                            case "psy rating":
                                _powers.psyRating = modifier['fixed modifiers']['psy rating'];
                                break;
                            case "character kit":
                                for (var category in modifier['fixed modifiers']['character kit']) {
                                    switch (category) {
                                        case "main weapon":
                                        case "standard melee weapon":
                                            var weapons = modifier['fixed modifiers']['character kit'][category];
                                            $.each(weapons, function(index, element) {
                                                _equipment.weapons.push(element);
                                            });
                                            break;
                                        case "armor":
                                            $.each(modifier['fixed modifiers']['character kit'][category], function(index, element) {
                                                _equipment.armor.push(element);
                                            });
                                            break;
                                        case "other gear":
                                            $.each(modifier['fixed modifiers']['character kit'][category], function(index, element) {
                                                _equipment['other gear'].push(element);
                                            });
                                            break;
                                    }
                                }
                                break;
                        }
                    }
                    if (type === "specialty") {
                        if (modifier['type'] === "Guardsman") {
                            _character.experience.available += 600;
                        } else if (modifier['type'] === "Support") {
                            _character.experience.available += 300;
                        } else {
                            throw new Error("Specialty type must be 'Guardsman' or 'Support' but was " + type + ".");
                        }
                    } else if (type === "regiment") {

                    }
                    if (_character._regiment) {
                    	var favoredWeapons = _character._regiment['fixed modifiers']['favored weapons'];
                    }
                    })
                }
            };
            var removeModifier = function(modifier, type) {
                for (var property in modifier['fixed modifiers']) {
                    if (modifier['fixed modifiers'].hasOwnProperty(property)) {
                        switch (property) {
                            case "characteristics":
                                {
                                    if (type === "Regiment") {
                                        for (var characteristic in modifier['fixed modifiers']["characteristics"]) {
                                            _character.characteristics[characteristic.toLowerCase()].regiment = 0;
                                        };
                                    } else if (type === "Specialty") {
                                        for (var characteristic in modifier['fixed modifiers']["characteristics"]) {
                                            _character.characteristics[characteristic.toLowerCase()].specialty = 0;
                                        };
                                    }
                                }
                                break;
                            case "skills":
                                var incomingSkills = modifier['fixed modifiers']['skills'];
                                for (var skill in incomingSkills) {
                                    if (_skills.skills[skill] === incomingSkills[skill]) {
                                        delete _skills.skills[skill];
                                    } else {
                                        _skills[skill] -= incomingSkills[character];
                                    }
                                }
                                break;
                            case "talents":
                                var incomingTalents = modifier['fixed modifiers']['talents'];
                                var indexesToRemove = [];
                                for (var i = 0; i < incomingTalents.length; i++) {
                                    indexesToRemove.push(_character.talents.indexOf(incomingTalents[i]));
                                };
                                $.each(indexesToRemove.sort(function(a, b) {
                                    return b - a;
                                }), function(i, indexToRemove) {
                                    _character.talents.splice(indexToRemove, 1);
                                });
                                break;
                            case "traits":
                                var incomingTraits = modifier['fixed modifiers']['traits'];
                                var indexesToRemove = [];
                                for (var i = 0; i < incomingTraits.length; i++) {
                                    indexesToRemove.push(_character.traits.indexOf(incomingTraits[i]));
                                };
                                $.each(indexesToRemove.sort(function(a, b) {
                                    return b - a;
                                }), function(i, indexToRemove) {
                                    _character.traits.splice(indexToRemove, 1);
                                });
                            case "starting power experience":
                                _character.psychicPowers.bonusXp -= modifier['fixed modifiers']['starting power experience'];
                                _character.psychicPowers.powers = _character.psychicPowers.powers.filter(function(element) {
                                    _powers.bonusXp += element.value;
                                    return !element.hasOwnProperty('bonus');
                                });
                                break;
                            case "psy rating":
                                _character.psychicPowers.psyRating -= modifier['fixed modifiers']['psy rating'];
                                $.each(_character.experience._advancementsBought, function(i, advancement) {
                                    var advancementsToRemove = [];
                                    if (advancement.property === "psy rating") {
                                        advancementsToRemove.push(i);
                                    };
                                    $.each(advancementsToRemove, function(i, toRemove) {
                                        _character.experience.removeAdvancement(toRemove);
                                    });
                                })
                                break;
                            case "psychic powers":
                                var incomingPowers = modifier['fixed modifiers']['psychicPowers'];
                                $.each(incomingPowers, function(i, power) {
                                    _character.psychicPowers.powers.splice(_character.psychicPowers.powers.indexOf(power), 1);
                                });
                                break;
                            case "character kit":
                                for (var category in modifier['fixed modifiers']['character kit']) {
                                    switch (category) {
                                        case "main weapon":
                                        case "standard melee weapon":
                                            var weapons = modifier['fixed modifiers']['character kit'][category];
                                            var indexesToRemove = []
                                            $.each(weapons, function(i, element) {
                                                var index = _equipment.weapons.indexOf(element);
                                                if (index !== -1) {
                                                    indexesToRemove.push(index);
                                                }
                                            });
                                            indexesToRemove.sort(function(a, b) {
                                                return b - a;
                                            });
                                            $.each(indexesToRemove, function(i, indexToRemove) {
                                                _equipment.weapons.splice(indexToRemove);
                                            });
                                            break;
                                        case "armor":
                                            var armor = modifier['fixed modifiers']['character kit'][category];
                                            $.each(armor, function(i, element) {
                                                var index = _equipment.weapons.indexOf(element);
                                                if (index !== -1) {
                                                    indexesToRemove.push(index);
                                                }
                                            });
                                            indexesToRemove.sort(function(a, b) {
                                                return b - a;
                                            });
                                            $.each(indexesToRemove, function(i, indexToRemove) {
                                                _equipment.armor.splice(indexToRemove);
                                            });
                                            break;
                                        case "other gear":
                                            var gear = modifier['fixed modifiers']['character kit'][category];
                                            $.each(gear, function(i, element) {
                                                var index = _equipment.weapons.indexOf(element);
                                                if (index !== -1) {
                                                    indexesToRemove.push(index);
                                                }
                                            });
                                            indexesToRemove.sort(function(a, b) {
                                                return b - a;
                                            });
                                            $.each(indexesToRemove, function(i, indexToRemove) {
                                                _equipment['other gear'].splice(indexToRemove);
                                            });
                                            break;
                                    }
                                }
                                break;
                            case "aptitudes":
                                //Remove all of the aptitudes. This means we don't have to worry about any bonus aptitudes from duplicates.
                                _character._aptitudes = ["General"];
                                //Re-add the aptitudes from the other modifier
                                if (type === "Regiment" && _character._specialty) {
                                    _character._aptitudes.base = _character._specialty['fixed modifiers'].aptitudes;
                                } else if (type === "Specialty" && _character._regiment) {
                                    _character._aptitudes.base = _character._regiment['fixed modifiers'].aptitudes;
                                }
                        }
                    }
                }
                if (type === "specialty") {
                    if (modifier['type'] === "Guardsman") {
                        _character.experience.available -= 600;
                    } else if (modifier['type'] === "Support") {
                        _character.experience.available -= 300;
                    } else {
                        throw "Specialty type must be 'Guardsman' or 'Support' but was " + type + "."
                    }
                } else if (type === "regiment") {
                    _equipment.weapons = _equipment.weapons.map(function(weapon) {
                        if (weapon.favored) {
                            weapon.item = {
                                name: "Regimental Favored " + weapon.type + " Weapon"
                            };
                        } else {
                            return weapon;
                        }
                    });
                }
            };
            return _character;
        }
		//If there isn't already a character, create a new one.
        var _character = _character || new OnlyWarCharacter();

        var service = {
            get character() {
                return _character
            },
            set character(value) {
                _character = value
            },
            "new": function() {
                this.character = new character();
            }
        };
        return service;
    }
});