define(["entity/player", "item/manager", "util/helpers", "gui/inventory", "gui/window", "gui/windowsystem", "board/board", "entity/enemy", "board/levelgenerator"], function(Player, ItemManager, Helpers, InventoryScreen, Window, WindowSystem, Board, Enemy, LevelGenerator) {
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
                equips: {
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
            this.levelgenerator = new LevelGenerator(this);
            this.board = this.levelgenerator.generateLevel(0);
            this.itemManager = new ItemManager();
            this.board.addEnemy(new Enemy(this, 5, 5, {
                damage: 5,
                speed: 2,
                range: 0
            }, 64 * 2, {}, "male-race-1"));

            this.player = new Player(this, saveData);
            this.player.setLocation(100 * 64, 100 * 64);
            this.scene.addObject(this.player.container, 2);
            this.scene.addObject(this.board.container, 0);
            this.scene.addObject(this.board.enemyContainer, 1);

            //var tempBG = new PIXI.Sprite(PIXI.utils.TextureCache[Helpers.sprite("temp_bg.jpg")]);
            //tempBG.width = game.gameWidth;
            //tempBG.height = game.gameHeight;
            //this.scene.addObject(tempBG, 0);

            this.fpsText = new PIXI.Text("FPS", {
                font: "24px Arial"
            });
            this.scene.addObject(this.fpsText, 9);

            var testInv = new InventoryScreen(this, this.player.inventory);
            var testWindow = new Window(this, 300, 300, "Inventory");
            testWindow.addChild(testInv);
            var testInv2 = new InventoryScreen(this, this.player.inventory);
            var testWindow2 = new Window(this, 300, 300, "Inventory 2");
            testWindow2.addChild(testInv2);
            testWindow2.setPosition(0, 100);
            this.windowSystem = new WindowSystem(document.getElementById("canvas-wrapper"));
            this.windowSystem.addChild(testWindow);
            this.windowSystem.addChild(testWindow2);
            this.scene.addObject(this.windowSystem.container, 8);
        },
        update: function() {
            this.player.update();
            this.board.update();
            this.windowSystem.update();
            this.fpsText.text = "FPS: " + this.game.fps;
        },




    });

    return GameManager;
});
