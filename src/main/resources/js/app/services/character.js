/*
Service for the character being created.

character() returns the current character.
refresh() replaces the current character with a new one.
*/
define(function(){
	return function(){
    var character = function() {
        var _regiment = null;
        var _specialty = null;
        var _characteristicsArray = [
            new Characteristic("weapon skill"),
            new Characteristic("ballistic skill"),
            new Characteristic("strength"),
            new Characteristic("toughness"),
            new Characteristic("agility"),
            new Characteristic("intelligence"),
            new Characteristic("perception"),
            new Characteristic("willpower"),
            new Characteristic("fellowship")
        ];
        var _characteristicMap = _characteristicsArray.reduce(function(previous, current, index, input) {
            previous[current.name] = current;
            return previous;
        }, {})
        var _skills = [];
        var _skillsMap = {};
        var _talents = [];
        var _wounds = {
            rolled: 0
        };
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
                if (agilityBonus === 0) {
                    speeds.half = .5;
                    speeds.full = 1;
                    speeds.charge = 2;
                    speeds.run = 3;
                } else {
                    _speeds.half = agilityBonus;
                    _speeds.full = agilityBonus * 2;
                    _speeds.charge = agilityBonus * 3;
                    _speeds.run = agilityBonus * 6;
                }
            }
        };
        var _fatePoints = {
            rolled: 0,
            total: 0
        };
        var _equipment = {
            "weapons": [],
            "armor": [],
            "other gear": []
        }
        var _experience = {
        	total : 0,
        	available : 0,
        	advancementsBought : []
        }
        return {
            name: "",
            player: "",
            regiment: function(regiment) {
                if (regiment === undefined) {
                    return _regiment;
                } else {
                    _regiment = regiment;
                }
            },
            specialty: function(specialty) {
                if (specialty === undefined) {
                    return _specialty;
                } else {
                    _specialty = specialty;
                }
            },
            description: "",
            characteristics: function() {
                return {
                    byName: function(name) {
                        return _characteristicMap[name];
                    },
                    all: function() {
                        return _characteristicsArray
                    }
                }
            },
            skills: function() {
                return {
                    add: function(name, rating) {
                        if (_skillsMap[name] !== undefined) {
                            throw "Tried to add a skill named " + name + " but " + this.name + " already has that skill."
                        }
                        var newSkill = new skill(name, rating);
                        _skills.push(newSkill);
                        _skillsMap[name] = newSkill;
                    },
                    remove: function(name) {
                        for (var i = 0; i < _skills.length; i++) {
                            if (_skills[i].name = name) {
                                _skills.splice(i, 1);
                                break;
                            }
                        };
                        delete _skillsMap[name];
                    },
                    all: function() {
                        return _skills;
                    },
                    byName: function(name) {
                        return _skillsMap[name];
                    }
                }
            },
            talents: function() {
                return {
                    add: function(talent) {
                        if (_talents.indexOf(talent) !== -1) {
                            throw "Tried to add talent " + talent + " but " + this.name + " already has that talent."
                        }
                        _talents.push(talent);
                    },
                    remove: function(talent) {
                        var index = _talents.indexOf(talent);
                        if (index >= 0) {
                            _talents.splice(index, 1);
                        }
                    },
                    all: function() {
                        return _talents;
                    },
                    byName: function(name) {
                        return _talentsMap[name];
                    }
                }
            },
            wounds: function() {
                return {
                    fromSpecialty: function() {
                        return specialty && specialty['fixed modifiers'].wounds;
                    },
                    fromRegiment: function() {
                        return regiment && regiment['fixed modifiers'].wounds;
                    },
                    fromRoll: function(rolledAmount) {
                        if (rolledAmount === undefined) {
                            return _wounds.rolled;
                        } else {
                            _wounds.rolled = rolledAmount;
                        }

                    },
                    total: function() {
                        return fromRoll() + fromSpecialty() + fromRegiment();
                    }
                }
            },
            fatigue: 0,
            insanity: function() {
                return {
                    points: function(points) {
                        if (points === undefined) {
                            _insanity.points = points;
                        } else {
                            return _insanity.points;
                        }
                    },
                    disorders: function() {
                        _insanity.disorders;
                    }
                }
            },
            _corruption: function() {
                return {
                    points: function(points) {
                        if (points === undefined) {
                            _insanity.points = points;
                        } else {
                            return _insanity.points;
                        }
                    },
                    malignancies: function() {
                        return _corruption.malignancies;
                    },
                    mutations: function() {
                        return _corruption.mutations;
                    }

                }
            },
            movement: function() {
                return {
                    half: function() {
                        _speeds.calc()
                        return _speeds.half;
                    },
                    full: function() {
                        _speeds.calc()
                        return _speeds.full;
                    },
                    charge: function() {
                        _speeds.calc()
                        return _speeds.charge;
                    },
                    run: function() {
                        _speeds.calc()
                        return _speeds.run;
                    },
                }
            },
            fatePoints: function() {
                return {
                    rolled: function() {
                        return _fatePoints.rolled;
                    },
                    total: function() {
                        return _fatePoints.total;
                    }
                }
            },
            equipment: {
                weapons: function() {
                    return {
                        add: function(weapon) {
                            _equipment.weapons.push(weapon);
                        },
                        remove: function(weapon) {
                            var index = _equipment.weapons.indexOf(weapon);
                            if (index >= 0) {
                                _equipment.weapons.splice(index, 1);
                            }
                        },
                         all : function(){
                         	return Object.clone(_equipment.weapons);
                         }
                    }
                },
                armor: function() {
                    return {
                        add: function(armor) {
                            _equipment.armor.push(armor);
                        },
                        remove: function(armor) {
                            var index = _equipment.armor.indexOf(armor);
                            if (index >= 0) {
                                _equipment.armor.splice(index, 1);
                            }
                        },
                        all : function(){
                        	return Object.clone(_equipment.armor);
                        }
                    }
                },
                otherGear: function() {
                    return {
                        add: function(weapon) {
                            _equipment.otherGear.push(weapon);
                        },
                        remove: function(weapon) {
                            var index = _equipment.otherGear.indexOf(weapon);
                            if (index >= 0) {
                                _equipment.otherGear.splice(index, 1);
                            }
                        },
                        all : function(){
                        	return Object.clone(_equipment.otherGear);
                        }
                    }
                }
            },
        	experience : function(){
        		return {
        			total: function(){
        				return _experience.total;
        			},
        			available : function(xp){
        				if (xp === undefined){
        					return _experience.available;
        				} else {
        					_experience.available = xp;
        				}
        			},
        			addAdvancement : function(advancement){
        				_experience.available -= advancement.cost;
        			}
        		}
        	},
            aptitudes: [],
    };
}
	var _character;
	var service = {
	    character: function() {
	        return $q.when(_character);
	    },
	    refresh: function() {
	        this.character = character();
	    }
	};
	return service;}
});