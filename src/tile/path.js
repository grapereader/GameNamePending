define(["tile/tile", "util/helpers", "util/anim"], function(Tile, Helpers, Animation) {
	var Path = Class(Tile, {
        constructor: function(gameManager) {
            Path.$super.call(this, gameManager);
            this.gameManager = gameManager;
            this.clipping = false;
            this.tileSprite = this.createSprite("wood1");
        },
        update: function(){
        	Path.$superp.update.call(this);
        }
    });

    return Path;

});
