define(["tile/tile"], function(Tile) {
    var Path = Class(Tile, {
        constructor: function(gameManager) {
            Path.$super.call(this, gameManager);
            this.clipping = false;
            this.container = new PIXI.Container();
            this.tileType = "Path";

            this.enableLighting(PIXI.utils.TextureCache[this.gameManager.levelTheme + "-normals"]["floor"]);
        },
        setSprite: function() {
            this.container.addChild(this.createSprite("floor"));
        },
        update: function() {
            Path.$superp.update.call(this);
        }
    });

    return Path;

});
