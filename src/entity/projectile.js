define(["entity/entity", "util/helpers", "math/vector"], function(Entity, Helpers, Vector) {

    var Projectile = Class(Entity, {
        constructor: function(gameManager, x, y, velocity, damage) {
            Projectile.$super.call(this, gameManager);
            this.x = this.initX = x;
            this.y = this.initY = y;

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
        }
    });

    return Projectile;

});
