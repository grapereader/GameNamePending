define(["game", "globals"], function(Game, Globals) {
    console.log("Running " + Globals.GAME_NAME + "...");

    for (g in Globals) {
        var elements = document.getElementsByClassName("!{" + g + "}");
        for (var i = 0; i < elements.length; i++) {
            elements[i].innerHTML = Globals[g];
        }
    }

    var game = new Game();
    var stage = new PIXI.Stage(0x123456);
    var gameContainer = new PIXI.DisplayObjectContainer();
    stage.addChild(gameContainer);
    game.changeScene(stage)
    //console.log(game.currentScene);
    game.run();
});
