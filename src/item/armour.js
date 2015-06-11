define(["item/item"], function(Item) {

    var Armour = Class(Item, {
        constructor: function(name, description, rarity, affixes, framesNamespace, armourData) {
            Armour.$super.call(this, Item.TYPES.ARMOUR, name, description, rarity, affixes, framesNamespace);
            this.armourType = armourData.type;
            this.armour = armourData.armour;

            var d = this.description;

            d += "\n\n";
            d += "Armour: " + this.armour.toFixed(2);

            this.description = d;
        }
    });

    Armour.TYPES = {
        HEAD: 0,
        CHEST: 1,
        HANDS: 2,
        LEGS: 3,
        FEET: 4
    };

    Armour.EQUIP = {
        0: "head",
        1: "chest",
        2: "hands",
        3: "legs",
        4: "feet"
    };

    return Armour;
});
