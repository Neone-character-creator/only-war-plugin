define(function() {
	return function($resource, $q, characteroptions) {
	var selected;

	return {
		selected: function() {
			return selected;
		},
		remainingSelections: function() {
			if (selected) {
				return selected['optional modifiers']
			} else {
				return [];
			};
		},
		complete: false,
		selectSpecialty: function(specialty) {
			selected = Object.clone(specialty);
			this.requiredOptionSelections = selected['optional modifiers'];
		}
	};
}
});