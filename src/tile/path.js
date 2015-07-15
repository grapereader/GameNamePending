define(["tile/tile"], function(Tile) {
    var Path = Class(Tile, {
        constructor: function(gameManager) {
            Path.$super.call(this, gameManager);
            this.clipping = false;
            this.container = new PIXI.Container();
            this.tileType = "Path";
        },
        setSprite: function() {
            var sprite = this.createSprite("floor");
            this.container.addChild(sprite);
        },
        update: function() {
            Path.$superp.update.call(this);
        }
    });

    return Path;

});
