define(["scene/scene", "game/gamemanager"], function(Scene, GameManager) {
    /**
        The gameplay scene.

        Logic should be kept out of here and put in the GameManager instead.
        This is in an attempt to further separate rendering from logic.
    */
    var Gameplay = Class(Scene, {
        constructor: function(game) {
            Gameplay.$super.call(this, game, 10);

            this.gameManager = new GameManager(game, this);
            this.image = [];
            for(int i=0;i<4;i++){
                this.image.push(PIXI.Sprite.fromImage("assets/sprites/placeholder.png"));
                this.gameManager.addActor(this.image[i]);
                Gameplay.$superp.setLayer.call(this,this.image[i],9);
            }
            console.log("Initialized gameplay scene.");
        },
        update: function() {
            Gameplay.$superp.update.call(this);

            this.gameManager.update();
        }
    });

    return Gameplay;

});
