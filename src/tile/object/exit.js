define(["tile/object/object"], function(TileObject) {

    var Exit = Class(TileObject, {
        constructor: function(gameManager) {
            Exit.$super.call(this, gameManager);
            this.clipping = true;
            this.container = new PIXI.Container();
            this.tileType = "Exit";
            this.container.addChild(this.createSprite("rock1", "tiles-1"));

            this.registerInteraction("Next level", function() {
                gameManager.switchLevel();
            });
        },
        update: function() {
            Exit.$superp.update.call(this);
        }
    });

    return Exit;

});
