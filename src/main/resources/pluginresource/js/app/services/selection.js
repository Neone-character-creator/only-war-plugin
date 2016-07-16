/**
Service for decomposing a collection of possible values into a collection of actual values.

This service was designed for situations where users are given a number of options to choose from.

This service provides no sanity checking; it is the responsibility of the caller to ensure that the selection object
remains unchanged through to completion and that the indices given to the choose function are valid.
*/
define(function() {
	return function(){
		var _selectionObject = null;
		return {
			//The selection object being chosen from
			set selectionObject(value){
				if (typeof value.numSelectionsNeeded !== "number") {
					throw "Selection object selections value must be a number but was " + typeof value.selections;
				}
				if(!Array.isArray(value.options)){
					throw "Selection object options value must be an array.";
				}
				if(value.selections < 1){
					throw "Selection object needs to require at least 1 selection.";
				}
				if(value.selections > value.options.length){
					throw "Selection object can't require more selections than the number of options it has."
				}
				_selectionObject = value;
			},
			get selectionObject(){return _selectionObject},
			//The most recently chosen values
			selected: [],
			//Decompose this option if valid selections made.
			choose: function(selectedIndices) {
				var selectionObject = this.selectionObject;
				if (selectedIndices.length !== selectionObject.numSelectionsNeeded) {
					throw "Chose " + selectedIndices.length + " but " + selectionObject.numSelectionsNeeded + " allowed."
				}
				var chosen = [];
				$.each(selectedIndices, function(index, selectedIndex) {
					chosen.push(selectionObject.options[selectedIndex]);
				});
				this.selected = chosen;
			}
		}
	}
});