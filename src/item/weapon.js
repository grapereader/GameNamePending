define(["item/item"], function(Item) {

    var Weapon = Class(Item, {
        constructor: function(id, name, description, rarity, affixes, attackSpeed, damage, criticalChance, criticalDamage) {
            Weapon.$super.call(this, Item.TYPES.WEAPON, id, name, description, rarity, affixes);
            this.attackSpeed = attackSpeed;
            this.damage = damage;
            this.criticalChance = criticalChance;
            this.criticalDamage = criticalDamage;
        }
    });

    return Weapon;
});
