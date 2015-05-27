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
                if (buff.val.min !== undefined && buff.val.max !== undefined) {
                    var min = buff.val.min;
                    var max = buff.val.max;
                    buff.val = min + Math.floor(Math.random() * ((max - min) + 1));
                }
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
