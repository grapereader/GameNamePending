define(["factory/templatefactory", "entity/enemy", "entity/rangedenemy"], function(TemplateFactory, Enemy, RangedEnemy) {

    var ENEMY_TYPES = {
        MELEE: 0,
        RANGED: 1
    };

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
                    type: ENEMY_TYPES.MELEE,
                    data: {
                        name: "Testing Enemy",
                        spritesheet: "male-race-1",
                        attack: {
                            damage: 5,
                            speed: 2
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
                    type: ENEMY_TYPES.MELEE,
                    data: {
                        name: "Stupid Enemy",
                        spritesheet: "male-race-1",
                        attack: {
                            damage: 10,
                            speed: 4
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
                },
                {
                    groups: {
                        all: 1.0,
                        generic: 1.0,
                        ranged: 1.0
                    },
                    type: ENEMY_TYPES.RANGED,
                    data: {
                        name: "Stupid Ranged Enemy",
                        spritesheet: "male-race-1",
                        attack: {
                            damage: 10,
                            speed: 4,
                            range: 256,
                            projectileSpeed: 256
                        },
                        health: 20,
                        armour: 20,
                        walkSpeed: 128,
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
            var classes = [Enemy, RangedEnemy];
            return new classes[this.currentTemplate.type](this.gameManager, tileX, tileY, this.level, data);
        }
    });

    return EnemyFactory;

});
