import {Item} from "./Item";
/**
 * Created by Damien on 7/9/2016.
 */
export class Weapon extends Item {
    private _class:string;
    private _range:string;
    private _rateOfFire:string;
    private _damage:string;
    private _penetration:number;
    private _clip:number;
    private _reload:string;
    private _special:Array<String>;

    get class():string {
        return this._class;
    }

    get range():string {
        return this._range;
    }

    get rateOfFire():string {
        return this._rateOfFire;
    }

    get damage():string {
        return this._damage;
    }

    get penetration():number {
        return this._penetration;
    }

    get clip():number {
        return this._clip;
    }

    get reload():string {
        return this._reload;
    }

    get special():Array<String> {
        return this._special;
    }
}