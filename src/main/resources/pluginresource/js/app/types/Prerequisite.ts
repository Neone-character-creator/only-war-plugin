/**
 * A prerequisite for something. A prerequisite acts as a predicate that can be compared to a target
 * to determine if it matches the defined prerequisite.
 *
 * The matcher is a predicate function which takes the target object and returns if it meets the prerequisites.
 *
 * The generic type parameter specifies the type that the prerequisite targets.
 */
export class Prerequisite<T> {
    private _predicate:Function;

    /**
     * Tests this Prerequisite object against the given target object.
     *
     * The matcher parameter is used for recursion internally and shouldn't be set by callers.
     * @param target
     */
    public match(target:T):boolean {
        return this._predicate === undefined || this._predicate(target);
    }

    constructor(predicate?:Function) {
        if (predicate) {
            this._predicate = predicate;
        }
    }
}

/**
 * Marks a type that can have prerequisites.
 */
export interface HasPrerequisites<T> {
    prerequisites:Prerequisite<T>;
    meetsPrerequisites(target:T):boolean;
}