define(["tile/tile", "util/helpers", "util/anim"], function(tile, Helpers, Animation) {
	var Door = Class(Tile, {
        constructor: function(gamemanager) {
            Door.$super.call(this, gameManager.scene);
            this.gameManager = gameManager;
            this.isShut = true;
            this.isClippable = false;
            this.isAnimated = false;
            this.openSprite = this.createSprite();
            this.closedSprite = this.createSprite();
            this.setSize(64,64); 
            var doorSpeed = 4;
            var anims = {
                "open": Helpers.animBuilder("open", 2, doorSpeed),
                "close": Helpers.animBuilder("close", 2, doorSpeed)
            }
            this.addAnimationLayer(new Animation("door", anims, this.baseSprite));
        },
 
        update: function(){
        	Door.$superp.update.call(this);
            if(this.isAnimated){
                var delta = this.gameManager.game.deltaTime;
                for (var i = 0; i < this.animations.length; i++) {
                    this.animations[i].stepAnimation(delta);
                }
            }

        },
        /**
            Function that opens and closes the door
        */
        use: function(){
            if(this.isShut){
                this.setAnimation("open");
                this.isAnimated = true;
            }
            else{
                this.setAnimation("close");
                this.isAnimated = true;
            }
            this.isShut=!this.isShut;
            this.isClippable = !this.isClippable;
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

    return Door;

});
