define(["entity/entity", "util/helpers", "util/anim", "inv/inventory"], function(Entity, Helpers, Animation, Inventory) {

    var Player = Class(Entity, {
        constructor: function(gameManager, saveData) {
            Player.$super.call(this, gameManager);

            this.inventory = new Inventory(16, saveData.inventory, {});

            this.sprites = {
                "base": Helpers.createSprite(),
                "hands": Helpers.createSprite(),
                "legs": Helpers.createSprite(),
                "chest": Helpers.createSprite(),
                "head": Helpers.createSprite(),
                "feet": Helpers.createSprite(),
                "item": Helpers.createSprite()
            };

            this.x = 64;
            this.y = 64;

            this.health = 200; //Temp health

            for (s in this.sprites) {
                this.addChild(this.sprites[s]);
            }
            this.setSize(64, 64);

            this.walkSpeed = 250;

            var standSpeed = 2;
            var actionSpeed = 5;

            var anims = {
                "stand-left": Helpers.animBuilder("stand-left", 2, standSpeed),
                "stand-right": {flip: "stand-left"},
                "stand-up" : Helpers.animBuilder("stand-up", 2, standSpeed),
                "stand-down": Helpers.animBuilder("stand-down", 2, standSpeed),

                "use-left": Helpers.animBuilder("use-left", 4, actionSpeed),
                "use-right": {flip: "use-left"},
                "use-up": Helpers.animBuilder("use-up", 4, actionSpeed),
                "use-down": Helpers.animBuilder("use-down", 4, actionSpeed),

                "walk-left" : Helpers.animBuilder("walk-left", 4, actionSpeed),
                "walk-right" : {flip: "walk-left"},
                "walk-up" : Helpers.animBuilder("walk-up", 4, actionSpeed),
                "walk-down" : Helpers.animBuilder("walk-down", 4, actionSpeed)
            };

            var testWeapon = gameManager.itemManager.generateWeapon();
            this.animGroup.addAnimationLayer(new Animation(testWeapon.framesNamespace, anims, this.sprites["item"]));

            for (var i = 0; i < this.inventory.items.length; i++) {
                this.inventory.items[i] = testWeapon;
            }

            this.animGroup.addAnimationLayer(new Animation("male-race-1", anims, this.sprites["base"]));
            this.animGroup.setAnimation("stand-down");
        },
        setLocation: function(x,y){
            this.x = x;
            this.y = y;
            this.gameManager.scene.view.setLocation(
                this.x + (this.width / 2) - this.gameManager.game.gameWidth / 2,
                this.y + (this.height / 2) - this.gameManager.game.gameHeight / 2
            );
        },
        update: function() {
            Player.$superp.update.call(this);

            var kb = this.gameManager.game.keyboard;
            var dx = 0;
            var dy = 0;
            if (kb.isKeyDown("KeyW")) dy = -this.walkSpeed;
            if (kb.isKeyDown("KeyS")) dy = this.walkSpeed;
            if (kb.isKeyDown("KeyA")) dx = -this.walkSpeed;
            if (kb.isKeyDown("KeyD")) dx = this.walkSpeed;

            if (dx !== 0 && dy !== 0) {
                //Makes hypotenusal speed the same as leg speed
                dx /= 1.41;
                dy /= 1.41;
            }

            var grid = this.gameManager.board.grid;

            var currentX = Math.round((this.x / 64));
            var currentY = Math.round((this.y / 64));
            var left = Math.ceil(this.x / 64)-1;
            var right = Math.floor(this.x / 64) + 1;
            var top = Math.ceil(this.y / 64) - 1;
            var bot = Math.floor(this.y / 64) + 1;
            //this.gameManager.board.removeChild(grid[currentX][currentY].tileSprite); USE THIS FOR DEBUGGING
            if (grid[currentX][top].clipping && dy < 0) dy = 0;
            if (grid[currentX][bot].clipping && dy > 0) dy = 0;
            if (grid[left][currentY].clipping && dx < 0) dx = 0;
            if (grid[right][currentY].clipping && dx > 0) dx = 0;

            this.walk(dx, dy);

            this.gameManager.scene.view.move(
                this.x + (this.width / 2) - this.gameManager.game.gameWidth / 2,
                this.y + (this.height / 2) - this.gameManager.game.gameHeight / 2
            );
        },
        attack: function(damage) {
            //TODO Affixes and defense handled here before calling super
            Player.$superp.attack.call(this, damage);
        }
    });

    return Player;

});
