define(["scene/scene", "scene/gameplay"], function(Scene, Gameplay) {
    var Menu = Class(Scene, {
        constructor: function(game) {
            Menu.$super.call(this, game, 2);
            console.log("Running menu scene...");
            console.log("Menu scene initialized");

        },
        update: function() {
            Menu.$superp.update.call(this);
            
            this.game.changeScene(new Gameplay(this.game));
        }
    });
    return Menu;
});
