define(function() {
    return function() {
    	var roll = function(dieMin, dieMax, rollCount) {
    		var result = 0;
    		var rollCount = rollCount ? rollCount : 1;
    		for (var i = 0; i < rollCount; i++) {
    			result += Math.floor(Math.random() * (dieMax - dieMin + 1)) + 1;
    		};
    		return result;
    	};
        return {
            roll: roll
        };
	};
});