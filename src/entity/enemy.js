define(["entity/entity", "util/timer", "ai/pathfinder"], function(Entity, Timer, Pathfinder) {

    var Enemy = Class(Entity, {
        constructor: function(gameManager, homeX, homeY, damage, attackSpeed, walkSpeed, dropMap) {
            Enemy.$super.call(this, gameManager);
            this.damage = damage;
            this.attackSpeed = attackSpeed;
            this.walkSpeed = walkSpeed;
            this.dropMap = dropMap;

            this.homeX = this.x = homeX;
            this.homeY = this.y = homeY;

            this.currentPath = null;

            var self = this;
            this.aiTimer = new Timer(100, function() {
                //We use a random distribution to spread out the AI logic
                //across the enemies so performance is more balanced
                if (Math.random() > 0.8) {
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

                    if (targetX != tileX || targetY != tileY) {
                        var board = self.gameManager.board;
                        var finder = new Pathfinder();
                        self.currentPath = finder.getPath(tileX, tileY, targetX, targetY, board);
                    } else {
                        self.currentPath = null;
                    }
                }
            });
        },
        update: function() {
            Enemy.$superp.update.call(this);
            var delta = this.gameManager.game.deltaTime;
            this.aiTimer.update(delta);

            if (this.currentPath != null && this.currentPath.length > 0) {
                var next = this.currentPath[0];

                if (tileX == next.x && tileY == next.y) {
                    this.currentPath.splice(0, 1);
                }

                this.dx = (next.x - tileX) * speed * delta;
                this.dy = (next.y - tileY) * speed * delta;
            }
        }
    });

    return Enemy;

});
