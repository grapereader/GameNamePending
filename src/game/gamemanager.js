define(["entity/player", "factory/itemfactory", "util/helpers", "gui/playerinvwindow", "gui/windowsystem", "board/board", "board/levelgenerator", "item/itemdrop", "lighting/lightsystem", "lighting/filtermanager"],
    function(Player, ItemFactory, Helpers, PlayerInventoryWindow, WindowSystem, Board, LevelGenerator, ItemDrop, LightSystem, FilterManager) {
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
                };

                //Putting this in here since it would be a huge pain to refactor
                //all the tiles to take this in constructor.
                this.lightSystem = new LightSystem(this);
                this.scene.addObject(this.lightSystem.container, 2);
                FilterManager.init(this);

                this.levelgenerator = new LevelGenerator(this);

                this.itemFactory = new ItemFactory();

                this.player = new Player(this, saveData);

                if (saveData.map !== false) {
                    this.board = saveData.map;
                } else {
                    //Normally this should be the lobby. We will just spawn a level
                    //here for now.
                    this.switchLevel();
                }

                this.scene.addObject(this.player.container, 3);

                this.fpsText = new PIXI.Text("FPS", {
                    font: "24px Arial"
                });
                this.scene.addObject(this.fpsText, 9);

                this.windowSystem = new WindowSystem(this, document.getElementById("canvas-wrapper"));
                this.scene.addObject(this.windowSystem.container, 8);

                var playerInv = new PlayerInventoryWindow(this);
                this.windowSystem.addChild(playerInv);

                this.interactionNotify = new PIXI.Text("", {
                    font: Helpers.getFont(24),
                    fill: "white"
                });

                this.interactionNotify.y = this.game.gameHeight - 100;

                this.scene.addObject(this.interactionNotify, 7);
            },
            update: function() {
                this.player.update();
                this.board.update();
                this.windowSystem.update();
                this.lightSystem.update();
                FilterManager.updateFilters();
                this.fpsText.text = "FPS: " + this.game.fps.toFixed(0);
            },
            switchLevel: function() {
                Log.info("Switching level...");

                if (this.board !== undefined) {
                    this.scene.removeObject(this.board.container);
                    this.scene.removeObject(this.board.objectContainer);
                    this.board.dispose();
                }

                this.levelTheme = "tiles-2";

                this.board = this.levelgenerator.generateLevel(1);
                var spawnPoint = this.board.roomList[0].getRandomSpawnableLocation();
                this.player.setLocation(spawnPoint[0] * 64, spawnPoint[1] * 64);

                this.scene.addObject(this.board.container, 0);
                this.scene.addObject(this.board.objectContainer, 1);
            },
            showInteractionNotification: function(msg) {
                var notify = this.interactionNotify;
                if (msg !== false) {
                    notify.visible = true;
                    notify.text = "[" + this.game.keymap.getKey("interact.use").replace("Key", "") + "] " + msg;
                    notify.x = this.game.gameWidth / 2 - notify.width / 2;
                } else {
                    notify.visible = false;
                }
            }
        });

        return GameManager;
    });
