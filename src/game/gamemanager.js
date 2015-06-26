define(["entity/player", "factory/itemfactory", "util/helpers", "gui/playerinvwindow", "gui/windowsystem", "board/board", "board/levelgenerator", "item/itemdrop", "lighting/lightsystem", "lighting/filtermanager"], function(Player, ItemFactory, Helpers, PlayerInventoryWindow, WindowSystem, Board, LevelGenerator, ItemDrop, LightSystem, FilterManager) {
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

            FilterManager.init(this);

            //Putting this in here since it would be a huge pain to refactor
            //all the tiles to take this in constructor.
            this.levelTheme = "tiles-2";

            var self = this;
            this.levelgenerator = new LevelGenerator(this);
            this.board = this.levelgenerator.generateLevel(1);
            this.itemFactory = new ItemFactory();

            this.player = new Player(this, saveData);
            var spawnPoint = this.board.roomList[0].getRandomSpawnableLocation();
            this.player.setLocation(spawnPoint[0] * 64, spawnPoint[1] * 64);
            this.scene.addObject(this.player.container, 2);
            this.scene.addObject(this.board.container, 0);
            this.scene.addObject(this.board.objectContainer, 1);

            this.fpsText = new PIXI.Text("FPS", {
                font: "24px Arial"
            });
            this.scene.addObject(this.fpsText, 9);

            this.windowSystem = new WindowSystem(this, document.getElementById("canvas-wrapper"));
            this.scene.addObject(this.windowSystem.container, 8);

            var playerInv = new PlayerInventoryWindow(this);
            this.windowSystem.addChild(playerInv);

            this.lightSystem = new LightSystem(this);
            this.scene.addObject(this.lightSystem.container, 1);
        },
        update: function() {
            this.player.update();
            this.board.update();
            this.windowSystem.update();
            this.lightSystem.update();
            FilterManager.updateFilters();
            this.fpsText.text = "FPS: " + this.game.fps.toFixed(0);
        },




    });

    return GameManager;
});
