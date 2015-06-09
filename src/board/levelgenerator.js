define(["board/board", "tile/wall", "tile/path", "tile/door", "board/room", "tile/tile", "board/roomtemplates", "entity/enemyspawner"], function(Board, Wall, Path, Door, Room, Tile, RoomTemplates, EnemySpawner) {

    var LevelGenerator = Class({
        constructor: function(gameManager) {
            this.gameManager = gameManager;
            this.roomTemplates = new RoomTemplates(this.gameManager);

        },

        getTestBoard: function() {
            this.board = new Board(this.gameManager, 150, 150);
            this.board.initializeGrid();
            this.board.addRoom(67, 67, this.createTestRoom());
            return this.board;
        },
        generateLevel: function(gamma) { //Gamma is the tuning variable for the probability of the doors being deleted as they get further from the center.
            var board = new Board(this.gameManager, 150, 150);
            var centralRoom = this.generateRandomRoom(4, -1, -1, board); //Creates central room with atleast two entrances for the purposes of the algorithm not necessarily where the player will spawn
            centralRoom.x = Math.floor((board.gridWidth / 2) - (centralRoom.width / 2));
            centralRoom.y = Math.floor((board.gridHeight / 2) - (centralRoom.height / 2));
            board.addRoom(Math.floor((board.gridWidth / 2) - (centralRoom.width / 2)), Math.floor((board.gridHeight / 2) - (centralRoom.height / 2)), centralRoom);
            board.roomList.push(centralRoom);
            //return board;
            do { //Main Algorithm adding rooms to entrances randomly closing more doors based on their distance from the center of the level
                var isolatedEntrance = board.getIsolatedEntrance();
                //Removes Entrances from board
                //console.log(isolatedEntrances);
                var entranceX = isolatedEntrance[0];
                var entranceY = isolatedEntrance[1];
                //console.log((Math.sqrt(Math.pow(board.gridWidth/2-entranceX, 2) + Math.pow(board.gridHeight/2-entranceY, 2)) / 100 + gamma + Math.random()));
                if ((Math.sqrt(Math.pow(board.gridWidth / 2 - entranceX, 2) + Math.pow(board.gridHeight / 2 - entranceY, 2)) / 50 + gamma + Math.random()) > 2) { //Door will be removed
                    board.setTile(new Wall(this.gameManager).setPosition(entranceX, entranceY));
                } else {
                    //Determines which side of the entrance needs a room
                    //var rect;
                    var direction;
                    //var distanceFromEdge;
                    //console.log(entranceX,entranceY);
                    if (board.grid[entranceX][entranceY - 1].tileType == "Empty") {
                        //rect = board.getEmptyRectangle(entranceX, entranceY - 1, 1);
                        direction = 1;
                        //distanceFromEdge = Math.min(entranceX - rect[0], rect[2] - entranceX);

                    } else if (board.grid[entranceX + 1][entranceY].tileType == "Empty") {
                        //rect = board.getEmptyRectangle(entranceX + 1, entranceY, 2);
                        direction = 2;
                        //distanceFromEdge = Math.min(entranceY - rect[1], rect[3] - entranceY);

                    } else if (board.grid[entranceX][entranceY + 1].tileType == "Empty") {
                        //rect = board.getEmptyRectangle(entranceX, entranceY + 1, 3);
                        direction = 3;
                        //distanceFromEdge = Math.min(entranceX - rect[0], rect[2] - entranceX);
                    } else if (board.grid[entranceX - 1][entranceY].tileType == "Empty") {
                        //rect = board.getEmptyRectangle(entranceX - 1, entranceY, 4);
                        direction = 4;
                        //distanceFromEdge = Math.min(entranceY - rect[1], rect[3] - entranceY);
                    }
                    //console.log(rect);
                    //return board;
                    var minimumEntrances = Math.max(-1, 3 - (0.15 * Math.sqrt(Math.pow(board.gridWidth / 2 - entranceX, 2) + Math.pow(board.gridHeight / 2 - entranceY, 2)) + Math.random()));
                    var room = this.generateRandomRoom(minimumEntrances, (direction == 1 || direction == 3) ? direction ^ 2 : direction ^ 6, [entranceX, entranceY], board);
                    if (room == -1) {
                        board.setTile(new Wall(this.gameManager).setPosition(entranceX, entranceY));
                    } else {
                        board.addRoom(room.x, room.y, room);

                        board.roomList.push(room);
                        //if(board.roomList.length > 1){
                        // return board;
                        //}
                    }

                }



            } while (board.getIsolatedEntrance() != -1);

            for (var j = 0; j < board.roomList.length; j++) {
                for (var i = 0; i < board.roomList[j].entrances.length; i++) {
                    var numWalls = 0;
                    if (board.grid[board.roomList[j].entranceLocations[i][0] + board.roomList[j].x - 1][board.roomList[j].entranceLocations[i][1] + board.roomList[j].y].tileType == "Wall") numWalls++;
                    if (board.grid[board.roomList[j].entranceLocations[i][0] + board.roomList[j].x][board.roomList[j].entranceLocations[i][1] + board.roomList[j].y - 1].tileType == "Wall") numWalls++;
                    if (board.grid[board.roomList[j].entranceLocations[i][0] + board.roomList[j].x + 1][board.roomList[j].entranceLocations[i][1] + board.roomList[j].y].tileType == "Wall") numWalls++;
                    if (board.grid[board.roomList[j].entranceLocations[i][0] + board.roomList[j].x][board.roomList[j].entranceLocations[i][1] + board.roomList[j].y + 1].tileType == "Wall") numWalls++;
                    if (numWalls >= 3) {
                        board.setTile(new Wall(this.gameManager).setPosition(board.roomList[j].entranceLocations[i][0] + board.roomList[j].x, board.roomList[j].entranceLocations[i][1] + board.roomList[j].y));
                    }
                    if (board.grid[board.roomList[j].entranceLocations[i][0] + board.roomList[j].x - 1][board.roomList[j].entranceLocations[i][1] + board.roomList[j].y].tileType == "Door") board.setTile(new Path(this.gameManager).setPosition(board.roomList[j].entranceLocations[i][0] + board.roomList[j].x - 1, board.roomList[j].entranceLocations[i][1] + board.roomList[j].y));
                    if (board.grid[board.roomList[j].entranceLocations[i][0] + board.roomList[j].x][board.roomList[j].entranceLocations[i][1] + board.roomList[j].y - 1].tileType == "Door") board.setTile(new Path(this.gameManager).setPosition(board.roomList[j].entranceLocations[i][0] + board.roomList[j].x, board.roomList[j].entranceLocations[i][1] + board.roomList[j].y - 1));
                    if (board.grid[board.roomList[j].entranceLocations[i][0] + board.roomList[j].x + 1][board.roomList[j].entranceLocations[i][1] + board.roomList[j].y].tileType == "Door") board.setTile(new Path(this.gameManager).setPosition(board.roomList[j].entranceLocations[i][0] + board.roomList[j].x + 1, board.roomList[j].entranceLocations[i][1] + board.roomList[j].y));
                    if (board.grid[board.roomList[j].entranceLocations[i][0] + board.roomList[j].x][board.roomList[j].entranceLocations[i][1] + board.roomList[j].y + 1].tileType == "Door") board.setTile(new Path(this.gameManager).setPosition(board.roomList[j].entranceLocations[i][0] + board.roomList[j].x, board.roomList[j].entranceLocations[i][1] + board.roomList[j].y + 1));
                }
            }

            console.log("Created level with " + board.roomList.length + " rooms.");

            //This seems to be the only way I can get mouse events to propagate properly
            //when the empty areas of the board are clicked...
            var emptyBack = new PIXI.Graphics();
            emptyBack.beginFill(0x555555);
            emptyBack.drawRect(0, 0, board.gridWidth * 64, board.gridHeight * 64);
            emptyBack.endFill();
            board.container.addChildAt(emptyBack, 0);

            console.log("Adding enemies...");
            var enemySpawner = new EnemySpawner(this.gameManager);
            var rooms = board.roomList;
            var spawned = 0;
            for (var r = 0; r < rooms.length; r++) {
                enemySpawner.nextRandom();
                var room = rooms[r];
                var walkable = room.getWalkableTiles();
                var enemies = Math.floor(Math.random() * (walkable.length / 10));
                spawned += enemies;
                for (var i = 0; i < enemies; i++) {
                    var t = Math.floor(Math.random() * walkable.length);
                    var tile = walkable[t];
                    var enemy = enemySpawner.getLeveledEnemy(tile.tileX, tile.tileY);
                    spawned++;
                    board.addEnemy(enemy);
                    walkable.splice(t, 1);
                }
            }
            console.log("Spawned " + spawned + " enemies.");

            return board;
        },
        generateRandomRoom: function(minEntrances, requiredDirection, entranceLocation, board) {
            var room;
            var roomList = this.roomTemplates.getRooms();
            do {
                var requirementsMet = true;
                if (roomList.length == 0) {
                    return -1;
                }
                room = roomList.splice(Math.floor(Math.random() * roomList.length), 1)[0];
                if (minEntrances > room.entrances.length) {
                    requirementsMet = false;
                } else if (requiredDirection != -1) {
                    var roomBackup = room;
                    for (var j = 0; j < 12; j++) {
                        if (j != 0) {
                            room = roomBackup;
                            room.rotateRoom(1 + Math.floor(j / 4));
                            if (j % 3 != 0) {
                                room.flipRoom((j % 3 == 1) ? false : true);
                            }
                        }
                        for (var i = 0; i < room.entrances.length; i++) {
                            if (room.entrances[i] == requiredDirection) {
                                switch (requiredDirection) {
                                    case 1:
                                        room.y = (entranceLocation[1] + 1);
                                        room.x = entranceLocation[0] - (room.entranceLocations[i][0]);
                                        break;
                                    case 2:
                                        room.y = entranceLocation[1] - (room.entranceLocations[i][1]);
                                        room.x = (entranceLocation[0]) - room.width;
                                        break;
                                    case 3:
                                        room.y = (entranceLocation[1]) - room.height;
                                        room.x = entranceLocation[0] - (room.entranceLocations[i][0]);
                                        break;
                                    case 4:
                                        room.y = entranceLocation[1] - (room.entranceLocations[i][1]);
                                        room.x = (entranceLocation[0] + 1);
                                        break;
                                }
                                if (board.canAddRoom(room.x, room.y, room)) {
                                    board.setTile(new Path(this.gameManager).setPosition(room.x + room.entranceLocations[i][0], room.y + room.entranceLocations[i][1]));
                                    return room;
                                } else {
                                    requirementsMet = false;
                                }
                            }
                        }
                    }
                }
            } while (!requirementsMet);
            return room;
        },

        createTestRoom: function() {
            var width = 15;
            var height = 15;
            this.grid = new Array(width);
            for (var i = 0; i < width; i++) {
                this.grid[i] = new Array(height);
                for (var j = 0; j < height; j++) {
                    var temp;

                    /**if(i==Math.floor(width/2)&&j==0||i==0&&j==Math.floor(height/2)){
                        temp = new Door(this);
                    */
                    if (i == 0 && j == 0 || i == width - 1 && j == 0 || j == height - 1 && i == 0 || j == height - 1 && i == width - 1) {
                        temp = new Wall(this.gameManager);
                    } else {
                        temp = new Tile(this.gameManager);
                    }
                    this.grid[i][j] = temp.setPosition(i, j).toJSON();
                }
            }
            var room = {
                width: width,
                height: height,
                entrances: [1, 4],
                entranceLocations: [
                    [2, 0],
                    [0, 2]
                ],
                grid: this.grid
            };
            var r = new Room(this.gameManager);
            r.fromJSON(JSON.stringify(room));
            return r;
        }

    });
    return LevelGenerator;

});
