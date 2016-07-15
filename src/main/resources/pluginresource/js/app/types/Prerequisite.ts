/**
 * A prerequisite for something. A prerequisite acts as a predicate that can be compared to a target
 * to determine if it matches the defined prerequisite.
 *
 * The matcher is a predicate function which takes the target object and returns if it meets the prerequisites.
 *
 * The generic type parameter specifies the type that the prerequisite targets.
 */
export class Prerequisites<T> {
    private _matcher:Array<any>;

    /**
     * Tests this Prerequisite object against the given target object.
     *
     * The matcher parameter is used for recursion internally and shouldn't be set by callers.
     * @param target
     */
    public match(target:any):boolean {
        return this._matcher.reduce(function (predicate, previous) {
            return previous && predicate(target);
        }, false);
    }

    constructor(matcher:Array<any>) {
        for (var i = 0; i < matcher.length; i++) {
            if (typeof matcher[i] !== "function") {
                throw "Prerequisite matchers must be functions";
            }
            if (matcher[i].arguments.length < 1) {
                throw "Prerequisite matchers must have at least 1 argument."
            }
        }
        this._matcher = matcher;
    }
}

/**
 * Marks a type that can have prerequisites.
 */
export interface HasPrerequisites<T> {
    prerequisites:Prerequisites<T>;
    meetsPrerequisites(target:T):boolean;
}