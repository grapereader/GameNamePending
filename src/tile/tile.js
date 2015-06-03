define(["view/viewobject", "util/helpers"], function(ViewObject, Helpers) {

    var Tile = Class({
        constructor: function(gameManager) {
            this.gameManager = gameManager;
            this.clipping = false;
            this.tileType = "Empty";
            this.tileSprite = new PIXI.Sprite.fromImage("assets/sprites/blank.png");
            this.animations = [];
        },
        update: function() {},
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
        toJSON: function() {
            var tile = {
                type: this.tileType,
                x: this.tileSprite.x,
                y: this.tileSprite.y,
            };
            return tile;
        },
        fromJSON: function(tileInfo) {
            this.tileSprite.x = tileInfo.x;
            this.tileSprite.y = tileInfo.y;

        },
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
