define(function() {
	return function(){
		return {
			//The object the option object exists within. Will be modified by the selection.
			target: null,
			//The service for the target, keeps track of all the selections remaining to be made.
			associatedService: null,
			//The selection object being chosen from
			selectionObject: null,
			//Decompose this option if valid selections made
			choose: function(selectedIndices) {
				var selectionObject = this.selectionObject;
				if (selectedIndices.length !== selectionObject.selections) {
					throw "Chose " + selectedIndices.length + " but " + selectionObject.selections + " allowed."
				}
				var associatedService = this.associatedService;
				var target = this.target;
				$.each(selectedIndices, function(index, selectedIndex) {
					var chosen = selectionObject.options[selectedIndex];

					for (var sub = 0; sub < chosen.length; sub++) {
						var fixedModifier = target['fixed modifiers'];
						var properties = Array.isArray(chosen[sub]["property"]) ? chosen[sub]["property"] : [chosen[sub]["property"]];
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
								fixedModifier.push(chosen[sub].value);
							} else if(typeof fixedModifier === 'object') {
								switch(properties[properties.length-1]){
									case "skills":
									case "characteristics":
										for(var property in chosen[sub].value){
										if(!fixedModifier[property]){
											fixedModifier[property] = chosen[sub].value[property];
										} else {
											if(typeof fixedModifier[property] === 'number'){
												fixedModifier[property] += chosen[sub].value[property];
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
				associatedService.remainingSelections().splice(associatedService.remainingSelections().indexOf(selectionObject), 1);
				this.associatedService.dirty = true;
			}
		}
	}
});