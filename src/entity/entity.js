define(["view/viewobject"], function(ViewObject) {

    var Entity = Class(ViewObject, {
        constructor: function(gameManager) {
            Entity.$super.call(this, gameManager.scene);
            this.gameManager = gameManager;

            this.dx = 0;
            this.dy = 0;

            this.animations = [];
        },
        update: function() {
            Entity.$superp.update.call(this);

            var delta = this.gameManager.game.deltaTime;

            this.x += this.dx * delta / 17;
            this.y += this.dy * delta / 17;

            for (var i = 0; i < this.animations.length; i++) {
                this.animations[i].stepAnimation(delta);
            }
        },
        /**
            Preferred way to move the entity, since it sets the corresponding animation.
        */
        walk: function(dx, dy) {
            if (dx !== this.dx || dy !== this.dy) {
                if (dx === 0 && dy === 0) {
                    if (this.dx > 0 && this.dy === 0) this.setAnimation("stand-right");
                    else if (this.dx < 0 && this.dy === 0) this.setAnimation("stand-left");
                    else if (this.dy > 0) this.setAnimation("stand-down");
                    else if (this.dy < 0) this.setAnimation("stand-up");
                } else {
                    if (dx > 0 && dy === 0) this.setAnimation("walk-right");
                    else if (dx < 0 && dy === 0) this.setAnimation("walk-left");
                    else if (dy > 0) this.setAnimation("walk-down");
                    else if (dy < 0) this.setAnimation("walk-up");
                }
                this.dx = dx;
                this.dy = dy;
                //console.log("Moving " + dx + ", " + dy);
            }
        },
        /**
            Add an animation (util/anim) to the entity. These animations are all
            controlled by movement, so layers of armour, hair, weapons, etc
            are all automatically integrated into the system.
        */
        addAnimationLayer: function(animation) {
            this.animations.push(animation);
        },
        removeAnimationLayer: function(animation) {
            this.animations.splice(this.animations.indexOf(animation), 1);
        },
        setAnimation: function(anim) {
            for (var i = 0; i < this.animations.length; i++) {
                this.animations[i].setAnimation(anim);
            }
        }
    });

    return Entity;

});
