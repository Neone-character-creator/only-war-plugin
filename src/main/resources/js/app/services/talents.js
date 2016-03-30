define(function(){
	return function($resource) {
    	var _talents;
    	$.get({
	        url: "Character/talents.json",
	        dataType: "json"
	    }).done(function(result) {
	        _talents = result;
    	});
	    return function() {
	        return _talents;
	    };
	};
});
