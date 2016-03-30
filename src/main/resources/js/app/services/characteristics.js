define(function() {
	return function($resource){
		var characteristics = $resource("Character/characteristics.json").query();
		var service = {
			characteristics: function() {
				characteristics.$promise.then(function(result){
					return result.splice();
				});
			}
		}
		return service;
	}
});