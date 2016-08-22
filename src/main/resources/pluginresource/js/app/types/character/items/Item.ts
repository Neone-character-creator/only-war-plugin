/**
 * Created by Damien on 6/29/2016.
 */
export class Item {
    private _name:string;
    private _craftsmanship:string;
    private _weight:number;
    private _availability:string;
    private _type:ItemType;
    private _upgrades:Array<string>;

    constructor(name:string, type:ItemType, availability:string, weight?:number, upgrades?:Array<string>, craftsmanship?:string, isMainWeapon?:boolean) {
        this._name = name;
        this._availability = availability;
        if (weight) {
            this._weight = weight;
        } else {
            this._weight = 0;
        }
        if (craftsmanship) {
            this._craftsmanship = craftsmanship;
        } else {
            this._craftsmanship = "Common";
        }
        this._type = type;
        if (upgrades) {
            this._upgrades = upgrades;
        } else {
            this._upgrades = [];
        }
    }

    get name():string {
        return this._name;
    }

    get craftsmanship():string {
        return this._craftsmanship;
    }

    get weight():number {
        return this._weight;
    }

    get availability():string {
        return this._availability;
    }
    
    get type():ItemType {
        return this._type;
    }

    get upgrades():Array<string> {
        return this._upgrades;
    }
}

export enum ItemType{
    Weapon,
    Armor,
    Other
}