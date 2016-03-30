function characteristic(name) {
    var _name = name;
    var _baseValue = 0;
    var _specialtyModifier = 0;
    var _regimentModifier = 0;
    var _advancements = 0;

    return {
        name: function() {
            return _name;
        },
        baseValue: function(value) {
            if (value !== undefined) {
                _value = value;
            } else {
                return _value;
            }
        },
        specialtyModifier: function(value) {
            if (value !== undefined) {
                _specialtyModifier = value;
            } else {
                return _specialtyModifier;
            }
        },
        regimentModifier: function(value) {
            if (value !== undefined) {
                _regimentModifier = value;
            } else {
                return _regimentModifier;
            }
        },
        numAdvancements: function(value) {
            if (value !== undefined) {
                _advancements = value;
            } else {
                return _advancements;
            }
        },
        value: function() {
            return _value + _specialtyModifier + _regimentModifier + advancements * 5;
        },
        bonus: function() {
            return Math.floor(value() / 10);
        }
    };
}

function skill(name, rating) {
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

function advancement(cost, property, value){
	return {
		cost : cost,
		property : property,
		value : value
	}
}