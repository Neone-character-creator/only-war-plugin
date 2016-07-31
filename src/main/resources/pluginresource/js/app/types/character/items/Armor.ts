import {Item, ItemType, Availability, Craftsmanship} from "./Item";
/**
 * Created by Damien on 7/9/2016.
 */
export class Armor extends Item {
    private _locations:Array<string>;
    private _ap:number;
    private _armorType:string;

    constructor(name:String, availability:Availability, locations:Array<string>, ap:number, armorType:string, weight?:Number, craftsmanship?:Craftsmanship) {
        super(name, ItemType.Armor, availability, weight, craftsmanship);
        this._locations = locations;
        this._ap = ap;
        this._armorType = armorType;
    }

    get locations():Array<string> {
        return this._locations;
    }

    get ap():number {
        return this._ap;
    }

    get armorType():string {
        return this._armorType;
    }
}