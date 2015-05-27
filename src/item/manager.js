define(["item/item", "item/weapon", "item/affixes"], function(Item, Weapon, affixes) {

    var ItemManager = Class({
        constructor: function() {
            console.log("Loaded " + affixes.length + " affixes");
        },
        generateWeapon: function() {
            return new Weapon("Test Weapon", "This is a weapon", Item.RARITY.COMMON,
                [], "ironsword", 1, 1, 1, 1);
        }
    });

    return ItemManager;

});
