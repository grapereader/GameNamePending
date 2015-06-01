define(["globals", "scene/menu", "util/helpers", "load/sheetparser", "input/keyboard", "save/savemanager"], function(Globals, Menu, Helpers, SheetParser, KeyboardInput, SaveManager) {

var Game = Class({
    constructor: function() {
        PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

        var docWidth = document.documentElement.offsetWidth;
        var docHeight = document.documentElement.offsetHeight;
        this.gameWidth = Math.min(docWidth - (docWidth / 5), 1200);
        this.gameHeight = Math.min(docHeight - (docHeight / 5), 700);
        this.renderer = PIXI.autoDetectRenderer(this.gameWidth, this.gameHeight, {antialiasing: false});

        this.lastUpdate = Date.now();

        this.fpsTicker = 0;
        this.fpsMillis = 0;
        this.fps = 0;

        document.getElementById("canvas-wrapper").appendChild(this.renderer.view);

        this.keyboard = new KeyboardInput(window);

        this.saveManager = new SaveManager();

        console.log("Created new game instance.");
    },
    run: function() {
        var self = this;

        console.log("Loading assets...");

        this.toLoad = 2;
        this.loaded = 0;

        WebFont.load({
            active: function() {
                self.doneLoading("fonts");
            },
            google: {
                families: ['Poiret One']
            }
        });

        var loader = new PIXI.loaders.Loader();
        loader
            .add(Helpers.sprite("players/male-race-1/male-race-1.sheet"))
            .add(Helpers.sprite("items/ironsword/ironsword.sheet"))
            .add(Helpers.sprite("world/tiles-1/tiles-1.sheet"))
            .add(Helpers.sprite("blank.png"))
            .add(Helpers.sprite("placeholder.png"))
            .add(Helpers.sprite("temp_bg.jpg"))
            .after(SheetParser)
            .once("complete", function() {
                self.doneLoading("graphics assets");
            });
        loader.load();
    },
    doneLoading: function(group) {
        this.loaded++;
        console.log("Loaded " + group);
        if (this.loaded >= this.toLoad) {
            console.log("All assets have loaded.");
            this.startLoop();
        }
    },
    startLoop: function() {
        console.log("Running game now...");

        this.currentScene = new Menu(this);

        var self = this;

        requestAnimationFrame(render);
        function render() {
            self.loop();
            requestAnimationFrame(render);
        }
    },
    loop: function() {
        this.calculateDelta();
        this.fpsMillis += this.deltaTime;
        this.fpsTicker++;
        if (this.fpsMillis >= 1000) {
            this.fps = this.fpsTicker;
            this.fpsMillis = 0;
            this.fpsTicker = 0
            //console.log(this.fps);
        }
        this.currentScene.update();
        this.currentScene.render(this.renderer);
    },
    changeScene: function(scene) {
        console.log("Changing scene");
        this.currentScene = scene;
    },
    calculateDelta: function() {
        var now = Date.now();
        this.deltaTime = now - this.lastUpdate;
        this.lastUpdate = now;

        if (this.deltaTime > 100) this.deltaTime = 100;
    }
});

return Game;

});
