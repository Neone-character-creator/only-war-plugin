/**
 * Created by Damien on 6/29/2016.
 */
export class Item {
    private _name:String;
    private _craftsmanship:Craftsmanship;
    private _weight:Number;
    private _availability:Availability;
    private _type:ItemType;

    constructor(name:String, type:ItemType, availability:Availability, weight?:Number, craftsmanship?:Craftsmanship) {
        this._name = name;
        this._craftsmanship = craftsmanship;
        this._availability = availability;
        if (weight) {
            this._weight = weight;
        } else {
            this._weight = 0;
        }
        if (craftsmanship) {
            this._craftsmanship = craftsmanship;
        } else {
            this._craftsmanship = Craftsmanship.Common;
        }
        this._type = type;
    }

    get name():String {
        return this._name;
    }

    get craftsmanship():Craftsmanship {
        return this._craftsmanship;
    }

    get weight():Number {
        return this._weight;
    }


    get availability():Availability {
        return this._availability;
    }
}

export enum Craftsmanship{
    Poor = 1,
    Common,
    Good,
    Best
}

export enum ItemType{
    Weapon,
    Armor,
    Other
}

export enum Availability{
    Ubiquitous,
    Abundant,
    Plentiful,
    Common,
    Average,
    Scarce,
    Rare,
    Very_Rare,
    Extremely_Rare,
    Near_Unique,
    Unique
}