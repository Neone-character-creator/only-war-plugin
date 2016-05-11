define(function(){
	return function(){
		var _location = null;
		var _modifiers = [];
		return {
			location : function(value){
				if(value){
					_location = value;
				} else {
					return _location;
				}
			},
			modifiers : function(value){
				if(value){
					_modifiers = value;
				} else {
					return _modifiers.slice();
				}
			}
		}
	};
});