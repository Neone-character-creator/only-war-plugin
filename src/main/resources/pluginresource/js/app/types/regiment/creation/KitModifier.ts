import {Item, ItemType} from "../../character/items/Item";
import * as angular from "angular";
import {Regiment} from "../../character/Regiment";
import {Armor} from "../../character/items/Armor";
import {Weapon} from "../../character/items/Weapon";
/**
 * Represents a modifier that can be applied to the equipment of a regiment as it is being created.
 *
 * Three types exist:
 * Add, which adds an entirely new item to the kit.
 * Replace remove a particular item and adds another in it's place.
 * Upgrade changes a value on a particular item.
 *
 * Created by Damien on 7/24/2016.
 */
export abstract class KitModifier {
    private _description:string;
    private _kitPointCost:number;
    private _type:KitModifierType;

    constructor(description:string, kitPointCost:number, type:KitModifierType) {
        this._description = description;
        this._kitPointCost = kitPointCost;
        this._type = type;
    }

    get type():KitModifierType {
        return this._type;
    }

    /**
     * Description of the kit modifier.
     * @returns {string}
     */
    get description():string {
        return this._description;
    }

    /**
     * The number of kit points it costs to apply this modifier
     * @returns {number}
     */
    get kitPointCost():number {
        return this._kitPointCost;
    }

    /**
     * Applies the effect of the modifier to the given equipment kit.
     * @param kit
     * @return  the modifications from applying this modifier
     */
    abstract apply(kit:Map<Item, number>):KitModifierResult;

}

/**
 *  This Kit Modifier upgrades an item within the kit with another.
 */
export class UpgradeItemKitModifier extends KitModifier {
    private _matcher:any;
    private _upgrade:any;

    constructor(description:string, kitPointCost:number, matcher:any, upgrade:any) {
        super(description, kitPointCost, KitModifierType.Upgrade);
        this._matcher = matcher;
        this._upgrade = upgrade;
    }

    apply(kit:Map<Item, number>, affectedItems?:Array<Item>):KitModifierResult {
        if (!affectedItems) {
            throw "Array of items to be upgraded required.";
        }
        var added:Map<Item, number> = new Map();
        var removed:Map<Item, number> = new Map();
        for (var item of affectedItems) {
            if (!this.matches(item)) {
                throw "Tried to apply a modifier to an item it cannot affect.";
            }
            if (!kit.has(item)) {
                throw "Tried to apply a kit modifier targeting an item the kit doesn't contain.";
            }
            if (kit.get(item) == 0) {
                kit.delete(item);
            } else {
                kit.set(item, kit.get(item) - 1);
            }
            removed.set(item, 1);
            let upgradedItem;
            switch (item.type) {
                case ItemType.Weapon:
                    let weapon = <Weapon>item;
                    upgradedItem = new Weapon(weapon.name, weapon.availability, weapon.class, weapon.range, weapon.rateOfFire, weapon.damage, weapon.penetration, weapon.clip, weapon.reload, weapon.special, weapon.weight, weapon.isMainWeapon, this._upgrade.upgrades ? item.upgrades.concat(this._upgrade.upgrades) : item.upgrades, this._upgrade.craftsmanship ? this._upgrade.craftsmanship : item.craftsmanship);
                    break;
                case ItemType.Armor:
                    let armor = <Armor>item;
                    upgradedItem = new Armor(item.name, item.availability, armor.locations, armor.ap, armor.armorType, armor.weight, this._upgrade.upgrades ? item.upgrades.concat(this._upgrade.upgrades) : item.upgrades, this._upgrade.craftsmanship ? this._upgrade.craftsmanship : item.craftsmanship)
                    break;
                case ItemType.Other:
                    upgradedItem = new Item(item.name, item.type, item.availability, item.weight, this._upgrade.upgrades ? item.upgrades.concat(this._upgrade.upgrades) : item.upgrades, this._upgrade.craftsmanship ? this._upgrade.craftsmanship : item.craftsmanship)
                    break;
            }
            added.set(upgradedItem, 1);
            kit.set(upgradedItem, 1);
        }
        return {
            itemsAdded: added,
            itemsRemoved: removed,
            modifier: this
        };
    }


    get matcher():any {
        return this._matcher;
    }

    get upgrade():any {
        return this._upgrade;
    }

    matches(item:Item) {
        for (var property in this._matcher) {
            if (!angular.equals(item[property], this._matcher[property])) {
                return false;
            }
        }
        return true;
    }
}

