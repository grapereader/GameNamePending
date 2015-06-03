define(["game", "globals"], function(Game, Globals) {
    console.log("Running " + Globals.GAME_NAME + "...");

    for (g in Globals) {
        var elements = document.getElementsByClassName("!{" + g + "}");
        for (var i = 0; i < elements.length; i++) {
            elements[i].innerHTML = Globals[g];
        }
    }

    var game = new Game();
    game.run();
});
