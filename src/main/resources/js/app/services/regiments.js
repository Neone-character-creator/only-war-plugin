define(function(){
	return function($resource, $q){
		var _selected = null;
		var _remainingSelections;
		var _selectionComplete = false;

		var service = {
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
	                _selected = Object.clone(regiment);
	                _remainingSelections = _selected['optional modifiers'];
	            }
	        };
		return service;
	};
});