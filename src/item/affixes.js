define(["item/affix"], function(Affix) {
    return [
        new Affix(0, Affix.Type.WEAPON, "Bonus Damage", "This is a test affix, bonus !{damage} damage", 5, {}, {
            damage: {
                type: "%",
                val: 5
            }
        }),
        new Affix(1, Affix.Type.WEAPON, "Bonus Attack Speed", "This is a test affix, bonus !{attackSpeed} attack speed", 5, {}, {
            attackSpeed: {
                type: "%",
                val: { //I figure we can reduce work by making some things random.
                    min: 2,
                    max: 5
                }
            }
        }),
        new Affix(2, Affix.Type.WEAPON, "Damage Player", "This is a test affix, damages player on activate", 5, {
            activate: function(item, player) {
                player.health /= 2;
            }
        }, {})
    ];
});
