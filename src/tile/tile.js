define(["view/viewobject", "util/helpers"], function(ViewObject,Helpers) {

	var Tile = Class(ViewObject, {
        constructor: function(gameManager) {
            Tile.$super.call(this, gameManager.scene);
            this.gameManager = gameManager;
            this.clippable = true;
            this.animations = [];
        },
        
        update: function(){
        	Tile.$superp.update.call(this);
        },
        createSprite: function(spriteLocation) {
            var sprite = new PIXI.Sprite(PIXI.utils.TextureCache["tiles-1"][spriteLocation]);
            sprite.scale.x = 2;
            sprite.scale.y = 2;
            //sprite.anchor.x = 0.5;
            //sprite.anchor.y = 0.5;

            sprite.x = 100;
            sprite.y = 100;

            return sprite;
        },
        /**
            Add an animation (util/anim) to the Tile. Potientally useful for animated decorations.
        */
        addAnimationLayer: function(animation) {
            this.animations.push(animation);
        },
        removeAnimationLayer: function(animation) {
            this.animations.splice(this.animations.indexOf(animation), 1);
        },
        setAnimation: function(anim) {
            for (var i = 0; i < this.animations.length; i++) {
                this.animations[i].setAnimation(anim);
            }
        }
    });

    return Tile;

});
