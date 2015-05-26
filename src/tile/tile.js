define(["view/viewobject"], function(ViewObject) {

	var Tile = Class(ViewObject, {
        constructor: function(gamemanager) {
            Entity.$super.call(this, gameManager.scene);
            this.gameManager = gameManager;
            this.dx = 0;
            this.dy = 0;
            this.animations = [];
        },
        
        update: function(){
        	Tile.$superp.update.call(this);
            var delta = this.gameManager.game.deltaTime;
        	for (var i = 0; i < this.animations.length; i++) {
                this.animations[i].stepAnimation(delta);
            }
        }
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

    return Entity;

});
