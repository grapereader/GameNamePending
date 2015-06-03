define(["view/viewobject", "util/helpers", "util/animgroup"], function(ViewObject, Helpers, AnimGroup) {

    var Tile = Class({
        constructor: function(gameManager) {
            this.gameManager = gameManager;
            this.clipping = true;
            this.tileType = "Empty";
            this.container = new PIXI.Container();
            this.tileX = 0;
            this.tileY = 0;
            this.animGroup = new AnimGroup();
        },
        update: function() {},
        createSprite: function(spriteLocation) {
            var sprite = new PIXI.Sprite(PIXI.utils.TextureCache["tiles-1"][spriteLocation]);
            sprite.scale.x = 2;
            sprite.scale.y = 2;
            //sprite.anchor.x = 0.5;
            //sprite.anchor.y = 0.5;

            return sprite;
        },
        setPosition: function(tileX, tileY) {
            this.container.x = tileX * 64;
            this.container.y = tileY * 64;
            this.tileX = tileX;
            this.tileY = tileY;
            return this;
        },
        translate: function(x, y) {
            this.setPosition(this.tileX + x, this.tileY + y);
            return this;
        },
        /**
            Add an animation (util/anim) to the Tile. Potientally useful for animated decorations.
        */
        toJSON: function() {
            var tile = {
                type: this.tileType,
                x: this.container.x,
                y: this.container.y,
            };
            return tile;
        },
        fromJSON: function(tileInfo) {
            this.container.x = tileInfo.x;
            this.container.y = tileInfo.y;
        }
    });

    return Tile;

});
