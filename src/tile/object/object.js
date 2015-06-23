define(["tile/tile"], function(Tile) {

    var TileObject = Class(Tile, {
        constructor: function(gameManager) {
            TileObject.$super.call(this, gameManager);
        },
        //Don't call super function, which will improperly cull
        //an object with relative position.
        update: function() {}
    });

    return TileObject;

})
