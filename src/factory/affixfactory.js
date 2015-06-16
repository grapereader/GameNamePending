define(["factory/templatefactory", "item/affix"], function(TemplateFactory, Affix) {

    var AffixFactory = Class(TemplateFactory, {
        constructor: function (gameManager) {
            AffixFactory.$super.call(this);
            this.gameManager = gameManager;

            this.templates = [
                {
                    groups: {
                        weapon: 1.0
                    },
                    data: {
                        name: "Bonus Damage",
                        desc: "This is a test affix, bonus !{damage} damage",
                        buffs: {
                            damage: [2, 5]
                        }
                    }
                },
                {
                    groups: {
                        weapon: 1.0
                    },
                    data: {
                        name: "Bonus Attack Speed",
                        desc: "This is a test affix, bonus !{attackSpeed} attack speed",
                        buffs: {
                            attackSpeed: [2, 5]
                        }
                    }
                },
                {
                    groups: {
                        weapon: 1.0
                    },
                    data: {
                        name: "Damage player",
                        desc: "This is a test affix, damages player on activate",
                        callbacks: {
                            onActivate: function(item, player) {
                                player.health /= 2;
                            }
                        }
                    }
                }
            ]
        },
        getAffix: function(confines) {
            var template = this.getTemplate(confines);
            if (template === false) return false;
            var data = template.data;

            var buffs = {};
            var desc = data.desc;

            for (var b in data.buffs) {
                var buff = data.buffs[b];

                var val = buff[0] + Math.round(Math.random() * (buff[1] - buff[0]));
                desc = desc.replace("!{" + b + "}", val + "%");
                buffs[b] = val;
            }

            return new Affix(data.name, desc, {
                buffs: buffs,
                callbacks: data.callbacks
            });
        }
    });

    return AffixFactory;

});
