define(function() {
    /**
        This is the meat of the game logic.

        All world updating, player management, networking, etc should be
        contained in or dispatched from here.
    */
    var GameManager = Class.extend({
        init: function(game, scene) {
            this.game = game;
            this.scene = scene;

            var self = this;

        },
        update: function() {
        }
    });

    return GameManager;
});
