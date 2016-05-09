define(function() {
	return function($resource, $q, characteroptions) {
	var _selected;

	return {
		selected: function() {
			return _selected;
		},
		remainingSelections: function() {
			if (_selected) {
				return _selected['optional modifiers']
			} else {
				return [];
			};
		},
		complete: false,
		selectSpecialty: function(specialty) {
			_selected = angular.copy(specialty);
			this.requiredOptionSelections = _selected['optional modifiers'];
		}
	};
}
});