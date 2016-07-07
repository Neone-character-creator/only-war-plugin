/**
 * Created by Damien on 6/29/2016.
 */
export class Item {
    private _name:String;
    private _craftsmanship:ItemCraftsmanship;
    private _weight:Number;

    constructor(name:String, craftsmanship:ItemCraftsmanship, weight?:Number) {
        this._name = name;
        this._craftsmanship = craftsmanship;
        if (weight) {
            this._weight = weight;
        } else {
            this._weight = 0;
        }
    }

    get name():String {
        return this._name;
    }

    get craftsmanship():ItemCraftsmanship {
        return this._craftsmanship;
    }

    get weight():Number {
        return this._weight;
    }
}

export enum ItemCraftsmanship{
    POOR,
    COMMON,
    GOOD,
    BEST
}