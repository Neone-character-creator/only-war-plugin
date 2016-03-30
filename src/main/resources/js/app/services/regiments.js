define(function(){
	return function($resource){
		var regiments = $resource("Regiment/regiments.json").query();
		var regimentNameToIndex = {};
		var _selected = null;
		var _selectionsRemaining;
		var _selectedModified = false;

		var service = {
            regiments : function() {
            	return regiments.$promise.then(function(response){
            		return response.splice();
            	});
            },
            selected : function() {
            	return _selected;
            },
            selectionsRemaining : function(){
            	return _selectionsRemaining;
            },
            dirty : function(){
            	return _selectedModified;
            },
	            selectRegiment : function(regiment) {
	                _selected = regiment;
	                _selectionsRemaining = _selected['optional modifiers'];
	            }
	        };
		return service;
	};
});