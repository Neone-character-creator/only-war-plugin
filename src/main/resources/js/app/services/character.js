/*
Service for the character being created.

character() returns the current character.
refresh() replaces the current character with a new one.
*/
define(function() {
	return function($q, characteroptions) {
		Characteristic = function(name) {
			var _perAdvancementBonus = 5;
			return {
				name: name,
				rolled: 0,
				specialty: 0,
				regiment: 0,
				advancements: 0,
				total: function() {
					var total = Number(this.rolled) + this.specialty + this.regiment + (this.advancements * _perAdvancementBonus);
					return total;
				}
			}
		};

		Skill = function(name, rating) {
			var _name = name;
			var _advancements = rating | 0;
			return {
				name: function() {
					return _name;
				},
				advancements: function(value) {
					if (value !== undefined) {
						_advancements = value;
					} else {
						return _advancements;
					}
				}

			}
		}

		Advancement = function(cost, property, value) {
			return {
				cost: cost,
				property: property,
				value: value
			};
		};

		var character = function(original) {
			var _regiment = null;
			var _specialty = null;
			var _characteristicMap = [
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
			var _skills = {};
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
				regiment: function(regiment) {
					if (regiment === undefined) {
						return _regiment;
					} else {
						if (_regiment) {
							removeModifier(_regiment, "Regiment");
						}
						_regiment = regiment;
						addModifier(_regiment, "Regiment");
					}
				},
				specialty: function(specialty) {
					if (specialty === undefined) {
						return _specialty;
					} else {
						if (_specialty) {
							removeModifier(_specialty, "Specialty");
						}
						_specialty = specialty;
						addModifier(_specialty, "Specialty");
					}
				},
				description: "",
				characteristics: function() {
					return {
						byName: function(name) {
							return _characteristicMap[name];
						},
						all: function() {
							return _characteristicMap;
						},
						complete: function() {
							var complete = true;
							for (var characteristic in _characteristicMap) {
								complete = complete && _characteristicMap[characteristic].rolled;
							}
							return complete;
						}
					}
				},
				skills: function() {
					return {
						add: function(name, rating) {
							if (_skills[name] !== undefined) {
								throw "Tried to add a skill named " + name + " but " + this.name + " already has that skill."
							}
							var newSkill = new Skill(name, rating);
							_skills[name] = newSkill;
						},
						remove: function(name) {
							for (var i = 0; i < _skills.length; i++) {
								if (_skills[i].name = name) {
									_skills.splice(i, 1);
									break;
								}
							};
							delete _skills[name];
						},
						all: function() {
							return _skills;
						},
						byName: function(name) {
							return _skills[name];
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
				traits: function() {
					return {
						add: function(trait) {
							if (_traits.indexOf(trait) !== -1) {
								throw "Tried to add trait " + trait + " but " + this.name + " already has that trait."
							}
							_traits.push(trait);
						},
						remove: function(trait) {
							var index = _traits.indexOf(trait);
							if (index >= 0) {
								_traits.splice(index, 1);
							}
						},
						all: function() {
							return _traits;
						},
						byName: function(name) {
							return _traitsMap[name];
						}
					}
				},
				wounds: function() {
					return {
						fromSpecialty: function() {
							if (_specialty) {
								return _specialty['fixed modifiers'].wounds;
							}
							return 0;
						},
						fromRegiment: function() {
							if (_regiment) {
								return _regiment['fixed modifiers'].wounds;
							}
							return 0;
						},
						fromRoll: function(rolledAmount) {
							if (rolledAmount === undefined) {
								return _wounds.rolled;
							} else {
								_wounds.rolled = rolledAmount;
							}

						},
						total: function() {
							var specialty = _specialty ? _specialty['fixed modifiers'].wounds : 0;
							var regiment = _regiment ? _regiment['fixed modifiers'].wounds : 0;
							return _wounds.rolled + specialty + regiment;
						},
						criticalDamage: function() {
							return _criticalDamage;
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
							return _insanity.disorders;
						}
					}
				},
				corruption: function() {
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
						total: function(value) {
							if (value !== undefined) {
								_fatePoints.total = value;
							} else {
								return _fatePoints.total;
							}
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
							all: function() {
								return _equipment.weapons.slice();
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
							all: function() {
								return _equipment.armor.slice();
							}
						}
					},
					otherGear: function() {
						return {
							add: function(weapon) {
								_equipment['other gear'].push(weapon);
							},
							remove: function(weapon) {
								var index = _equipment['other gear'].indexOf(weapon);
								if (index >= 0) {
									_equipment.otherGear.splice(index, 1);
								}
							},
							all: function() {
								return _equipment['other gear'].slice();
							}
						}
					}
				},
				experience: function() {
					return {
						total: function() {
							return _experience.total;
						},
						available: function(xp) {
							if (xp === undefined) {
								return _experience.available;
							} else {
								_experience.available = xp;
								_experience.total += xp - _experience.available;
							};
						},
						addAdvancement: function(advancement) {
							_experience.advancementsBought.push(advancement);
							_experience.available -= advancement.cost;
							switch (advancement.property[0]) {
								case "Characteristics":
									_characteristicMap[advancement.property[1].toLowerCase()].advancements = advancement.value;
									break;
								case "Skills":
									_skills[advancement.property[1]].advancements(advancement.value);
									break;
								case "Talents":
									_talents.push(advancement.value);
									break;
								case "Psychic Powers":
									_powers.push(advancement.value);
									break;
							}
						}
					}
				},
				aptitudes: function() {
					return {
						all: function(value) {
							if (value) {
								_aptitudes = value;
							} else {
								return _aptitudes
							}
						}
					}
				},
				powers: function() {
					return {
						addPower: function(power, isBonus) {
							if (_powers.powers.indexOf(power) !== -1) {
								throw "Tried to add power " + power + " which the character already had."
							}
							if (isBonus) {
								power.bonus = true;
								_powers.bonusXp -= power.value;
							}
							_powers.powers.push(power);
						},
						removePower: function(power) {
							_powers.powers.splice(_powers.powers.indexOf(power), 1);
							if (power.bonus) {
								_powers.bonusXp += power.value;
							}
						},
						all: function() {
							return _powers.powers.slice();
						},
						bonusXp: function(value) {
							if (value) {
								_powers.bonusXp = value;
							} else {
								return _powers.bonusXp;
							}
						},
						psyRating: function(value) {
							if (value) {
								_powers.psyRating = value;
							} else {
								return _powers.psyRating;
							}
						}
					}
				}
			};

			var addModifier = function(modifier, type) {
				for (var property in modifier['fixed modifiers']) {
					if (modifier['fixed modifiers'].hasOwnProperty(property)) {
						switch (property) {
							case "characteristics":
								{
									if (type === "Regiment") {
										for (var characteristic in modifier['fixed modifiers']["characteristics"]) {
											_characteristicMap[characteristic.toLowerCase()].regiment = modifier['fixed modifiers'][property][characteristic];
										};
									} else if (type === "Specialty") {
										for (var characteristic in modifier['fixed modifiers']["characteristics"]) {
											_characteristicMap[characteristic.toLowerCase()].specialty = modifier['fixed modifiers'][property][characteristic];
										};
									}
								}
								break;
							case "skills":
								var incomingSkills = modifier['fixed modifiers']['skills'];
								for (var skill in incomingSkills) {
									var existingSkill = _skills[skill];
									if (existingSkill) {
										existingSkill.advancements(existingSkill.advancements() + incomingSkills[skill]);
									} else {
										_character.skills().add(skill, incomingSkills[skill]);
									}
								}
								break;
							case "talents":
								var incomingTalents = modifier['fixed modifiers']['talents'];
								for (var i = 0; i < incomingTalents.length; i++) {
									_character.talents().add(incomingTalents[i]);
								}
								break;
							case "traits":
								var incomingTraits = modifier['fixed modifiers']['traits'];
								for (var i = 0; i < incomingTraits.length; i++) {
									_character.traits().add(incomingTraits[i]);
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
										case "other weapons":
											$.each(modifier['fixed modifiers']['character kit'][category], function(index, element) {
												_character.equipment.weapons().add(element);
											});
											break;
										case "armor":
											$.each(modifier['fixed modifiers']['character kit'][category], function(index, element) {
												_character.equipment.armor().add(element);
											});
											break;
										case "other gear":
											$.each(modifier['fixed modifiers']['character kit'][category], function(index, element) {
												_character.equipment.otherGear().add(element);
											});
											break;
									}
								}
								break;
						}
					}
				}
				if (type === "Specialty") {
					if (modifier['type'] === "Guardsman") {
						_character.experience().available(600);
					} else if (modifier['type'] === "Support") {
						_character.experience().available(300);
					} else {
						throw new Error("Specialty type must be 'Guardsman' or 'Support' but was " + type + ".");
					}
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
											_characteristicMap[characteristic.toLowerCase()].regiment = 0;
										};
									} else if (type === "Specialty") {
										for (var characteristic in modifier['fixed modifiers']["characteristics"]) {
											_characteristicMap[characteristic.toLowerCase()].specialty = 0;
										};
									}
								}
								break;
							case "skills":
								var incomingSkills = modifier['fixed modifiers']['skills'];
								for (var skill in incomingSkills) {
									var existingSkill = _skills[skill];
									if (existingSkill && existingSkill.advancements() === incomingSkills[skill]) {
										delete _skills[skill];
									} else {
										existingSkill.advancements(existingSkill.advancements() - incomingSkills[skill]);
									}
								}
								break;
							case "talents":
								var incomingTalents = modifier['fixed modifiers']['talents'];
								for (var i = 0; i < incomingTalents.length; i++) {
									_talents.splice(_talents.indexOf(incomingTalents[i]), 1);
								}
								break;
							case "traits":
								var incomingTraits = modifier['fixed modifiers']['traits'];
								for (var i = 0; i < incomingTraits.length; i++) {
									_traits.splice(_traits.indexOf(incomingTraits[i]), 1);
								}
								break;
							case "starting power experience":
								_powers.bonusXp -= modifier['fixed modifiers']['starting power experience'];
								_powers.powers = _powers.powers.filter(function(element) {
									_powers.bonusXp += element.value;
									return !element.hasOwnProperty('bonus');
								})
								break;
							case "psy rating":
								_powers.psyRating -= modifier['fixed modifiers']['psy rating'];
								break;
							case "character kit":
								for (var category in modifier['fixed modifiers']['character kit']) {
									switch (category) {
										case "main weapon":
										case "other weapons":
											var weapons = modifier['fixed modifiers']['character kit'][category];
											$.each(weapons, function(index, element) {
												_character.equipment.weapons().remove(element);
											});
											break;
										case "armor":
											break;
										case "other gear":
											break;
									}
								}
								break;
						}
					}
				}
				if (type === "Specialty") {
					if (modifier['type'] === "Guardsman") {
						_character.experience().available(-600);
					} else if (modifier['type'] === "Support") {
						_character.experience().available(-300);
					} else {
						throw "Specialty type must be 'Guardsman' or 'Support' but was " + type + "."
					}
				}
			};
			return _character;
		}
		var _character = character();
		var service = {
			character: function() {
				return _character;
			},
			refresh: function() {
				this.character = character();
			}
		};
		return service;
	}
});