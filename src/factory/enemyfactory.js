define(["factory/templatefactory", "entity/enemy"], function(TemplateFactory, Enemy) {

    var EnemyFactory = Class(TemplateFactory, {
        constructor: function(gameManager) {
            EnemyFactory.$super.call(this);
            this.gameManager = gameManager;

            this.level = 1;

            this.templates = [
                {
                    groups: {
                        all: 1.0,
                        generic: 1.0,
                        melee: 1.0
                    },
                    data: {
                        name: "Testing Enemy",
                        spritesheet: "male-race-1",
                        attack: {
                            damage: 5,
                            speed: 2,
                            range: 0
                        },
                        health: 10,
                        armour: 10,
                        walkSpeed: 128,
                        dropMap: [
                            {
                                rarity: 1.0,
                                confines: ["all"],
                                count: [0, 2]
                            },
                            {
                                //Results in a greater chance of dropping a shit weapon.
                                rarity: 0.1,
                                confines: ["weapon", "shit"],
                                count: 1
                            }
                        ]
                    }
                },
                {
                    groups: {
                        all: 1.0,
                        generic: 1.0,
                        melee: 1.0
                    },
                    data: {
                        name: "Stupid Enemy",
                        spritesheet: "male-race-1",
                        attack: {
                            damage: 10,
                            speed: 4,
                            range: 0
                        },
                        health: 20,
                        armour: 20,
                        walkSpeed: 256,
                        dropMap: [
                            {
                                //Will always drop one armour
                                chance: 1.0,
                                confines: ["armour"],
                                count: 1
                            }
                        ]
                    }
                }
            ];
        },
        nextRandom: function(confines) {
            this.currentTemplate = this.getTemplate(confines);
        },
        getLeveledEnemy: function(tileX, tileY) {
            var data = this.currentTemplate.data;
            return new Enemy(this.gameManager, tileX, tileY, this.level, data);
        }
    });

    return EnemyFactory;

});
