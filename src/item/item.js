define(function() {

    var Item = Class({
        constructor: function(type, id, name, description, rarity, affixes) {
            this.type = type;
            this.id = id;
            this.name = name;
            this.description = description;
            this.rarity = rarity;
            this.affixes = affixes;
        }
    });

    Item.TYPES = {
        WEAPON: 0,
        ARMOUR: 1
    };

    return Item;
});
