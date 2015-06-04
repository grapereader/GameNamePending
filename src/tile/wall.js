define(["tile/tile", "util/helpers", "util/anim"], function(Tile, Helpers, Animation) {
    var Wall = Class(Tile, {
        constructor: function(gameManager) {
            Wall.$super.call(this, gameManager);
            this.clipping = true;
            this.container = new PIXI.Container();
            this.tileType = "Wall";
            this.container.addChild(this.createSprite("rock3"));
        },
        update: function() {
            Wall.$superp.update.call(this);
        },
    });

    return Wall;

});
