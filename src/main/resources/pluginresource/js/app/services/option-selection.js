define(function () {
    return function () {
        var service = {
            //The object the option object exists within. Will be modified by the selection.
            target: null,
            associatedService: null,
            //The selection object being chosen from
            selectionObject: null,
            //The values to be applied
            selected: null,
            //Decompose this option if valid selections made
            applySelection: function () {
                var _this = this;
                var target = this.target;
                $.each(this.selected, function (index, selected) {
                    _this = _this;
                    for (var sub = 0; sub < selected.length; sub++) {
                        switch (selected[sub].property) {
                            case "talent":
                                target.talents.push(selected[sub].value);
                                break;
                            case "skills":
                                target.skills.push(selected[sub].value);
                                break;
                            case "characteristics":
                                for (var property in selected[sub].value) {
                                    if (!fixedModifier[property]) {
                                        fixedModifier[property] = selected[sub].value[property];
                                    } else {
                                        if (typeof fixedModifier[property] === 'number') {
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
                });
                target.optionalModifiers.splice(target.optionalModifiers.indexOf(this.selectionObject), 1);
            }
        }
        return service;
    }
});