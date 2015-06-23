define(["tile/tile", "tile/wall", "tile/path", "tile/object/door", "tile/object/chest", "tile/object/torch"], function(Tile, Wall, Path, Door, Chest, Torch) {

    var Editor = Class({
        constructor: function(gameManager) {
            this.gameManager = gameManager;
            this.editingAreaSize = 19;
        },
        update: function(currentX, currentY) {

            var keys = this.gameManager.game.keymap;

            if (keys.isKeyDown("debug.Tile")) this.gameManager.board.setTile(new Tile(this.gameManager).setPosition(currentX, currentY));
            if (keys.isKeyDown("debug.Wall")) this.gameManager.board.setTile(new Wall(this.gameManager).setPosition(currentX, currentY));
            if (keys.isKeyDown("debug.Path")) this.gameManager.board.setTile(new Path(this.gameManager).setPosition(currentX, currentY));
            if (keys.isKeyDown("debug.Door")) this.gameManager.board.setTile(new Door(this.gameManager).setPosition(currentX, currentY));
            if (keys.isKeyDown("debug.Chest")) this.gameManager.board.setTile(new Chest(this.gameManager).setPosition(currentX, currentY));
            if (keys.isKeyDown("debug.Torch")) this.gameManager.board.setTile(new Torch(this.gameManager).setPosition(currentX, currentY));
            if (keys.isKeyDown("debug.Export")) {
                var editingAreaSize = this.editingAreaSize;

                var greatestX = Math.floor(this.gameManager.board.gridWidth / 2) - Math.floor(editingAreaSize / 2);
                var greatestY = Math.floor(this.gameManager.board.gridHeight / 2) - Math.floor(editingAreaSize / 2);

                for (var i = Math.floor(this.gameManager.board.gridWidth / 2) - Math.floor(editingAreaSize / 2); i < Math.floor(this.gameManager.board.gridWidth / 2) + Math.floor(editingAreaSize / 2) + 1; i++) {
                    for (var j = Math.floor(this.gameManager.board.gridWidth / 2) - Math.floor(editingAreaSize / 2); j < Math.floor(this.gameManager.board.gridWidth / 2) + Math.floor(editingAreaSize / 2) + 1; j++) {
                        if (this.gameManager.board.grid[i][j].tileType != "Empty") {
                            greatestX = Math.max(greatestX, i);
                            greatestY = Math.max(greatestY, j);
                        }
                    }
                }

                var output = "[";
                for (var i = Math.floor(this.gameManager.board.gridWidth / 2) - Math.floor(editingAreaSize / 2); i <= greatestX; i++) {
                    output += "[";
                    for (var j = Math.floor(this.gameManager.board.gridWidth / 2) - Math.floor(editingAreaSize / 2); j <= greatestY; j++) {
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
                var editingAreaSize = this.editingAreaSize;
                for (var i = Math.floor(this.gameManager.board.gridWidth / 2) - Math.floor(editingAreaSize / 2); i < Math.floor(this.gameManager.board.gridWidth / 2) + Math.floor(editingAreaSize / 2) + 1; i++) {
                    for (var j = Math.floor(this.gameManager.board.gridWidth / 2) - Math.floor(editingAreaSize / 2); j < Math.floor(this.gameManager.board.gridWidth / 2) + Math.floor(editingAreaSize / 2) + 1; j++) {
                        var tile = new Tile(this.gameManager).setPosition(i, j);
                        if (keys.isKeyDown("debug.Tile")) tile = new Tile(this.gameManager).setPosition(i, j);
                        if (keys.isKeyDown("debug.Wall")) tile = new Wall(this.gameManager).setPosition(i, j);
                        if (keys.isKeyDown("debug.Path")) tile = new Path(this.gameManager).setPosition(i, j);
                        if (keys.isKeyDown("debug.Door")) tile = new Door(this.gameManager).setPosition(i, j);
                        if (keys.isKeyDown("debug.Chest")) tile = new Chest(this.gameManager).setPosition(i, j);
                        if (keys.isKeyDown("debug.Torch")) tile = new Torch(this.gameManager).setPosition(i, j);
                        this.gameManager.board.setTile(tile);
                    }
                }

            }
        }
    });

    return Editor;

});
