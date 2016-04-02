define(function() {
    return function() {
    	var roll = function(dieMin, dieMax, rollCount) {
    		var result = 0;
    		var rollCount = 1 | rollCount;
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