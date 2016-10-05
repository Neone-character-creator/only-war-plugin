/**
 * Represents a character trait.
 * Created by Damien on 6/29/2016.
 */
export class Trait {
    private _name:String;
    private _description:String;
    private _rating:number;

    constructor(name:String, description:String, rating?:number) {
        this._name = name;
        this._description = description;
        this._rating = rating;
    }

    get name():String {
        return this._name;
    }

    get description():String {
        return this._description;
    }


    get rating():number {
        return this._rating;
    }
}