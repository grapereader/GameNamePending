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
                        health: 100,
                        armour: 10,
                        walkSpeed: 128,
                        dropMap: []
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
                        health: 200,
                        armour: 20,
                        walkSpeed: 256,
                        dropMap: []
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
