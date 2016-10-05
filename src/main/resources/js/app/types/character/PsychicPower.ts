/**
 * Created by Damien on 6/29/2016.
 */
export class PsychicPower {
    private _name:String;
    private _xpCost:number;

    constructor(name:String, xpCost:number) {
        this._name = name;
        this._xpCost = xpCost;
    }

    get name() {
        return this._name;
    }

    get xpCost() {
        return this._xpCost;
    }
}