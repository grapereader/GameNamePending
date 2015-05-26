define(["entity/player", "item/manager"], function(Player, ItemManager) {
    /**
        This is the meat of the game logic.

        All world updating, player management, networking, etc should be
        contained in or dispatched from here.
    */
    var GameManager = Class({
        constructor: function(game, scene) {
            this.game = game;
            this.scene = scene;

            var self = this;

            this.itemManager = new ItemManager();

            this.player = new Player(this);
            this.scene.addObject(this.player.container, 1);
        },
        update: function() {
            this.player.update();
        }
    });

    return GameManager;
});
