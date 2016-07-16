/**
 * A prerequisite for something. A prerequisite acts as a predicate that can be compared to a target
 * to determine if it matches the defined prerequisite.
 *
 * The matcher is a predicate function which takes the target object and returns if it meets the prerequisites.
 *
 * The generic type parameter specifies the type that the prerequisite targets.
 */
export class Prerequisite<T> {
    private _matcher:Array<any>;

    /**
     * Tests this Prerequisite object against the given target object.
     *
     * The matcher parameter is used for recursion internally and shouldn't be set by callers.
     * @param target
     */
    public match(target:T):boolean {
        return !this._matcher || this._matcher.map(predicate=> {
                return predicate(target);
            }).reduce((previous, current, currentIndex)=> {
                if (current === undefined) {
                    throw "The predicate at " + currentIndex + " in this Prerequisite returned undefined";
                }
                return previous && current;
            }, true);
    }

    constructor(matcher?:Array<any>) {
        if (matcher) {
            for (var i = 0; i < matcher.length; i++) {
                if (typeof matcher[i] !== "function") {
                    throw "Prerequisite matchers must be functions";
                }
            }
            this._matcher = matcher;
        }
    }
}

/**
 * Marks a type that can have prerequisites.
 */
export interface HasPrerequisites<T> {
    prerequisites:Array<Prerequisite<T>>;
    meetsPrerequisites(target:T):boolean;
}