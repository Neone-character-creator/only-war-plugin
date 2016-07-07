import {Prerequisites, HasPrerequisites} from "../Prerequisite";
import {OnlyWarCharacter} from "./Character";
/**
 * Created by Damien on 6/28/2016.
 */
export class Talent implements HasPrerequisites<OnlyWarCharacter> {
    /**
     * The name of the talent.
     */
    private _name:String;
    /**
     * The source of the talent.
     */
    private _source:String;
    /**
     * The tier of the talent.
     */
    private _tier:number;
    private _specialization:string;
    private _aptitudes:Array<string>;
    prerequisites:Prerequisites<OnlyWarCharacter>;
    /**
     * The maximum number of times this talent can be
     */
    private _maxTimesPurchaseable;

    meetsPrerequisites(target:OnlyWarCharacter):boolean {
        return this.prerequisites.match(target);
    }

    get name():String {
        return this._name;
    }

    get source():String {
        return this._source;
    }

    get tier():number {
        return this._tier;
    }

    get specialization():string {
        return this._specialization;
    }

    get aptitudes():Array<string> {
        return this._aptitudes;
    }

    get maxTimesPurchaseable() {
        return this._maxTimesPurchaseable;
    }

    constructor(name:String, source:String, tier:number, specialization?:string, prerequisites?:Prerequisites<OnlyWarCharacter>, maxTimesPurchaseable?:number) {
        this.prerequisites = prerequisites;
        this._name = name;
        this._source = source;
        this._tier = tier
        this._specialization = specialization;
        if (maxTimesPurchaseable) {
            this._maxTimesPurchaseable = maxTimesPurchaseable;
        } else {
            this._maxTimesPurchaseable = 1;
        }
    }
}