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
						var properties;
						if (Array.isArray(chosen[sub]["property"])) {
							for (var p = 0; p < properties.length; p++) {
							if (fixedModifier[properties[p]] === undefined) {
								switch (properties[p]) {
									case 'character kit':
									case 'characteristics':
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
						} else {
							fixedModifier = fixedModifier[chosen[sub]['property']];
							if(Array.isArray(fixedModifier)){
								fixedModifier.push(chosen[sub].value);
							} else if(typeof fixedModifier === 'object') {
								fixedModifier[chosen[sub].property] = chosen[sub].value;
							}
						}
					}
				})
				associatedService.remainingSelections().splice(associatedService.remainingSelections().indexOf(selectionObject), 1);
				this.associatedService.dirty = true;
			}

		}
	}
});