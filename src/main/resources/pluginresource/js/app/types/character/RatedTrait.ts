import {Trait} from "./Trait";
/**
 * Created by Damien on 7/6/2016.
 */
export class RatedTrait extends Trait {

    private _rating:number;

    constructor(name:String, description:String, rating:number) {
        super(name, description);
        this._rating = rating;
    }


    get rating():number {
        return this._rating;
    }
}