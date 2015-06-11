define(["entity/player", "factory/itemfactory", "util/helpers", "gui/playerinvwindow", "gui/windowsystem", "board/board", "board/levelgenerator"], function(Player, ItemFactory, Helpers, PlayerInventoryWindow, WindowSystem, Board, LevelGenerator) {
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
            this.board = this.levelgenerator.generateLevel(1);
            this.itemFactory = new ItemFactory();

            //Testing weapon/armour generation...
            console.log("Any item...");
            for (var i = 0; i < 5; i++) {
                var item = this.itemFactory.getItem("all");
                console.log(item);
            }
            console.log("Only weapons...");
            for (var i = 0; i < 5; i++) {
                var item = this.itemFactory.getItem("weapon");
                console.log(item);
            }

            this.player = new Player(this, saveData);
            var spawnPoint = this.board.roomList[0].getRandomSpawnableLocation();
            this.player.setLocation(spawnPoint[0] * 64, spawnPoint[1] * 64);
            this.scene.addObject(this.player.container, 2);
            this.scene.addObject(this.board.container, 0);
            this.scene.addObject(this.board.enemyContainer, 1);

            this.fpsText = new PIXI.Text("FPS", {
                font: "24px Arial"
            });
            this.scene.addObject(this.fpsText, 9);

            this.windowSystem = new WindowSystem(this, document.getElementById("canvas-wrapper"));
            this.scene.addObject(this.windowSystem.container, 8);

            var playerInv = new PlayerInventoryWindow(this);
            this.windowSystem.addChild(playerInv);
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
