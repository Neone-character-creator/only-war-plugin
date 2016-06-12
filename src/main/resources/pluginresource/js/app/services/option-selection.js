
define(function() {
	return function(){
		var service = {
			//The object the option object exists within. Will be modified by the selection.
			target: null,
			associatedService : null,
			//The selection object being chosen from
			selectionObject : null,
			//The values to be applied
			selected: null,
			//Decompose this option if valid selections made
			applySelection: function() {
				var target = this.target;
				$.each(this.selected, function(index, selected) {
					for (var sub = 0; sub < selected.length; sub++) {
						var fixedModifier = target['fixed modifiers'];
						var properties = Array.isArray(selected[sub]["property"]) ? selected[sub]["property"] : [selected[sub]["property"]];
							for (var p = 0; p < properties.length; p++) {
							if (fixedModifier[properties[p]] === undefined) {
								switch (properties[p]) {
									case 'character kit':
									case 'characteristics':
									case "skills":
										fixedModifier[properties[p]] = {};
										break;
									case "talents":
									case 'other weapons':
									case 'armor':
									case 'other gear':
										fixedModifier[properties[p]] = [];
										break;
								};
							}
							fixedModifier = fixedModifier[properties[p]];
						};
							if(Array.isArray(fixedModifier)){
								fixedModifier.push(selected[sub].value);
							} else if(typeof fixedModifier === 'object') {
								switch(properties[properties.length-1]){
									case "skills":
									case "characteristics":
										for(var property in selected[sub].value){
										if(!fixedModifier[property]){
											fixedModifier[property] = selected[sub].value[property];
										} else {
											if(typeof fixedModifier[property] === 'number'){
												fixedModifier[property] += selected[sub].value[property];
											} else {
												throw "Tried to use a skill or characteristic rating that wasn't a number."
											}
										}
									}
									break;
									default:
										throw "Not implemented"
								}
							}
						}
				});
				this.associatedService.remainingSelections().splice(this.associatedService.remainingSelections().indexOf(this.selectionObject), 1);
				this.associatedService.dirty = true;
			}
		}
		return service;
	}
});