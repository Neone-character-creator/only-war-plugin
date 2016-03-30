define(function(){
	return function($resource, $q) {
    var specialties = $resource("Character/Specialties.json").query();
    var specialtiesNameToIndex = {};

    var service = {
        specialtyNames: function() {
            var d = $q.defer();
            specialties.$promise.then(function(data) {
                for (var i = 0; i < data.length; i++) {
                    specialtiesNameToIndex[data[i].name] = i;
                }
                specialtyNames = Object.keys(specialtiesNameToIndex);
                d.resolve(specialtyNames);
            });
            return d.promise;
        },
        selected: null,
        requiredOptionSelections: [],
        dirty: false,
        selectSpecialty: function(specialtyName) {
            this.selected = Object.clone(specialties[specialtiesNameToIndex[specialtyName]]);
            this.requiredOptionSelections = this.selected['optional modifiers'];
        }
    };
    return service;
    }
});