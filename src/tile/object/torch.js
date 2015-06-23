define(["tile/object/object", "util/helpers", "util/anim"], function(TileObject, Helpers, Animation) {
    var Torch = Class(TileObject, {
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
