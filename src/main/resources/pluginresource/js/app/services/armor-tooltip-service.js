/**
* Service for populating the tooltip that shows the armor on a hit location.
*/
define(function(){
	return function(){
		//The hit location being displayed
		var _location = null;
		//The values modifying the protection in the hit location.
		var _modifiers = [];
		return {
			get location : function(){
				return _location;
			},
			set location : function(value){
				_location = value;
			},
			get modifiers : function(){
				return _modifiers.slice();
			},
			set modifiers : function(value){
				_modifiers = value;
			}
		}
	};
});