/**
 * A kit modifier for replacing an item within the kit with another.
 */
export class ReplaceItemKitModifier extends KitModifier {
    private _matcher:any;
    private _replacements:Map<Item, number>;

    constructor(description:string, kitPointCost:number, matcher, replacement:Map<Item, number>) {
        super(description, kitPointCost, KitModifierType.Replace);
        this._matcher = matcher;
        this._replacements = replacement;
    }

    apply(kit:Map<Item, number>, toRemove?:Array<Item>):KitModifierResult {
        var removed:Map<Item,number> = new Map();
        for (var existingItem of toRemove) {
            if (this.matches(existingItem)) {
                removed.set(existingItem, 1);
                if (kit.get(existingItem) == 1) {
                    kit.delete(existingItem);
                } else {
                    kit.set(existingItem, kit.get(existingItem) - 1);
                }
            }
        }

        for (let replacementEntry of this._replacements.entries()) {
            let existingCount = kit.get(replacementEntry[0]);
            if (!existingCount) {
                existingCount = 0;
            }
            kit.set(replacementEntry[0], kit.get(replacementEntry[0]) + existingCount);
        }
        return {
            itemsAdded: this._replacements,
            itemsRemoved: removed,
            modifier: this
        }
    }

    matches(item:Item) {
        for (var property in this._matcher) {
            if (!angular.equals(item[property], this._matcher[property])) {
                return false;
            }
        }
        return true;
    }


    get matcher():any {
        return this._matcher;
    }

    get replacements():Map<Item, number> {
        return this._replacements;
    }
}

export class AddSpecificItemKitModifier extends KitModifier {
    private _itemsToAdd:Map<Item, number>;

    constructor(description:string, kitPointCost:number, itemToAdd:Map<Item,number>) {
        super(description, kitPointCost, KitModifierType.AddSpecific);
        this._itemsToAdd = itemToAdd;
    }

    apply(kit:Map<Item, number>) {
        for (let additionEntry of this._itemsToAdd.entries()) {
            let existingCount = kit.get(additionEntry[0]);
            if (!existingCount) {
                existingCount = 0;
            }
            kit.set(additionEntry[0], kit.get(additionEntry[0]) + existingCount);
        }
        return {
            itemsAdded: this._itemsToAdd,
            itemsRemoved: new Map(),
            modifier: this
        }
    }


    get itemsToAdd():Map<Item, number> {
        return this._itemsToAdd;
    }
}

export class AddItemMatchingPropertiesKitModifier extends KitModifier {
    private _matcher:any;

    constructor(description:string, kitPointCost:number, matcher:any) {
        super(description, kitPointCost, KitModifierType.AddMatching);
        this._matcher = matcher;
    }

    apply(kit:Map<Item, number>, itemsToAdd?:Map<Item, number>) {
        if (!itemsToAdd) {
            throw "Map of items to add required.";
        }
        for (let additionEntry of itemsToAdd.entries()) {
            let existingCount = kit.get(additionEntry[0]);
            if (!existingCount) {
                existingCount = 0;
            }
            kit.set(additionEntry[0], kit.get(additionEntry[0]) + existingCount);
        }
        return {
            itemsAdded: itemsToAdd,
            itemsRemoved: new Map(),
            modifier: this
        }
    }

    matches(item:Item) {
        for (var property in this._matcher) {
            if (!angular.equals(item[property], this._matcher[property])) {
                return false;
            }
        }
        return true;
    }


    get matcher():any {
        return this._matcher;
    }
}

export class AddFavoredItemKitModifier extends KitModifier {
    private _category:string;

    constructor(description:string, kitPointCost:number, category:string) {
        super(description, kitPointCost, KitModifierType.AddFavored);
        switch (category) {
            case "Basic":
            case "Heavy":
                break;
            default:
                throw "type may be either Heavy or Basic, but was " + category + ".";
        }
        this._category = category;
    }


    apply(kit:Map<Item, number>):KitModifierResult {
        return {
            itemsAdded: new Map(),
            itemsRemoved: new Map(),
            modifier: this
        }
    }


    get category():string {
        return this._category;
    }
}

export enum KitModifierType{
    Replace,
    Upgrade,
    AddSpecific,
    AddMatching,
    AddFavored
}

export interface KitModifierResult {
    itemsAdded:Map<Item, number>;
    itemsRemoved:Map<Item, number>;
    modifier:KitModifier;
}