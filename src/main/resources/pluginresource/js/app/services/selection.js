/**
Service for decomposing a collection of possible values into a collection of actual values.

This service was designed for situations where users are given a number of options to choose from.

This service provides no sanity checking; it is the responsibility of the caller to ensure that the selection object
remains unchanged through to completion and that the indices given to the choose function are valid.
*/
define(function() {
	return function(){
		return {
			//The selection object being chosen from
			selectionObject: null,
			//The most recently chosen values
			selected: [],
			//Decompose this option if valid selections made.
			choose: function(selectedIndices) {
				var selectionObject = this.selectionObject;
				if (selectedIndices.length !== selectionObject.selections) {
					throw "Chose " + selectedIndices.length + " but " + selectionObject.selections + " allowed."
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