define(function() {

    var Affix = Class({
        constructor: function(id, type, name, description, rarity, handlers, buffs) {
            this.id = id;
            this.type = type;
            this.name = name;
            this.description = description;
            this.rarity = rarity;
            this.handlers = handlers;
            this.buffs = buffs;

            for (b in this.buffs) {
                var buff = this.buffs[b];
                this.description = this.description.replace("!{" + b + "}", buff.val + (buff.type === "%" ? "%" : ""));
            }

            //console.log("Created affix " + this.description);
        }
    });

    Affix.Type = {
        ANY: 0,
        WEAPON: 1,
        ARMOUR: 2
    }

    return Affix;

});