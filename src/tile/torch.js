define(["tile/tile", "util/helpers", "util/anim"], function(Tile, Helpers, Animation) {
    var Torch = Class(Tile, {
        constructor: function(gameManager) {
            Torch.$super.call(this, gameManager);
            this.isLit = true;
            this.clipping = true;
            this.container = new PIXI.Container();
            this.tileType = "Torch";
            this.openSprite = this.createSprite("rock1");
            this.closedSprite = this.createSprite("rock1");
            this.container.addChild(this.closedSprite);
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
