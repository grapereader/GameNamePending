define(["entity/player", "item/manager", "util/helpers"], function(Player, ItemManager, Helpers) {
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

            var tempBG = new PIXI.Sprite(PIXI.utils.TextureCache[Helpers.sprite("temp_bg.jpg")]);
            tempBG.width = game.gameWidth;
            tempBG.height = game.gameHeight;
            this.scene.addObject(tempBG, 0);

            this.fpsText = new PIXI.Text("FPS", {font : "24px Arial"});
            this.scene.addObject(this.fpsText, 9);
        },
        update: function() {
            this.player.update();
            this.fpsText.text = "FPS: " + this.game.fps;
        }
    });

    return GameManager;
});
