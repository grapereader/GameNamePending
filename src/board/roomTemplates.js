define(["tile/tile","tile/wall","tile/path","tile/door","view/viewobject"], function(Tile,Wall,Path,Door,ViewObject) {

    var Room = Class({
        constructor: function(gameManager){
            this.gameManager = gameManager;
            this.rooms = {
                "circular 4 entrance room": [["Empty","Wall","Wall","Door","Wall","Wall","Empty"],["Wall","Wall","Path","Path","Path","Wall","Wall"],["Wall","Path","Path","Path","Path","Path","Wall"],["Door","Path","Path","Torch","Path","Path","Door"],["Wall","Path","Path","Path","Path","Path","Wall"],["Wall","Wall","Path","Path","Path","Wall","Wall"],["Empty","Wall","Wall","Door","Wall","Wall","Empty"]],
                "tiny chest room": [["Wall","Wall","Wall"],["Wall","Chest","Door"],["Wall","Wall","Wall"]]
            }
        },

        roomConstructor(roomCompact){

        }
        

    });
    return roomTemplates;
});