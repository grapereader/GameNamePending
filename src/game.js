define(["globals", "scene/menu", "util/helpers", "load/sheetparser"], function(Globals, Menu, Helpers, SheetParser) {

var Game = Class({
    constructor: function() {
        PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

        this.gameWidth = Math.min(document.documentElement.offsetWidth - (document.documentElement.offsetWidth / 5), 1200);
        this.gameHeight = Math.min(document.documentElement.offsetHeight - (document.documentElement.offsetHeight / 5), 700);
        this.renderer = PIXI.autoDetectRenderer(this.gameWidth, this.gameHeight, {antialiasing: false});

        this.lastUpdate = Date.now();

        this.fpsTicker = 0;
        this.fpsMillis = 0;
        this.fps = 0;

        document.getElementById("canvas-wrapper").appendChild(this.renderer.view);

        console.log("Created new game instance.");
    },

    run: function() {
        var self = this;

        console.log("Loading assets...");

        var loader = new PIXI.loaders.Loader();
        loader
            .add(Helpers.sprite("players/male-race-1/male-race-1.sheet"))
            .add(Helpers.sprite("world/tiles-1/tiles-1.sheet"))
            .after(SheetParser)
            .once("complete", function() {
                self.startLoop();
            });
        loader.load();
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
    }
});

return Game;

});
