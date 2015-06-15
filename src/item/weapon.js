define(["item/item"], function(Item) {

    var Weapon = Class(Item, {
        constructor: function(name, description, rarity, affixes, framesNamespace, weaponData) {
            Weapon.$super.call(this, Item.TYPES.WEAPON, name, description, rarity, affixes, framesNamespace);
            this.attackSpeed = weaponData.attackSpeed;
            this.damage = weaponData.damage;
            this.range = weaponData.range;
            this.criticalChance = weaponData.criticalChance;
            this.criticalDamage = weaponData.criticalDamage;

            var d = this.description;

            d += "\n\n";
            d += "Damage: " + this.damage.toFixed(2) + "\n";
            d += "Speed: " + this.attackSpeed.toFixed(2) + " sec/swing\n";
            d += "Range: " + this.range.toFixed(2) + "\n";
            d += "Crit %: " + this.criticalChance.toFixed(2) + "\n";
            d += "Crit Damage: " + this.criticalDamage.toFixed(2);

            this.description = d;
        }
    });

    return Weapon;
});
