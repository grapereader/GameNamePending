define(["item/item", "item/weapon", "item/affixes", "item/armour"], function(Item, Weapon, affixes, Armour) {

    var ItemManager = Class({
        constructor: function() {
            console.log("Loaded " + affixes.length + " affixes");
        },
        generateWeapon: function() {
            return new Weapon("Test Weapon", "This is a weapon", Item.RARITY.COMMON, [], "ironsword", {
                damage: 1,
                attackSpeed: 0.5, //Attack speed is in seconds/hit
                criticalChance: 1,
                criticalDamage: 1
            });
        },
        generateArmours: function() {
            return [
                new Armour("Test Helm", "This is a helmet", Item.RARITY.COMMON, [], "ironhelm", {
                    type: Armour.TYPES.HEAD,
                    armour: 1
                }),
                new Armour("Test Chest", "This is a chestplate", Item.RARITY.COMMON, [], "ironchest", {
                    type: Armour.TYPES.CHEST,
                    armour: 1
                }),
                new Armour("Test Legs", "These are leggings", Item.RARITY.COMMON, [], "ironlegs", {
                    type: Armour.TYPES.LEGS,
                    armour: 1
                }),
                new Armour("Test Boots", "These are boots", Item.RARITY.COMMON, [], "ironboots", {
                    type: Armour.TYPES.FEET,
                    armour: 1
                }),
                new Armour("Test Gloves", "These are gloves", Item.RARITY.COMMON, [], "irongloves", {
                    type: Armour.TYPES.HANDS,
                    armour: 1
                })
            ];
        }
    });

    return ItemManager;

});
