define(function(){
	return function(){
		var _displayed = null;
		return {
			get displayed(){return _displayed;},
			set displayed(displayed){_displayed = displayed;}
		};
	}
})