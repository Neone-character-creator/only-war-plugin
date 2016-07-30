import {Item, ItemType, Availability, Craftsmanship} from "./Item";
/**
 * Created by Damien on 7/9/2016.
 */
export class Armor extends Item {
    private locations:Array<string>;
    private ap:number;

    constructor(name:String, availability:Availability, locations:Array<string>, ap:number, weight?:Number, craftsmanship?:Craftsmanship) {
        super(name, ItemType.Armor, availability, weight, craftsmanship);
        this.locations = locations;
        this.ap = ap;
    }
}