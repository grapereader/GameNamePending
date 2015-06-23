define(["tile/object/object", "util/helpers", "util/anim"], function(TileObject, Helpers, Animation) {
    var Chest = Class(TileObject, {
        constructor: function(gameManager) {
            Chest.$super.call(this, gameManager);
            this.hasTreasure = true;
            this.clipping = true;
            this.tileType = "Chest";
            this.openSprite = this.createSprite("grass1");
            this.container = new PIXI.Container();
            this.closedSprite = this.createSprite("grass1");
            var chestSpeed = 4;
            /**var anims = {
                "open": Helpers.animBuilder("open", 2, doorSpeed),
                "close": Helpers.animBuilder("close", 2, doorSpeed)
            }
            this.currentAnimation = new Animation("door", anims, this.baseSprite);**/
            this.container.addChild(this.closedSprite);
        },

        update: function() {
            Chest.$superp.update.call(this);
        },
        use: function() {
            if (this.currentAnimation.isFinished) {
                if (this.hasTreasure) {
                    this.currentAnimation.setAnimation("chestOpen");
                }
                this.hasTreasure = false;
            }
        },
    });

    return Chest;

});
