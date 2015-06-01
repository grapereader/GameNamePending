define(["tile/tile", "tile/wall", "tile/path", "tile/door", "tile/chest", "tile/torch", "view/viewobject"], function(Tile, Wall, Path, Door, torch, chest, ViewObject) {

    var Room = Class({
        constructor: function(gameManager) {
            this.gameManager = gameManager;
            this.entrances = []; //array of integers represting the entrances on the 1=north,2=east,3=south,4=west directions. Numbers should corresponde to doors in the entranceLocations list.
            this.entranceLocations = []; //Array composed of sets of coordinates representing the X offset from the left and then the Y offset from the top.
            this.width = 0;
            this.height = 0;
            this.x = 0;
            this.y = 0;
            this.grid = [
                []
            ];
        },
        flipRoom: function(direction) { //direction should equal true if room should be flipped across a horizontal line or false if flipped across a vertical line
            var newGrid = new Array(this.width);
            for (var i = 0; i < this.width; i++) {
                newGrid[i] = new Array(this.height);
                for (var j = 0; j < this.height; j++) {
                    if (direction) {
                        newGrid[i][j] = this.grid[i][(this.height - 1) - j];

                    } else {
                        newGrid[i][j] = this.grid[(this.width - 1) - i][j];
                    }
                }
            }
            this.grid = newGrid;
            switch (direction) {
                case true:
                    for (var i = 0; i < this.entrances.length; i++) {
                        if (this.entrances[i] == 1 || this.entrances[i] == 3) {
                            this.entrances[i] = this.entrances[i] ^ 2;
                        }
                        this.entranceLocations[i][0] = this.height - (this.entranceLocations[i][0] + 1);
                    }
                    break;
                case false:
                    for (var i = 0; i < this.entrances.length; i++) {
                        if (this.entrances[i] == 2 || this.entrances[i] == 4) {
                            this.entrances[i] = this.entrances[i] ^ 6;
                        }
                        this.entranceLocations[i][1] = this.width - (this.entranceLocations[i][1] + 1);
                    }
                    break;
            }

        },
        rotateRoom: function(direction) { //direction should equal 1 to rotate 90 degrees clockwise,2 for 180 degrees and 3 for 270 degrees

            if (direction != 2) {
                var newGrid = new Array(this.height);
                for (var i = 0; i < this.height; i++) {
                    newGrid[i] = new Array(this.width);
                    for (var j = 0; j < this.width; j++) {
                        switch (direction) {
                            case 1:
                                newGrid[i][j] = this.grid[j][(this.height - 1) - i];
                                break;
                            case 3:
                                newGrid[i][j] = this.grid[(this.width - 1) - j][i];
                                break;
                        }
                    }
                }
                var h = this.height;
                this.height = this.width;
                this.width = h;
            } else {
                var newGrid = new Array(this.width);
                for (var i = 0; i < this.width; i++) {
                    newGrid[i] = new Array(this.height);
                    for (var j = 0; j < this.height; j++) {
                        newGrid[i][j] = this.grid[(this.width - 1) - i][(this.height - 1) - j];
                    }
                }
            }
            this.grid = newGrid;
            switch (direction) {
                case 1:
                    for (var i = 0; i < this.entrances.length; i++) {
                        this.entrances[i] = (this.entrances[i] == 4) ? 1 : this.entrances[i] + 1;

                        var temp = this.entranceLocations[i][0];
                        this.entranceLocations[i][0] = (this.width - 1) - this.entranceLocations[i][1];
                        this.entranceLocations[i][1] = temp;

                    }
                    break;
                case 2:
                    for (var i = 0; i < this.entrances.length; i++) {
                        this.entrances[i] = (this.entrances[i] == 1 || this.entrances[i] == 3) ? this.entrances[i] ^ 2 : this.entrances[i] ^ 6;

                        this.entranceLocations[i][0] = (this.width - 1) - this.entranceLocations[i][0];
                        this.entranceLocations[i][1] = (this.height - 1) - this.entranceLocations[i][1];

                    }
                    break;
                case 3:
                    for (var i = 0; i < this.entrances.length; i++) {
                        this.entrances[i] = (this.entrances[i] == 1) ? 4 : this.entrances[i] - 1;
                        console.log(this.entranceLocations[i][0] + "," + this.entranceLocations[i][1]);
                        var temp = this.entranceLocations[i][0];
                        this.entranceLocations[i][0] = this.entranceLocations[i][1];
                        this.entranceLocations[i][1] = (this.height - 1) - temp;

                        console.log(this.entranceLocations[i][0] + "," + this.entranceLocations[i][1]);

                    }
                    break;
            }
        },
        createGrid: function(width, height) {
            var grid = new Array(width);
            for (var i = 0; i < width; i++) {
                grid[i] = new Array(height);
            }
            return grid;
        },
        //Set the tile at position x,y by passing the stringified tile info.
        setTile: function(x, y, tileInfo) {
            this.grid[x][y] = parseJSONTile(tileInfo);
        },

        parseJSONTile: function(tileInfo) {
            var temp;
            switch (tileInfo.type) {
                case "Empty":
                    temp = new Tile(this.gameManager);
                    break;
                case "Wall":
                    temp = new Wall(this.gameManager);
                    break;
                case "Path":
                    temp = new Path(this.gameManager);
                    break;
                case "Door":
                    temp = new Door(this.gameManager);
                    break;
                case "Chest":
                    temp = new Chest(this.gameManager);
                    break;
                case "Torch":
                    temp = new Torch(this.gameManager);
                    break;
            }
            temp.fromJSON(tileInfo);
            return temp;
        },
        toJSON: function() {
            var tiles = new Array(width);
            for (var i = 0; i < width; i++) {
                tiles[i] = new Array(height);
                for (var j = 0; j < height; j++) {
                    tiles[i][j] = grid[i][j].toJSON();
                }
            }
            var room = {
                width: this.width,
                height: this.height,
                entrances: this.entrances,
                entranceLocations: this.entranceLocations,
                grid: tiles
            };
            return room;
        },
        fromJSON: function(roomInfo) {
            var info = JSON.parse(roomInfo);
            this.entrances = info.entrances;
            this.entranceLocations = info.entranceLocations;
            this.width = info.width;
            this.height = info.height;
            this.grid = new Array(info.width);
            for (var i = 0; i < info.width; i++) {
                this.grid[i] = new Array(info.height);
                for (var j = 0; j < info.height; j++) {
                    this.grid[i][j] = this.parseJSONTile(info.grid[i][j]);
                }
            }

        }
    });

    return Room;

});