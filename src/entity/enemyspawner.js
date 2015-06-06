define(["entity/enemy"], function(Enemy) {

    var enemies = [
        {
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
        },
        {
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
    ];

    var EnemySpawner = Class({
        constructor: function(gameManager) {
            this.gameManager = gameManager;
            this.enemyPointer = 0;
            this.level = 1;
        },
        nextRandom: function() {
            this.enemyPointer = Math.floor(Math.random() * enemies.length);
        },
        getLeveledEnemy: function(tileX, tileY) {
            var data = enemies[this.enemyPointer];
            return new Enemy(this.gameManager, tileX, tileY, this.level, data);
        }
    });

    return EnemySpawner;

});
