define(["view/viewobject", "util/animgroup", "util/timer"], function(ViewObject, AnimGroup, Timer) {

    var Entity = Class(ViewObject, {
        constructor: function(gameManager) {
            Entity.$super.call(this, gameManager.scene);
            this.gameManager = gameManager;

            this.dx = 0;
            this.dy = 0;

            this.animGroup = new AnimGroup();

            this.colourMatrix = new PIXI.filters.ColorMatrixFilter();

            var self = this;
            this.damageTimer = new Timer(200, false, function() {
                self.container.filters = null;
            });
            this.damageTimer.started = false;
        },
        update: function() {
            Entity.$superp.update.call(this);

            var delta = this.gameManager.game.deltaTime;

            this.animGroup.step(delta);

            this.damageTimer.update(delta);

            //Speed is pixels/sec
            var cx = (this.dx / 1000) * delta;
            var cy = (this.dy / 1000) * delta;

            this.x += cx;
            this.y += cy;

            this.tileX = Math.round(this.x / 64);
            this.tileY = Math.round(this.y / 64);
        },
        /**
            Preferred way to move the entity, since it sets the corresponding animation.
        */
        walk: function(dx, dy) {
            if (dx > 0 && dy === 0) this.dir = 0;
            else if (dx < 0 && dy === 0) this.dir = 1;
            else if (dy > 0) this.dir = 2;
            else if (dy < 0) this.dir = 3;

            if (dx !== this.dx || dy !== this.dy) {
                this.updateAnim(dx, dy);
                this.dx = dx;
                this.dy = dy;
                //console.log("Moving " + dx + ", " + dy);
            }
        },
        updateAnim: function(dx, dy) {
            if (dx === 0 && dy === 0) {
                if (this.dir === 0) this.animGroup.setAnimation("stand-right");
                else if (this.dir === 1) this.animGroup.setAnimation("stand-left");
                else if (this.dir === 2) this.animGroup.setAnimation("stand-down");
                else if (this.dir === 3) this.animGroup.setAnimation("stand-up");
            } else {
                if (this.dir === 0) this.animGroup.setAnimation("walk-right");
                else if (this.dir === 1) this.animGroup.setAnimation("walk-left");
                else if (this.dir === 2) this.animGroup.setAnimation("walk-down");
                else if (this.dir === 3) this.animGroup.setAnimation("walk-up");
            }
        },
        attack: function(damage) {
            this.health -= damage;
            this.damageTimer.started = true;
            var matrix = [
                1.0, 0.0, 0.0, 0.0, 0.0,
                0.0, 0.2, 0.0, 0.0, 0.0,
                0.0, 0.0, 0.2, 0.0, 0.0,
                0.0, 0.0, 0.0, 0.0, 0.0
            ];
            this.colourMatrix.matrix = matrix;
            this.container.filters = [this.colourMatrix];
        },
        isDead: function() {
            return this.health <= 0;
        }
    });

    return Entity;

});
