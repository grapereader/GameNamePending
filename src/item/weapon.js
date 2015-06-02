define(["item/item"], function(Item) {

    var Weapon = Class(Item, {
        constructor: function(name, description, rarity, affixes, framesNamespace, weaponData) {
            Weapon.$super.call(this, Item.TYPES.WEAPON, name, description, rarity, affixes, framesNamespace);
            this.attackSpeed = weaponData.attackSpeed;
            this.damage = weaponData.damage;
            this.criticalChance = weaponData.criticalChance;
            this.criticalDamage = weaponData.criticalDamage;
        }
    });

    return Weapon;
});
