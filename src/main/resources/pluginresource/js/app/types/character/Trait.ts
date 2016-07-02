/**
 * Represents a character trait.
 * Created by Damien on 6/29/2016.
 */
export class Trait {
    private _name:String;
    private _description:String;

    constructor(name:String, description:String) {
        this._name = name;
        this._description = description;
    }

    get name():String {
        return this._name;
    }

    get description():String {
        return this._description;
    }
}