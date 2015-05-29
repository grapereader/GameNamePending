define(["entity/entity", "util/timer", "ai/pathfinder", "util/helpers", "util/anim"], function(Entity, Timer, Pathfinder, Helpers, Animation) {

    var Enemy = Class(Entity, {
        constructor: function(gameManager, homeX, homeY, damage, attackSpeed, walkSpeed, dropMap, spritesheet) {
            Enemy.$super.call(this, gameManager);
            this.damage = damage;
            this.attackSpeed = attackSpeed;
            this.walkSpeed = walkSpeed;
            this.dropMap = dropMap;

            this.homeX = this.tileX = this.x = homeX;
            this.homeY = this.tileY = this.y = homeY;

            this.sprite = Helpers.createSprite();
            this.addChild(this.sprite);

            this.x *= 64;
            this.y *= 64;

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

            this.animGroup.addAnimationLayer(new Animation(spritesheet, anims, this.sprite));
            this.animGroup.setAnimation("stand-down");

            var self = this;
            this.walkTimer = new Timer(1000 / (this.walkSpeed / 64), function() {
                var target = self.gameManager.player;

                var targetX = target.tileX;
                var targetY = target.tileY;

                var tileX = self.tileX;
                var tileY = self.tileY;

                if ((Math.abs(tileX - targetX) > 10 && Math.abs(tileY - targetY) > 10)
                || (Math.abs(tileX - self.homeX) > 20 && Math.abs(tileX - self.homeX) > 20)) {
                    targetX = self.homeX;
                    targetY = self.homeY;
                }

                var path = false;

                if (targetX != tileX || targetY != tileY) {
                    var board = self.gameManager.board;
                    var finder = new Pathfinder();
                    path = finder.getPath(tileX, tileY, targetX, targetY, board);
                }

                if (path !== false && path.length > 0) {
                    //We skip the first entry, since we are already there.
                    var next = path[1];

                    self.walk(
                        (next[0] - self.tileX) * self.walkSpeed,
                        (next[1] - self.tileY) * self.walkSpeed
                    );
                } else {
                    self.walk(0, 0);
                }
            });
        },
        update: function() {
            Enemy.$superp.update.call(this);

            var delta = this.gameManager.game.deltaTime;
            this.walkTimer.update(delta);
        }
    });

    return Enemy;

});
