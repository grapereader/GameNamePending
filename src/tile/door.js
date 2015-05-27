define(["tile/tile", "util/helpers", "util/anim"], function(Tile, Helpers, Animation) {
	var Door = Class(Tile, {
        constructor: function(gameManager) {
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
            this.currentAnimation = new Animation("door", anims, this.baseSprite);
        },
 
        update: function(){
        	Door.$superp.update.call(this);
            if(!this.currentAnimation.isFinished){
                var delta = this.gameManager.game.deltaTime;
                currentAnimation.stepAnimation(delta);
            }

        },
        /**
            Function that opens and closes the door
        */
        use: function(){
            if(this.currentAnimation.isFinished){
                if(this.isShut){
                    this.currentAnimation.setAnimation("open");
                }
                else{
                    this.currentAnimation.setAnimation("close");
                }
                this.isShut=!this.isShut;
                this.isClippable = !this.isClippable;
            }
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
