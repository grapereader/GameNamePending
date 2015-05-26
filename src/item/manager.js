define(["item/item", "item/weapon"], function(Item, Weapon) {

    var ItemManager = Class({
        constructor: function() {
        },
        generateWeapon: function() {
            return new Weapon("Test Weapon", "This is a weapon", Item.RARITY.COMMON,
                [], "ironsword", 1, 1, 1, 1);
        }
    });

    return ItemManager;

});
