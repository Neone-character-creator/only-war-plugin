define(["../types/character/Characteristic"], function (Characteristic) {
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
                            case "skill":
                                target.skills.set(selected[sub].value.skill, selected[sub].value.rank);
                                break;
                            case "characteristic":
                                for (var property in selected[sub].value) {
                                    if (typeof selected[sub].value[property] === 'number') {
                                        if (!target['fixed modifiers']['characteristics']) {
                                            target['fixed modifiers']['characteristics'] = {};
                                        }
                                        var previousValue = target['fixed modifiers']['characteristics'][property];
                                        if (previousValue) {
                                            target['fixed modifiers']['characteristics'][property] += selected[sub].value[property];
                                        } else {
                                            target['fixed modifiers']['characteristics'][property] = selected[sub].value[property];
                                        }
                                    } else {
                                        throw "Tried to use a skill or characteristic rating that wasn't a number."
                                    }
                                }
                                break;
                            case "character kit":
                                $.each(selected, function (i, entry) {
                                    var existingItemCount = target.kit.get(entry.value.item);
                                    if (existingItemCount) {
                                        target.kit.set(entry.value.item, target.kit.get(entry.value.item) + existingItemCount);
                                    } else {
                                        target.kit.set(entry.value.item, entry.value.count);
                                    }
                                });
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