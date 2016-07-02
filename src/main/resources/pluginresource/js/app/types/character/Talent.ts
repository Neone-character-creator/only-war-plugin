import {Prerequisites, HasPrerequisites} from "../Prerequisite";
import {OnlyWarCharacter} from "./Character";
/**
 * Created by Damien on 6/28/2016.
 */
export class Talent implements HasPrerequisites<OnlyWarCharacter> {
    prerequisites:Prerequisites<OnlyWarCharacter>;

    meetsPrerequisites(target:OnlyWarCharacter):boolean {
        return this.prerequisites.match(target);
    }

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
}