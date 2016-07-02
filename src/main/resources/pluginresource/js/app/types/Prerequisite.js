/**
 * A prerequisite for something. A prerequisite acts as a predicate that can be compared to a target object
 * to determine if the specified property or properties on it match with a comparison object.
 *
 * A simple Prerequisite consists of an array of strings specifying the properties to
 * traverse on the target and the matcher object.
 *
 * If the target property is an object, it is compared to the matcher. If all properties
 * on the matcher is equal to that on the target, they match.
 *
 * If the target property is an array, the matcher is compared against each value in the
 * target array and matches if it matches ANY value in it.
 *
 * How the comparison is made depends on the type of the target property.
 *
 * The generic type parameter specifies the type that the prerequisite targets.
 */
export class Prerequisites {
    /**
     * Tests this Prerequisite object against the given target object.
     *
     * The matcher parameter is used for recursion internally and shouldn't be set by callers.
     * @param target
     */
    match(target, matcher = this._comparisonObject) {
        return this._match(target, this._comparisonObject);
    }
    _match(target, matcher) {
        var matches = false;
        //If the comparison object is empty, it matches every target.
        if (Object.keys(this._comparisonObject).length === 0) {
            return true;
        }
        var propertyStack = [];
        for (var property in this._comparisonObject) {
            if (typeof matcher[property] !== target[property]) {
                throw "The type of the property " + property + " isn't the same on the matcher and target objects.";
            }
            //If the property on the target object is also an object, recursively match against it.
            if (typeof target[property] === "object") {
                matches = this._match(target[property], matcher[property]);
                if (!matches) {
                    break;
                }
            }
            matches = target[property];
        }
        return matches;
    }
}
//# sourceMappingURL=Prerequisite.js.map