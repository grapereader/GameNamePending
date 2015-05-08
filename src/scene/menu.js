define(["scene/scene", "scene/gameplay"], function(Scene, Gameplay) {
    var Menu = Scene.extend({
        init: function(game) {
            this._super(game, 2);
            console.log("Running menu scene...");
            console.log("Menu scene initialized");

        },
        update: function() {
            this._super();
            this.game.changeScene(new Gameplay(this.game));
        }
    });
    return Menu;
});
