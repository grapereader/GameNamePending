define(["entity/entity", "util/timer", "ai/pathfinder", "util/helpers", "util/anim"], function(Entity, Timer, Pathfinder, Helpers, Animation) {

    var Enemy = Class(Entity, {
        constructor: function(gameManager, homeX, homeY, attack, walkSpeed, dropMap, spritesheet) {
            Enemy.$super.call(this, gameManager);
            this.attack = attack;
            this.walkSpeed = walkSpeed;
            this.dropMap = dropMap;

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
            var useSpeed = 4 * attack.speed;

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

            this.animGroup.addAnimationLayer(new Animation(spritesheet, anims, this.sprite));
            this.animGroup.addAnimationLayer(new Animation("ironsword", anims, tempSprite));
            this.animGroup.setAnimation("stand-down");

            var self = this;
            this.walkTimer = new Timer(1000 / (this.walkSpeed / 64), true, function() {
                var target = self.gameManager.player;

                var targetX = target.tileX;
                var targetY = target.tileY;

                var tileX = self.tileX;
                var tileY = self.tileY;

                if ((Math.abs(tileX - targetX) > 10 && Math.abs(tileY - targetY) > 10) ||
                    (Math.abs(tileX - self.homeX) > 20 && Math.abs(tileX - self.homeX) > 20)) {
                    targetX = self.homeX;
                    targetY = self.homeY;
                }

                var path = false;

                if (targetX != tileX || targetY != tileY) {
                    var board = self.gameManager.board;
                    var finder = new Pathfinder();
                    path = finder.getPath(tileX, tileY, targetX, targetY, board);
                }

                if (path !== false && path.length > 1) {
                    //We skip the first entry, since we are already there.
                    var next = path[1];

                    //Prevents grid drift
                    self.x = self.tileX * 64;
                    self.y = self.tileY * 64;

                    self.walk(
                        (next.x - self.tileX) * self.walkSpeed, (next.y - self.tileY) * self.walkSpeed
                    );
                } else {
                    self.walk(0, 0);
                }
            });

            this.attackTimer = new Timer(1000 / this.attack.speed, true, function() {
                var player = self.gameManager.player;
                player.attack(0);
            });

            this.gridCorrectTimer = new Timer(0, false, function() {
                self.offGrid = false;
                self.walk(0, 0);
            });
        },
        update: function() {
            Enemy.$superp.update.call(this);

            var delta = this.gameManager.game.deltaTime;

            var player = this.gameManager.player;

            var xDiff = Math.abs(player.tileX - this.tileX);
            var yDiff = Math.abs(player.tileY - this.tileY);
            if (xDiff <= this.attack.range && yDiff <= this.attack.range) {
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

                if (!this.offGrid) {
                    var x = (this.tileX * 64) - this.x;
                    var y = (this.tileY * 64) - this.y;
                    var time = Math.sqrt((x * x) + (y * y)) / this.walkSpeed;
                    this.correctX = x / time;
                    this.correctY = y / time;
                    this.gridCorrectTimer.period = time * 1000;
                }
                this.offGrid = true;
            } else if (this.offGrid) {
                if (!this.gridCorrectTimer.started) {
                    this.walk(this.correctX, this.correctY);
                    this.gridCorrectTimer.started = true;
                }
                this.gridCorrectTimer.update(delta);
            } else {
                this.walkTimer.update(delta);
            }
        }
    });

    return Enemy;

});
