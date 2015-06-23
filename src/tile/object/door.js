define(["tile/object/object", "util/helpers", "util/anim"], function(TileObject, Helpers, Animation) {
    var Door = Class(TileObject, {
        constructor: function(gameManager) {
            Door.$super.call(this, gameManager);
            this.isShut = false;
            this.clipping = false;
            this.container = new PIXI.Container();
            this.tileType = "Door";
            this.openSprite = this.createSprite("logs");
            this.closedSprite = this.createSprite("logs");
            var doorSpeed = 4;
            /**var anims = {
                "open": Helpers.animBuilder("open", 2, doorSpeed),
                "close": Helpers.animBuilder("close", 2, doorSpeed)
            }
            this.currentAnimation = new Animation("door", anims, this.baseSprite);**/
            this.container.addChild(this.closedSprite);
        },

        update: function() {
            Door.$superp.update.call(this);
        },


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
