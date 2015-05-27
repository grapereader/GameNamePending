define(["tile/tile", "util/helpers", "util/anim"], function(Tile, Helpers, Animation) {
	var Wall = Class(Tile, {
        constructor: function(gameManager) {
            Wall.$super.call(this, gameManager);
            this.gameManager = gameManager;
            this.clipping = true;
            this.tileSprite = this.createSprite("rock3");
            this.addChild(this.tileSprite);
        },
        update: function(){
        	Wall.$superp.update.call(this);
        }
    });

    return Wall;

});
