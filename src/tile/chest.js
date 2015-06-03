define(["tile/tile", "util/helpers", "util/anim"], function(Tile, Helpers, Animation) {
    var Chest = Class(Tile, {
        constructor: function(gameManager) {
            Chest.$super.call(this, gameManager.scene);
            this.gameManager = gameManager;
            this.hasTreasure = true;
            this.clipping = true;
            this.tileType = "Chest";
            this.openSprite = this.createSprite("grass1");
            this.closedSprite = this.createSprite("grass1");
            var chestSpeed = 4;
            /**var anims = {
                "open": Helpers.animBuilder("open", 2, doorSpeed),
                "close": Helpers.animBuilder("close", 2, doorSpeed)
            }
            this.currentAnimation = new Animation("door", anims, this.baseSprite);**/
            this.tileSprite = this.closedSprite;
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
