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

    var EnemyUtils = {
        getLeveledEnemy: function(gameManager, tileX, tileY, level) {
            var data = enemies[Math.floor(Math.random() * enemies.length)];
            return new Enemy(gameManager, tileX, tileY, level, data);
        }
    }

    return EnemyUtils;

});
