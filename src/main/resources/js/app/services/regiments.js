define(function(){
	return function($resource, $q){
		var regiments = $resource("Regiment/regiments.json").query();
		var regimentNameToIndex = {};
		var _selected = null;
		var _remainingSelections;
		var _selectionComplete = false;

		var service = {
            regiments : function() {
            	return regiments.$promise.then(function(result){
            		return result.slice();
            	});
            },
            selected : function() {
            	return _selected;
            },
            remainingSelections : function(){
            	return _remainingSelections;
            },
            complete : function(){
            	return _selected && _remainingSelections.length === 0;
            },
	            selectRegiment : function(regiment) {
	                _selected = regiment;
	                _remainingSelections = _selected['optional modifiers'];
	            }
	        };
		return service;
	};
});