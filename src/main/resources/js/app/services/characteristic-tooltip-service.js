define(function(){
	return function(){
	var _displayed = null;
	return {
		displayed : function(value){
			if (value){
				_displayed = value;
			} else {
				return _displayed;
			}
		}
	};
	}
})