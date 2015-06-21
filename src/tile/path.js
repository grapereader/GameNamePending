define(["tile/tile", "util/helpers", "util/anim"], function(Tile, Helpers, Animation) {
    var Path = Class(Tile, {
        constructor: function(gameManager) {
            Path.$super.call(this, gameManager);
            this.clipping = false;
            this.container = new PIXI.Container();
            this.tileType = "Path";
            this.container.addChild(this.createSprite("wood1"));
        },
        update: function() {
            Path.$superp.update.call(this);
        }
    });

    return Path;

});
