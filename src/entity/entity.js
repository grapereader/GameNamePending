define(["view/viewobject", "util/animgroup", "util/timer", "item/itemdrop", "math/vector"], function(ViewObject, AnimGroup, Timer, ItemDrop, Vector) {

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

            this.pendingRemoval = false;
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
            if (dx !== this.dx || dy !== this.dy) {
                this.dx = dx;
                this.dy = dy;
                this.updateDir();
                this.updateAnim();
            }
        },
        updateDir: function() {
            var angle = new Vector(this.dx, this.dy).getAngle();

            if (angle < (1 * Math.PI) / 4 || angle > (7 * Math.PI) / 4) this.dir = 0;
            else if (angle < (3 * Math.PI) / 4 && angle > (1 * Math.PI) / 4) this.dir = 2;
            else if (angle < (5 * Math.PI) / 4 && angle > (3 * Math.PI) / 4) this.dir = 1;
            else if (angle < (7 * Math.PI) / 4 && angle > (5 * Math.PI) / 4) this.dir = 3;
        },
        updateAnim: function() {
            if (this.dx === 0 && this.dy === 0) {
                if (this.dir === 0) this.animGroup.setAnimationOnce("stand-right");
                else if (this.dir === 1) this.animGroup.setAnimationOnce("stand-left");
                else if (this.dir === 2) this.animGroup.setAnimationOnce("stand-down");
                else if (this.dir === 3) this.animGroup.setAnimationOnce("stand-up");
            } else {
                if (this.dir === 0) this.animGroup.setAnimationOnce("walk-right");
                else if (this.dir === 1) this.animGroup.setAnimationOnce("walk-left");
                else if (this.dir === 2) this.animGroup.setAnimationOnce("walk-down");
                else if (this.dir === 3) this.animGroup.setAnimationOnce("walk-up");
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

            if (this.isDead()) {
                if (this.dropMap !== undefined && this.dropMap.length > 0) {
                    do {
                        var groups = this.dropMap[Math.floor(Math.random() * this.dropMap.length)];
                    } while (groups.rarity < Math.random());
                    if (typeof groups.count === "number") {
                        var count = groups.count;
                    } else {
                        var count = groups.count[0] + Math.round(Math.random() * (groups.count[1] - groups.count[0]));
                    }
                    var dropRadius = count * 64;
                    for (var i = 0; i < count; i++) {
                        var item = this.gameManager.itemFactory.getItem(groups.confines);
                        var drop = new ItemDrop(this.gameManager, item, {
                            x: this.x,
                            y: this.y
                        }, {
                            x: this.x + ((Math.random() * dropRadius) - (dropRadius / 2)),
                            y: this.y + ((Math.random() * dropRadius) - (dropRadius / 2))
                        });
                        this.gameManager.board.addItemDrop(drop);
                    }
                }
                this.pendingRemoval = true;
            }
        },
        isDead: function() {
            return this.health <= 0;
        },
        getDistVector: function(entity) {
            return new Vector(entity.x - this.x, entity.y - this.y);
        }
    });

    return Entity;

});
