define(function() {

    var Item = Class({
        constructor: function(type, name, description, rarity, affixes, framesNamespace) {
            this.type = type;
            this.name = name;
            this.description = description;
            this.rarity = rarity;
            this.affixes = affixes;

            this.framesNamespace = framesNamespace;
        }
    });

    Item.TYPES = {
        WEAPON: 0,
        ARMOUR: 1
    };

    Item.RARITY = {
        SHIT: 0,
        COMMON: 1,
        UNCOMMON: 2,
        RARE: 3,
        EPIC: 4,
        LEGENDARY: 5,
        UNFRIGGINBELIEVABLE: 6,
        FAROUT: 7
    }

    return Item;
});