define(["tile/tile", "util/helpers", "util/anim"], function(Tile, Helpers, Animation) {
    var Door = Class(Tile, {
        constructor: function(gameManager) {
            Door.$super.call(this, gameManager.scene);
            this.gameManager = gameManager;
            this.isShut = false;
            this.clipping = false;
            this.tileType = "Door";
            this.openSprite = this.createSprite("logs");
            this.closedSprite = this.createSprite("logs");
            var doorSpeed = 4;
            /**var anims = {
                "open": Helpers.animBuilder("open", 2, doorSpeed),
                "close": Helpers.animBuilder("close", 2, doorSpeed)
            }
            this.currentAnimation = new Animation("door", anims, this.baseSprite);**/
            this.tileSprite = this.closedSprite;
        },

        update: function() {
            Door.$superp.update.call(this);
        },
        /**if(!this.currentAnimation.isFinished){
                var delta = this.gameManager.game.deltaTime;
                currentAnimation.stepAnimation(delta);
            }8/

        },
        /**
            Function that opens and closes the door
        */
        use: function() {
            if (this.currentAnimation.isFinished) {
                if (this.isShut) {
                    this.currentAnimation.setAnimation("open");
                } else {
                    this.currentAnimation.setAnimation("close");
                }
                this.isShut = !this.isShut;
                this.isClippable = !this.isClippable;
            }
        },
    });

    return Door;

});
