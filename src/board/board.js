define(["tile/tile", "tile/wall", "tile/path", "tile/door", "view/viewobject"], function(Tile, Wall, Path, Door, ViewObject) {
    var Board = Class(ViewObject, {
        constructor: function(gameManager, boardWidth, boardHeight) {
            Board.$super.call(this, gameManager.scene);
            this.gameManager = gameManager;
            this.gridWidth = boardWidth;
            this.gridHeight = boardHeight;
            //Must get added to the root scene above the main container.
            this.enemyContainer = new PIXI.Container();

            this.tiles = {
                "wall": 0,
                "path": 1,
                "door": 2,
                "chest": 3,
                "torch": 4,
            };

            this.enemies = [];
            this.grid = this.initializeGrid(this.gridWidth, this.gridHeight);
        },
        /**
            Returns an array of entrances that are not connected to multiple rooms
        */
        getIsolatedEntrances: function() {
            var isolatedEntrances = [];
            for (var i = 0; i < width; i++) {
                for (var j = 0; j < height; j++) {
                    if (this.grid[i][j].tileType = "Door") {
                        if (this.grid[i - 1][j].tileType == "Empty" || this.grid[i + 1][j].tileType == "Empty" || this.grid[i][j - 1].tileType == "Empty" || this.grid[i][j + 1].tileType == "Empty") {
                            var location = new Array(2);
                            location[0] = i;
                            location[1] = j;
                            isolatedEntrances.push(location);
                        }
                    }
                }
            }
            return isolatedEntrances;
        },

        initializeGrid: function(width, height) {
            var grid = new Array(width);
            for (var i = 0; i < width; i++) {
                grid[i] = new Array(height);
                for (var j = 0; j < height; j++) {
                    grid[i][j] = new Tile(this.gameManager);
                }
            }
            return grid;
        },
        addEnemy: function(e) {
            this.enemies.push(e);
            this.enemyContainer.addChild(e.container);
        },


        getEmptyDistance: function(x, y, direction) {
            var distance;
            switch (direction) {
                case 1:
                    do {
                        var i = y;
                        i--;
                        distance++;
                    } while (this.brid[x][i].tileType == "Empty" && i > 0);
                    break;
                case 2:
                    do {
                        var i = x;
                        i++;
                        distance++;
                    } while (this.brid[i][y].tileType == "Empty" && i < this.gridWidth - 1);
                    break;
                case 3:
                    do {
                        var i = y;
                        i++;
                        distance++;
                    } while (this.brid[x][i].tileType == "Empty" && i < this.gridHeight - 1);
                    break;
                case 4:
                    do {
                        var i = x;
                        i--;
                        distance++;
                    } while (this.brid[i][y].tileType == "Empty" && i > 0);

                    break;
            }
            return distance;
        },

        getEmptyRectangle: function(x, y, direction) {
            var rect = [0, 0, 0, 0]; //[x1,y1,x2,y2] where x1=<x2,y1=<y2
            switch (direction) {
                case 1:
                    rect[0] = x - getEmptyDistance(x, y, 4);
                    rect[1] = y - getEmptyDistance(x, y, 1);
                    rect[2] = x + getEmptyDistance(x, y, 2);
                    rect[3] = y;
                    for (var i = y; i > rect[1]; i--) {
                        rect[0] = Math.max(x - getEmptyDistance(x, i, 4), rect[0]);
                        rect[2] = Math.min(x + getEmptyDistance(x, i, 2), rect[2]);
                    }
                    break;
                case 2:
                    rect[0] = x;
                    rect[1] = y - getEmptyDistance(x, y, 1);
                    rect[2] = x + getEmptyDistance(x, y, 2);
                    rect[3] = y + getEmptyDistance(x, y, 3);
                    for (var i = x; i < rect[2]; i++) {
                        rect[1] = Math.max(y - getEmptyDistance(i, y, 1), rect[1]);
                        rect[3] = Math.min(y + getEmptyDistance(i, y, 3), rect[3]);
                    }

                    break;
                case 3:
                    rect[0] = x - getEmptyDistance(x, y, 4);
                    rect[1] = y;
                    rect[2] = x + getEmptyDistance(x, y, 2);
                    rect[3] = y + getEmptyDistance(x, y, 3);
                    for (var i = y; i < rect[3]; i++) {
                        rect[0] = Math.max(x - getEmptyDistance(x, i, 4), rect[0]);
                        rect[2] = Math.min(x + getEmptyDistance(x, i, 2), rect[2]);
                    }
                    break;
                case 4:
                    rect[0] = x - getEmptyDistance(x, y, 4);
                    rect[1] = y - getEmptyDistance(x, y, 1);
                    rect[2] = x;
                    rect[3] = y + getEmptyDistance(x, y, 3);
                    for (var i = x; i > rect[0]; i--) {
                        rect[1] = Math.max(y - getEmptyDistance(i, y, 1), rect[1]);
                        rect[3] = Math.min(y + getEmptyDistance(i, y, 3), rect[3]);
                    }

                    break;
            }
            return rect;
        },
        setTile: function(x, y, tile) {
            if (this.grid[x][y] instanceof Tile) this.removeChild(this.grid[x][y].tileSprite);
            tile.tileSprite.x = x * tile.tileSprite.width;
            tile.tileSprite.y = y * tile.tileSprite.height;
            this.grid[x][y] = tile;
            this.addChild(tile.tileSprite);
        },
        //Creates Room at coordinates x,y down and to the right.
        addRoom: function(x, y, room) {
            for (var i = 0; i < room.width; i++) {
                for (var j = 0; j < room.height; j++) {
                    this.setTile(i + x, j + y, room.grid[i][j]);
                }
            }
        },
        update: function() {
                Board.$superp.update.call(this);
                for (var i = 0; i < this.gridWidth; i++) {
                    for (var j = 0; j < this.gridHeight; j++) {
                        this.grid[i][j].update();
                    }
                }

                for (var i = 0; i < this.enemies.length; i++) {
                    this.enemies[i].update();
                }
            }
            /**
             
             */

    });
    return Board;
});