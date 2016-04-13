/*
Service for the character being created.
*/
define(function() {
	return function($q, characteroptions) {
		function Characteristic(name) {
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

		function Advancement(cost, property, value) {
			return {
				cost: cost,
				property: property,
				value: value
			};
		};
		var addModifier = function(modifier, type) {
			for (var property in modifier['fixed modifiers']) {
				if (modifier['fixed modifiers'].hasOwnProperty(property)) {
					switch (property) {
						case "characteristics":
							{
								if (type === "Regiment") {
									for (var characteristic in modifier['fixed modifiers']["characteristics"]) {
										_character.characteristics[characteristic.toLowerCase()].regiment = modifier['fixed modifiers'][property][characteristic];
									};
								} else if (type === "Specialty") {
									for (var characteristic in modifier['fixed modifiers']["characteristics"]) {
										_character.characteristics[characteristic.toLowerCase()].specialty = modifier['fixed modifiers'][property][characteristic];
									};
								}
							}
							break;
						case "skills":
							var incomingSkills = modifier['fixed modifiers']['skills'];
							for (var skill in incomingSkills) {
								var existingSkill = _character.skills[skill];
								if (existingSkill) {
									_character.skills[skill] = _character.skills[skill] + incomingSkills[skill];
								} else {
									_character.skills[skill] = incomingSkills[skill];
								}
							}
							break;
						case "talents":
							var incomingTalents = modifier['fixed modifiers']['talents'];
							$.each(incomingTalents, function(index, talent){
								_character.talents.push(talent);
							});
							break;
						case "traits":
							var incomingTraits = modifier['fixed modifiers']['traits'];
							for (var i = 0; i < incomingTraits.length; i++) {
								_character.traits.push(incomingTraits[i]);
							}
							break;
						case "aptitudes":
							var incomingAptitudes = modifier['fixed modifiers']['aptitudes'];
							_character.aptitudes.base = _character.aptitudes.base.concat(incomingAptitudes);
							break;
						case "starting power experience":
							_character.psychicPowers.bonusXp = modifier['fixed modifiers']['starting power experience'];
							break;
						case "psy rating":
							_chracter.psychicPowers.psyRating = modifier['fixed modifiers']['psy rating'];
							break;
						case "character kit":
							for (var category in modifier['fixed modifiers']['character kit']) {
								switch (category) {
									case "main weapon":
									case "other weapons":
										$.each(modifier['fixed modifiers']['character kit'][category], function(index, element) {
											_character.equipment.weapons.push(element);
										});
										break;
									case "armor":
										$.each(modifier['fixed modifiers']['character kit'][category], function(index, element) {
											_character.equipment.armor.push(element);
										});
										break;
									case "other gear":
										$.each(modifier['fixed modifiers']['character kit'][category], function(index, element) {
											_character.equipment['other gear'].push(element);
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
					_character.experience.available += 600;
				} else if (modifier['type'] === "Support") {
					_character.experience.available += 300;
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
								if (_character.skills[skill] === incomingSkills[skill]) {
									delete _character.skills[skill];
								} else {
									_character.skills -= incomingSkills[character];
								}
							}
							break;
						case "talents":
							var incomingTalents = modifier['fixed modifiers']['talents'];
							for (var i = 0; i < incomingTalents.length; i++) {
								_character.talents.splice(_character.talents.indexOf(incomingTalents[i]), 1);
							}
							break;
						case "traits":
							var incomingTraits = modifier['fixed modifiers']['traits'];
							for (var i = 0; i < incomingTraits.length; i++) {
								_character.traits.splice(_character.traits.indexOf(incomingTraits[i]), 1);
							}
							break;
						case "starting power experience":
							_character.psychicPowers.bonusXp -= modifier['fixed modifiers']['starting power experience'];
							_character.psychicPowers.powers = _powers.powers.filter(function(element) {
								_powers.bonusXp += element.value;
								return !element.hasOwnProperty('bonus');
							});
							break;
						case "psy rating":
							_character.powers.psyRating -= modifier['fixed modifiers']['psy rating'];
							break;
						case "character kit":
							for (var category in modifier['fixed modifiers']['character kit']) {
								switch (category) {
									case "main weapon":
									case "other weapons":
										var weapons = modifier['fixed modifiers']['character kit'][category];
										$.each(weapons, function(index, element) {
											_character.equipment.weapons.splice(_character.equipment.weapons.indexOf(element),1);
										});
										break;
									case "armor":
									var armor = modifier['fixed modifiers']['character kit'][category];
									$.each(armor, function(index, element) {
										_character.equipment.armor.splice(_character.equipment.armor.indexOf(element),1);
									});
										break;
									case "other gear":
									var gear = modifier['fixed modifiers']['character kit'][category];
									$.each(gear, function(index, element) {
										_character.equipment['other gear'].splice(_character.equipment['other gear'].indexOf(element),1);
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
								_aptitudes.base = _specialty['fixed modifiers'].aptitudes;
							} else if (type === "Specialty" && _character._regiment) {
								_aptitudes.base = _regiment['fixed modifiers'].aptitudes;
							}
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

		function character(original) {
			var character = {
				name: "",
				player: "",
				_regiment: null,
				_specialty: null,
				get specialty() {
					return this._specialty;
				},
				set specialty(specialty) {
					if(this._specialty){
						removeModifier(specialty, "Specialty");
					}
					addModifier(specialty, "Specialty");
					this._specialty = specialty;
				},
				get regiment() {
					return this._regiment;
				},
				set regiment(regiment) {
					if(this._regiment){
						removeModifier(regiment, "Regiment");
					}
					addModifier(regiment, "regiment");
					this._regiment = regiment;
				},
				characteristics: [
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
				}, {}),
				//Map of skill names to their ratings.
				skills: {},
				talents: [],
				traits: [],
				wounds: {
					get total(){
						this.modifiers.reduce(function(previous,next){
							return previous.modifier + next.modifier;
						}, 0);
					},
					modifiers: [{"name" : "rolled", "modifier" : 0}],
					criticalInjuries: []
				},
				insanity: {
					points: 0,
					disorders: []
				},
				corruption: {
					points: 0,
					malignancies: [],
					mutations: []
				},
				get speed() {
					var agilityBonus = Math.max(Math.floor(this.characteristics["agility"] / 10), .5);
					return {
						half: agilityBonus,
						full: agilityBonus * 2,
						charge: agilityBonus * 3,
						run: agilityBonus * 6
					}
				},
				fatePoints: 0,
				equipment: {
					"weapons": [],
					"armor": [],
					"other gear": [],
					get all() {
						return this.weapons.contact(this.armor).contact(this['other gear'])
					}
				},
				experience: {
					total: 0,
					_available : 0,
					_advancementsBought: [],
					get available(){
						return this._available;
					},
					set available(value){
						this.total += value - this._available;
						this._available = value;
					},
					addAdvancement(xp, propertyModified, value){
						this._advancementsBought.push(new Advancement(xp, propertyModified, value));
						this.available -= xp;
						if(typeof propertyModified === "string"){
							switch(propertyModified){
								case "talents":
									character.talents.push(value);
								break;
								case "skills":
								break;
							}
						}
					},
					removeAdvancement(index){

					}
				},
				aptitudes: {
					base: ["General"],
					bonus: [],
					get all() {
						return this.base.concat(this.bonus)
					}
				},
				psychicPowers: {
					bonusXp: 0,
					powers: [],
					psyRating: 0
				},
				description: "",
				fatigue: 0,
			};

			return character;
		}
		var _character = new character();
		var service = {
			character: _character
		};
		return service;
	}
});