define(["tile/tile", "tile/wall", "tile/path", "tile/door", "view/viewobject"], function(Tile, Wall, Path, Door, ViewObject) {
    var Board = Class(ViewObject, {
        constructor: function(gameManager, boardWidth, boardHeight) {
            Board.$super.call(this, gameManager.scene);
            this.gameManager = gameManager;
            this.gridWidth = boardWidth;
            this.gridHeight = boardHeight;
            //Must get added to the root scene above the main container.
            this.enemyContainer = new PIXI.Container();
            this.roomList = [];
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
        getIsolatedEntrance: function() {
            var isolatedEntrances = [];
            for (var i = 1; i < this.gridWidth-2; i++) {
                for (var j = 1; j < this.gridHeight-2; j++) {
                    if (this.grid[i][j].tileType == "Door") {
                        if (this.grid[i - 1][j].tileType == "Empty" || this.grid[i + 1][j].tileType == "Empty" || this.grid[i][j - 1].tileType == "Empty" || this.grid[i][j + 1].tileType == "Empty") {
                            return [i,j];
                        }
                    }
                }
            }
            return -1;
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
            var distance = 0;
            switch (direction) {
                case 1:
                    var i = y;
                    do {    
                        i=i-1;
                        distance++;
                    } while (i > 0 && this.grid[x][i].tileType == "Empty");
                    break;
                case 2:
                    var i = x;                
                    do {
                        i=i+1;
                        distance++;
                    } while (i < this.gridWidth - 1 && this.grid[i][y].tileType == "Empty");
                    break;
                case 3:
                    var i = y;
                    do {
                        i=i+1;
                        distance++;
                    } while (i < this.gridHeight - 1 && this.grid[x][i].tileType == "Empty");
                    break;
                case 4:
                    var i = x;
                    do {
                        i=i-1;
                        distance++;
                    } while (i > 0 && this.grid[i][y].tileType == "Empty");

                    break;
            }
            return distance;
        },

        getEmptyRectangle: function(x, y, direction) {
            var rect = [0, 0, 0, 0]; //[x1,y1,x2,y2] where x1=<x2,y1=<y2
            switch (direction) {
                case 1:
                    rect[0] = x - this.getEmptyDistance(x, y, 4);
                    rect[1] = y - this.getEmptyDistance(x, y, 1);
                    rect[2] = x + this.getEmptyDistance(x, y, 2);
                    rect[3] = y;
                    for (var i = y; i > rect[1]; i--) {
                        rect[0] = Math.max(x - this.getEmptyDistance(x, i, 4), rect[0]);
                        rect[2] = Math.min(x + this.getEmptyDistance(x, i, 2), rect[2]);
                    }
                    break;
                case 2:
                    rect[0] = x;
                    rect[1] = y - this.getEmptyDistance(x, y, 1);
                    rect[2] = x + this.getEmptyDistance(x, y, 2);
                    rect[3] = y + this.getEmptyDistance(x, y, 3);
                    for (var i = x; i < rect[2]; i++) {
                        rect[1] = Math.max(y - this.getEmptyDistance(i, y, 1), rect[1]);
                        rect[3] = Math.min(y + this.getEmptyDistance(i, y, 3), rect[3]);
                    }

                    break;
                case 3:
                    rect[0] = x - this.getEmptyDistance(x, y, 4);
                    rect[1] = y;
                    rect[2] = x + this.getEmptyDistance(x, y, 2);
                    rect[3] = y + this.getEmptyDistance(x, y, 3);
                    for (var i = y; i < rect[3]; i++) {
                        rect[0] = Math.max(x - this.getEmptyDistance(x, i, 4), rect[0]);
                        rect[2] = Math.min(x + this.getEmptyDistance(x, i, 2), rect[2]);
                    }
                    break;
                case 4:
                    rect[0] = x - this.getEmptyDistance(x, y, 4);
                    rect[1] = y - this.getEmptyDistance(x, y, 1);
                    rect[2] = x;
                    rect[3] = y + this.getEmptyDistance(x, y, 3);
                    for (var i = x; i > rect[0]; i--) {
                        rect[1] = Math.max(y - this.getEmptyDistance(i, y, 1), rect[1]);
                        rect[3] = Math.min(y + this.getEmptyDistance(i, y, 3), rect[3]);
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
                    if(this.grid[i + x][j + y].tileType == "Empty"){
                        this.setTile(i + x, j + y, room.grid[i][j]);
                    }
                }
            }
        },
        canAddRoom: function(x, y, room) {
            for(var i = 0; i < room.width; i++){
                for(var j = 0; j < room.height; j++){
                    if(this.grid[i+x][j+y].tileType != "Empty" && room.grid[i][j].tileType != "Empty"){
                        return false;
                    }
                }
            }
            return true;
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