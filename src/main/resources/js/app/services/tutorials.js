/**
* Service for tracking tutorial messages that the user has been shown.

Each tutorial is represented by a unique key and object on the service object.

When starting up, the service will attempt to read the cookies
*/

define(function(){
	return function(cookies){
		function tutorial(name, alreadyShown){
	    	this.name = name;
	    	this.alreadyShown = alreadyShown;
	    }

		var tutorials = {
			ready : false,
			_init : function(){
				var retrievedCookies = cookies.get("tutorials");
				if(retrievedCookies){
					this.tutorials = JSON.parse(retrievedCookies );
				}
			},
			show : function(name){
				if(!this[name]){
					this[name] = new tutorial(name, true);
				} else {
					this[name].alreadyShown = true;
				}
				cookies.set("tutorials", JSON.stringify(tutorials.tutorials));
			},
			tutorials : {}
		};
		tutorials.tutorials.show = tutorials.show;
		if(!tutorials.ready){
			tutorials._init();
		}
		return tutorials.tutorials
	};
});