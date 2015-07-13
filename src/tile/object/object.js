define(["tile/tile"], function(Tile) {

    var TileObject = Class(Tile, {
        constructor: function(gameManager) {
            TileObject.$super.call(this, gameManager);

            this.container = new PIXI.Container();

            this.interactive = false;
        },
        registerInteraction: function(message, callback) {
            this.interactive = true;
            this.interactionMessage = message;
            this.callback = callback;
        },
        interact: function() {
            if (this.interactive) this.callback();
        },
        //Don't call super function, which will improperly cull
        //an object with relative position.
        update: function() {}
    });

    return TileObject;

});
