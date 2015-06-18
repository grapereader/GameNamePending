define(["entity/entity", "util/timer", "ai/pathfinder", "util/helpers", "util/anim", "ai/movemanager"], function(Entity, Timer, Pathfinder, Helpers, Animation, MoveManager) {

    var Enemy = Class(Entity, {
        constructor: function(gameManager, homeX, homeY, level, data) {
            Enemy.$super.call(this, gameManager);
            this.level = level;
            //This will need to be balanced!
            this.attackData = data.attack;
            this.attackData.damage *= level;
            this.walkSpeed = data.walkSpeed * Math.sqrt(level);
            this.dropMap = data.dropMap;
            this.health = data.health;
            this.armour = data.armour;

            this.homeX = this.tileX = this.x = homeX;
            this.homeY = this.tileY = this.y = homeY;

            this.sprite = Helpers.createSprite();
            this.addChild(this.sprite);

            var tempSprite = Helpers.createSprite();
            this.addChild(tempSprite);

            this.x *= 64;
            this.y *= 64;

            var standSpeed = 2;
            var actionSpeed = 5;
            var useSpeed = 4 * this.attackData.speed;

            var anims = {
                "stand-left": Helpers.animBuilder("stand-left", 2, standSpeed),
                "stand-right": {
                    flip: "stand-left"
                },
                "stand-up": Helpers.animBuilder("stand-up", 2, standSpeed),
                "stand-down": Helpers.animBuilder("stand-down", 2, standSpeed),

                "use-left": Helpers.animBuilder("use-left", 4, useSpeed),
                "use-right": {
                    flip: "use-left"
                },
                "use-up": Helpers.animBuilder("use-up", 4, useSpeed),
                "use-down": Helpers.animBuilder("use-down", 4, useSpeed),

                "walk-left": Helpers.animBuilder("walk-left", 4, actionSpeed),
                "walk-right": {
                    flip: "walk-left"
                },
                "walk-up": Helpers.animBuilder("walk-up", 4, actionSpeed),
                "walk-down": Helpers.animBuilder("walk-down", 4, actionSpeed)
            };

            this.animGroup.addAnimationLayer(new Animation(data.spritesheet, anims, this.sprite));
            this.animGroup.addAnimationLayer(new Animation("ironsword", anims, tempSprite));
            this.animGroup.setAnimation("stand-down");

            var self = this;

            this.attackTimer = new Timer(1000 / this.attackData.speed, true, function() {
                var player = self.gameManager.player;
                player.attack(0);
            });

            this.moveManager = new MoveManager(this.gameManager, this);
        },
        update: function() {
            Enemy.$superp.update.call(this);

            var delta = this.gameManager.game.deltaTime;

            var player = this.gameManager.player;

            var xDiff = Math.abs(player.tileX - this.tileX);
            var yDiff = Math.abs(player.tileY - this.tileY);
            if (xDiff <= this.attackData.range && yDiff <= this.attackData.range) {
                this.walk(0, 0);
                var anim = "use-left";
                if (player.y < this.y) anim = "use-up";
                if (player.y > this.y) anim = "use-down";
                if (Math.abs(player.x - this.x) > 16) {
                    if (player.x < this.x) anim = "use-left";
                    if (player.x > this.x) anim = "use-right";
                }
                if (this.animGroup.active !== anim) {
                    this.animGroup.setAnimation(anim);
                }
                this.attackTimer.update(delta);
            } else {
                var vec = this.moveManager.getMovement(player);
                vec = vec.multiply(this.walkSpeed);
                this.walk(vec.x, vec.y);
            }

        }
    });

    return Enemy;

});
