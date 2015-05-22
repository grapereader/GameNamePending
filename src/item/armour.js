define(["item"], function(Item) {

    var Armour = Class(Item, {
        constructor: function(id, name, description, rarity, affixes, armourType, armour) {
            Armour.$super.call(this, Item.TYPES.ARMOUR, id, name, description, rarity, affixes);
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
