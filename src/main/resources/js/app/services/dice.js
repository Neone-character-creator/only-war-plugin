define([], "dice", function() {
    return function() {
        return {
            roll: function(diceCount, dieMin, dieMax, modifier) {
                var result = modifier | 0;
                for (var i = 0; i < diceCount; i++) {
                    result += Math.floor(Math.random() * (dieMax - dieMin + 1)) + 1;
                }
                return $q.then(result);
            }
        }
	}
});