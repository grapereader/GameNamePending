define(["item/item"], function(Item) {

    var Armour = Class(Item, {
        constructor: function(name, description, rarity, affixes, framesNamespace, armourType, armour) {
            Armour.$super.call(this, Item.TYPES.ARMOUR, name, description, rarity, affixes, framesNamespace);
            this.armourType = armourType;
            this.armour = armour;
        }
    });

    Armour.TYPES = {
        HEAD: 0,
        CHEST: 1,
        ARMS: 2,
        LEGS: 3,
        FEET: 4
    };

    return Armour;
});
