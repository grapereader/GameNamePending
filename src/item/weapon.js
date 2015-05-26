define(["item/item"], function(Item) {

    var Weapon = Class(Item, {
        constructor: function(name, description, rarity, affixes, framesNamespace, attackSpeed, damage, criticalChance, criticalDamage) {
            Weapon.$super.call(this, Item.TYPES.WEAPON, name, description, rarity, affixes, framesNamespace);
            this.attackSpeed = attackSpeed;
            this.damage = damage;
            this.criticalChance = criticalChance;
            this.criticalDamage = criticalDamage;
        }
    });

    return Weapon;
});
