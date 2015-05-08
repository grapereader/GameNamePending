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

            console.log("Initialized gameplay scene.");
        },
        update: function() {
            Gameplay.$superp.update.call(this);

            this.gameManager.update();
        }
    });

    return Gameplay;

});
