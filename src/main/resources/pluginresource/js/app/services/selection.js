define(function() {
	return function(){
		return {
			//The selection object being chosen from
			selectionObject: null,
			//The most recently chosen values
			selected: [],
			//Decompose this option if valid selections made
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