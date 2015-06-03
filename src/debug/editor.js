define(["tile/tile", "tile/wall", "tile/path", "tile/door", "tile/chest", "tile/torch"], function(Tile, Wall, Path, Door, Chest, Torch) {

    var Editor = Class({
        constructor: function(gameManager) {
            this.gameManager = gameManager;
        },
        update: function(currentX, currentY) {

            var keys = this.gameManager.game.keymap;

            if (keys.isKeyDown("debug.Tile")) this.gameManager.board.setTile(currentX, currentY, new Tile(this.gameManager));
            if (keys.isKeyDown("debug.Wall")) this.gameManager.board.setTile(currentX, currentY, new Wall(this.gameManager));
            if (keys.isKeyDown("debug.Path")) this.gameManager.board.setTile(currentX, currentY, new Path(this.gameManager));
            if (keys.isKeyDown("debug.Door")) this.gameManager.board.setTile(currentX, currentY, new Door(this.gameManager));
            if (keys.isKeyDown("debug.Chest")) this.gameManager.board.setTile(currentX, currentY, new Chest(this.gameManager));
            if (keys.isKeyDown("debug.Torch")) this.gameManager.board.setTile(currentX, currentY, new Torch(this.gameManager));
            if (keys.isKeyDown("debug.Export")) {
                var greatestX = 68;
                var greatestY = 68;

                for (var i = 68; i < 81; i++) {
                    for (var j = 68; j < 81; j++) {
                        if (this.gameManager.board.grid[i][j].tileType != "Empty") {
                            greatestX = Math.max(greatestX, i);
                            greatestY = Math.max(greatestY, j);
                        }
                    }
                }

                var output = "[";
                for (var i = 68; i <= greatestX; i++) {
                    output += "[";
                    for (var j = 68; j <= greatestY; j++) {
                        output += "\"" + this.gameManager.board.grid[i][j].tileType + "\"";
                        if (j != greatestY) {
                            output += ",";
                        }
                    }
                    output += "]";
                    if (i != greatestX) {
                        output += ",";
                    } else {
                        output += "\n";
                    }
                }
                output += "]";
                window.prompt("Copy to clipboard: Ctrl+C, Enter", output);
            }
            if (keys.isKeyDown("debug.Clear")) {
                for (var i = 68; i < 81; i++) {
                    for (var j = 68; j < 81; j++) {
                        this.gameManager.board.setTile(i, j, new Tile(this.gameManager));
                    }
                }
            }
        }
    });

    return Editor;

});
