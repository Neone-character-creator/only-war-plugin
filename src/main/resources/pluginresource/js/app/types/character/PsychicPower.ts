/**
 * Created by Damien on 6/29/2016.
 */
export class PsychicPower {
    private _name:String;
    private _xpCost:number;
    private _isBonus:boolean;

    get name() {
        return this._name;
    }

    get xpCost() {
        return this._xpCost;
    }

    get isBonus() {
        return this._isBonus;
    }

    set isBonus(value:boolean) {
        this._isBonus = value;
    }
}