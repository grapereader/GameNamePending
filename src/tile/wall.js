define(["tile/tile", "util/helpers", "util/anim"], function(tile, Helpers, Animation) {
	var Wall = Class(Tile, {
        constructor: function(gamemanager) {
            Wall.$super.call(this, gameManager.scene);
            this.gameManager = gameManager;
            this.isClippable = false;
            this.tileSprite = this.createSprite();
            this.addChild(this.tileSprite);
        },
 
        update: function(){
        	Wall.$superp.update.call(this);
        },

        createSprite: function() {
            var sprite = new PIXI.Sprite(PIXI.utils.TextureCache[Helpers.sprite("blank.png")]);
            sprite.scale.x = 2;
            sprite.scale.y = 2;
            sprite.anchor.x = 0.5;
            sprite.anchor.y = 0.5;

            sprite.x = 32;
            sprite.y = 32;

            return sprite;
        }
    });

    return Wall;

});
