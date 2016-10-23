/// <reference path="../../../index.d.ts" />
import {Item, ItemType} from "../../../app/types/character/items/Item";
import {
    ReplaceItemKitModifier,
    KitModifierType,
    UpgradeItemKitModifier, AddSpecificItemKitModifier, AddItemMatchingPropertiesKitModifier
} from "../../../app/types/regiment/creation/KitModifier";
/**
 * Created by Damien on 8/4/2016.
 */
describe("In the standard regimental kit modifiers", ()=> {
    var kit:Map<Item, number>;
    beforeEach(()=> {
        kit = new Map();
    })
    it("one can improve the craftsmanship of an item of Common craftsmanship to Good craftsmanship", ()=> {
        var item = new Item("", ItemType.Other, "", 0, [], "Common");
        kit.set(item, 1);
        var expected = new Item("", ItemType.Other, "", 0, [], "Good");
        var replacementItems:Map<Item, number> = new Map();
        var modifier = new UpgradeItemKitModifier("", 0, {
                craftsmanship: "Common"
            },
            {
                craftsmanship: "Good"
            });
        modifier.apply(kit, [item]);
        expect(Array.from(kit.keys()).find((item)=> {
            return true;
        })).toEqual(expected);
        expect(kit.get(Array.from(kit.keys()).find(item=> {
            return item.craftsmanship === "Good";
        }))).toEqual(1);
    });
    it("one can improve the craftsmanship of an item of Common craftsmanship to Best craftsmanship", ()=> {
        var item = new Item("", ItemType.Other, "", 0, [], "Common");
        kit.set(item, 1);
        var expected = new Item("", ItemType.Other, "", 0, [], "Best");
        var modifier = new UpgradeItemKitModifier("", 0, {
                craftsmanship: "Common"
            },
            {
                craftsmanship: "Best"
            });
        modifier.apply(kit, [item]);
        expect(Array.from(kit.keys()).find((item)=> {
            return true;
        })).toEqual(expected);
        expect(kit.get(Array.from(kit.keys()).find(item=> {
            return item.craftsmanship === "Best";
        }))).toEqual(1);
    });
    it("one can replace a laspistol with a lascarbine", ()=> {
        var laspistol = new Item("Laspistol", ItemType.Other, "", 0, []);
        kit.set(laspistol, 1);
        var lascarbine = new Item("Lascarbine", ItemType.Other, "", 0, []);
        var itemsToAdd:Map<Item, number> = new Map();
        itemsToAdd.set(lascarbine, 1);
        var modifier = new ReplaceItemKitModifier("", 0, {
                name: "Laspistol"
            },
            itemsToAdd);
        modifier.apply(kit);
        expect(Array.from(kit.keys()).find((item)=> {
            return true;
        })).toEqual(lascarbine);
        expect(kit.get(Array.from(kit.keys()).find(item=> {
            return item.name === "Lascarbine";
        }))).toEqual(1);
    });
    it("one can replace a lascarbine with a M36 lasgun", ()=> {
        var item = new Item("Lascarbine", ItemType.Other, "", 0, []);
        kit.set(item, 1);
        var lasgun = new Item("M36 Lasgun", ItemType.Other, "", 0, []);
        var replacements:Map<Item, number> = new Map();
        replacements.set(lasgun, 1);
        var modifier = new ReplaceItemKitModifier("", 0, {
            name: "Lascarbine"
        }, replacements);
        modifier.apply(kit);
        expect(Array.from(kit.keys()).find((item)=> {
            return true;
        })).toEqual(lasgun);
        expect(kit.get(Array.from(kit.keys()).find(item=> {
            return item.name === "M36 Lasgun";
        }))).toEqual(1);
    });
    it("one can add an additional knife to the kit", ()=> {
        var knife = new Item("Knife", ItemType.Weapon, "Common");
        var itemsToAdd:Map<Item, number> = new Map();
        itemsToAdd.set(knife, 1);
        var modifier = new AddSpecificItemKitModifier("", 0, itemsToAdd);
        modifier.apply(kit);
        expect(kit.get(knife)).toEqual(1);
    });
    it("one can add a laspistol and 2 charge packs", ()=> {
        var laspistol = new Item("Laspistol", ItemType.Weapon, "");
        var chargePack = new Item("Charge Pack (Pistol)", ItemType.Other, "");
        var itemsToAdd:Map<Item,number> = new Map();
        itemsToAdd.set(laspistol, 1);
        itemsToAdd.set(chargePack, 2);
        var modifier = new AddSpecificItemKitModifier("", 0, itemsToAdd);
        modifier.apply(kit);
        expect(kit.get(laspistol)).toEqual(1);
        expect(kit.get(chargePack)).toEqual(2);
    });
    it("one can add an autopistol and 2 clips", ()=> {
        var autopistol = new Item("Autopistol", ItemType.Weapon, "");
        var chargePack = new Item("Charge Pack (Pistol)", ItemType.Other, "");
        var itemsToAdd:Map<Item,number> = new Map();
        itemsToAdd.set(autopistol, 1);
        itemsToAdd.set(chargePack, 2);
        var modifier = new AddSpecificItemKitModifier("", 0, itemsToAdd);
        modifier.apply(kit);
        expect(kit.get(autopistol)).toEqual(1);
        expect(kit.get(chargePack)).toEqual(2);
    });
    it("one can add a stub automatic and 2 clips", ()=> {
        var stubAutomatic = new Item("Stub Automatic", ItemType.Weapon, "");
        var clip = new Item("Clip", ItemType.Other, "");
        var itemsToAdd:Map<Item,number> = new Map();
        itemsToAdd.set(stubAutomatic, 1);
        itemsToAdd.set(clip, 2);
        var modifier = new AddSpecificItemKitModifier("", 0, itemsToAdd);
        modifier.apply(kit);
        expect(kit.get(stubAutomatic)).toEqual(1);
        expect(kit.get(clip)).toEqual(2);
    });
    it("one can add a stub revolver and 2 clips", ()=> {
        var stubrevolver = new Item("Stub revolver", ItemType.Weapon, "");
        var clip = new Item("Clip", ItemType.Other, "");
        var itemsToAdd:Map<Item,number> = new Map();
        itemsToAdd.set(stubrevolver, 1);
        itemsToAdd.set(clip, 2);
        var modifier = new AddSpecificItemKitModifier("", 0, itemsToAdd);
        modifier.apply(kit);
        expect(kit.get(stubrevolver)).toEqual(1);
        expect(kit.get(clip)).toEqual(2);
    });
    it("one can replace a M36 Lasgun with a shotgun and 4 clips", ()=> {
        var lasgun = new Item("M36 Lasgun", ItemType.Weapon, "", 0, []);
        kit.set(lasgun, 1);
        var shotgun = new Item("Shotgun", ItemType.Weapon, "", 0, []);
        var clip = new Item("Clip", ItemType.Other, "", 0, []);
        var itemsToAdd:Map<Item, number> = new Map();
        itemsToAdd.set(shotgun, 1);
        itemsToAdd.set(clip, 4);
        var modifier = new ReplaceItemKitModifier("", 0, {
                name: "M36 Lasgun"
            },
            itemsToAdd);
        modifier.apply(kit);
        for (var item of kit.keys()) {
            switch (item.name) {
                case "Shotgun":
                    expect(kit.get(item)).toEqual(1);
                    break;
                case "Clip":
                    expect(kit.get(item)).toEqual(4);
                    break;
            }
        }
    });
    it("one can add one item of ubiquitous availability", ()=> {
        var properties:Map<string,any> = new Map();
        properties.set("availability", "Ubiquitous");
        var modifier = new AddItemMatchingPropertiesKitModifier("", 0, properties);
        var itemToAdd = new Item("", ItemType.Other, "Ubiquitous");
        let toAdd = new Map();
        toAdd.set(itemToAdd, 1);
        modifier.apply(kit, toAdd);
        expect(kit.get(itemToAdd)).toEqual(1);
    });
});