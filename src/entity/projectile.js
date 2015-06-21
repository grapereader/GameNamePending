define(["entity/entity", "util/helpers", "math/vector"], function(Entity, Helpers, Vector) {

    var Projectile = Class(Entity, {
        constructor: function(gameManager, x, y, velocity, damage) {
            Projectile.$super.call(this, gameManager);
            this.container.x = this.x = this.initX = x;
            this.container.y = this.y = this.initY = y;

            this.dx = velocity.x;
            this.dy = velocity.y;

            this.damage = damage;

            var tempSprite = Helpers.createSprite();
            tempSprite.texture = PIXI.utils.TextureCache[Helpers.sprite("projectile/temp-projectile.png")];
            tempSprite.rotation = velocity.getAngle();
            this.addChild(tempSprite);
        },
        update: function() {
            Projectile.$superp.update.call(this);

            var dist = new Vector(this.x - this.initX, this.y - this.initY).getMagnitude();
            if (dist > 10 * 64) {
                this.pendingRemoval = true;
            }

            var player = this.gameManager.player;
            if (this.getDistVector(player).getMagnitude() < 16) {
                player.attack(this.damage);
                this.pendingRemoval = true;
            }

            var tileX = Math.round(this.x / 64);
            var tileY = Math.round(this.y / 64);
            if (this.gameManager.board.grid[tileX][tileY].clipping) {
                this.pendingRemoval = true;
            }
        }
    });

    return Projectile;

});
