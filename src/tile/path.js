define(["tile/tile", "util/helpers", "util/anim"], function(Tile, Helpers, Animation) {
	var Path = Class(Tile, {
        constructor: function(gameManager) {
            Path.$super.call(this, gameManager);
            this.gameManager = gameManager;
            this.clippable = true;
            this.tileSprite = this.createSprite("wood1");
            this.addChild(this.tileSprite);
        },
        update: function(){
        	Path.$superp.update.call(this);
        }
    });

    return Path;

});
