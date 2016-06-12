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
			get location(){
				return _location;
			},
			set location(value){
				_location = value;
			},
			get modifiers (){
				return _modifiers.slice();
			},
			set modifiers(value){
				_modifiers = value;
			}
		}
	};
});