define(["tile/tile", "util/helpers", "util/anim"], function(Tile, Helpers, Animation) {
    var Torch = Class(Tile, {
        constructor: function(gameManager) {
            Torch.$super.call(this, gameManager.scene);
            this.gameManager = gameManager;
            this.isLit = true;
            this.clipping = true;
            this.tileType = "Torch";
            this.openSprite = this.createSprite("rock1");
            this.closedSprite = this.createSprite("rock1");
            this.tileSprite = this.closedSprite;
        },

        update: function() {
            Torch.$superp.update.call(this);
        },
        use: function() {
            this.isLit = !this.isLit;
        },
    });

    return Torch;

});
