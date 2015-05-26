define(["view/viewobject", "util/animgroup"], function(ViewObject, AnimGroup) {

    var Entity = Class(ViewObject, {
        constructor: function(gameManager) {
            Entity.$super.call(this, gameManager.scene);
            this.gameManager = gameManager;

            this.dx = 0;
            this.dy = 0;

            this.animGroup = new AnimGroup();
        },
        update: function() {
            Entity.$superp.update.call(this);

            var delta = this.gameManager.game.deltaTime;

            this.animGroup.step(delta);

            this.x += this.dx * delta / 17;
            this.y += this.dy * delta / 17;
        },
        /**
            Preferred way to move the entity, since it sets the corresponding animation.
        */
        walk: function(dx, dy) {
            if (dx !== this.dx || dy !== this.dy) {
                if (dx === 0 && dy === 0) {
                    if (this.dx > 0 && this.dy === 0) this.animGroup.setAnimation("stand-right");
                    else if (this.dx < 0 && this.dy === 0) this.animGroup.setAnimation("stand-left");
                    else if (this.dy > 0) this.animGroup.setAnimation("stand-down");
                    else if (this.dy < 0) this.animGroup.setAnimation("stand-up");
                } else {
                    if (dx > 0 && dy === 0) this.animGroup.setAnimation("walk-right");
                    else if (dx < 0 && dy === 0) this.animGroup.setAnimation("walk-left");
                    else if (dy > 0) this.animGroup.setAnimation("walk-down");
                    else if (dy < 0) this.animGroup.setAnimation("walk-up");
                }
                this.dx = dx;
                this.dy = dy;
                //console.log("Moving " + dx + ", " + dy);
            }
        }
    });

    return Entity;

});
