import {CharacterAdvancement} from "./CharacterAdvancement";
import {AdvanceableProperty, OnlyWarCharacter} from "../Character";
import {Characteristic} from "../Characteristic";
import {OnlyWarCharacterModifierTypes} from "../CharacterModifier";
/**
 * An advancement that improves a characteristic.
 * Created by Damien on 6/29/2016.
 */

export class CharacteristicAdvancement extends CharacterAdvancement {
    private characteristic:Characteristic;

    apply(character:OnlyWarCharacter):void {
        character.characteristics.get(this.value).advancements.push(this);
    }

    /**
     * The name of the characteristic that the advancement improves.
     * @param characteristic
     */
    constructor(value:Characteristic) {
        var characteristics = new Map<Characteristic, number>();
        characteristics.set(value, 5);
        super(AdvanceableProperty.CHARACTERISTIC,
            characteristics,
            [],
            [],
            [],
            [],
            [],
            0,
            0,
            OnlyWarCharacterModifierTypes.ADVANCEMENT);
        this.characteristic = value;
    }

    /**
     * Returns the name of the characteristic this advancement improves.
     * @returns {string}
     */
    get value():Characteristic {
        return this.characteristic;
    }

    protected applyCharacteristicModifiers(character:OnlyWarCharacter):any {
        character.characteristics.get(this.value).advancements.push(this);
    }


    public calculateExperienceCost(character:OnlyWarCharacter):number {
        var existingAdvancements:number = character.characteristics.get(this.value).advancements.length;
        var matchingAptitudes:number = 0;
        this.characteristic.aptitudes.forEach((aptitude)=> {
            if (character.aptitudes.indexOf(aptitude) !== -1) {
                matchingAptitudes++;
            }
        });
        switch (matchingAptitudes) {
            case 0:
                switch (existingAdvancements) {
                    case 0:
                        return 500;
                    case 1:
                        return 750;
                    case 2:
                        return 1000;
                    case 3:
                        return 2500;
                }
            case 1:
                switch (existingAdvancements) {
                    case 0:
                        return 250;
                    case 1:
                        return 500;
                    case 2:
                        return 750;
                    case 3:
                        return 1000;
                }
            case 2:
                switch (existingAdvancements) {
                    case 0:
                        return 100;
                    case 1:
                        return 250;
                    case 2:
                        return 500;
                    case 3:
                        return 750;
                }
        }
    }
}