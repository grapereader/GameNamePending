define(["entity/player", "item/manager", "util/helpers", "gui/inventory"], function(Player, ItemManager, Helpers, InventoryScreen) {
    /**
        This is the meat of the game logic.

        All world updating, player management, networking, etc should be
        contained in or dispatched from here.
    */
    var GameManager = Class({
        constructor: function(game, scene) {
            this.game = game;
            this.scene = scene;

            //Temp save data for testing. This will be loaded from JSON/Database.
            var saveData = {
                saveName: "Test Save",
                characterName: "Joe",
                repeats: 0,
                inventory: false,
                chest: false,
                equip: {
                    head: false,
                    chest: false,
                    legs: false,
                    feet: false,
                    hands: false,
                    item: false
                },
                map: false //False here can mean player is currently in lobby
            }

            var self = this;

            this.itemManager = new ItemManager();

            this.player = new Player(this, saveData);
            this.scene.addObject(this.player.container, 1);

            var tempBG = new PIXI.Sprite(PIXI.utils.TextureCache[Helpers.sprite("temp_bg.jpg")]);
            tempBG.width = game.gameWidth;
            tempBG.height = game.gameHeight;
            this.scene.addObject(tempBG, 0);

            this.fpsText = new PIXI.Text("FPS", {font : "24px Arial"});
            this.scene.addObject(this.fpsText, 9);

            this.testGui = new InventoryScreen(this, this.player.inventory);
            this.scene.addObject(this.testGui.container, 8);
            this.testGui.container.x = 32;
            this.testGui.container.y = 32;
        },
        update: function() {
            this.player.update();
            this.fpsText.text = "FPS: " + this.game.fps;

            this.testGui.update();
        }
    });

    return GameManager;
});
