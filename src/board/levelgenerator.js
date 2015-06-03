define(["entity/player", "item/manager", "util/helpers", "gui/inventory", "gui/window", "board/board", "tile/wall", "tile/path", "tile/door", "board/room", "tile/tile", "board/roomtemplates"], function(Player, ItemManager, Helpers, InventoryScreen, Window, Board, Wall, Path, Door, Room, Tile, RoomTemplates) {

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
            var centralRoom = this.generateRandomRoom(-1, 4, -1, -1); //Creates central room with atleast two entrances for the purposes of the algorithm not necessarily where the player will spawn
            console.log(centralRoom);
            board.addRoom(Math.floor((board.gridWidth / 2) - (centralRoom.width / 2)), Math.floor((board.gridHeight / 2) - (centralRoom.height / 2)), centralRoom);
            console.log(centralRoom);
            //return board; 
            do { //Main Algorithm adding rooms to entrances randomly closing more doors based on their distance from the center of the level
                var isolatedEntrance = board.getIsolatedEntrance();
                //Removes Entrances from board
                //console.log(isolatedEntrances);
                var entranceX = isolatedEntrance[0];
                var entranceY = isolatedEntrance[1];
                //console.log((Math.sqrt(Math.pow(board.gridWidth/2-entranceX, 2) + Math.pow(board.gridHeight/2-entranceY, 2)) / 100 + gamma + Math.random()));
                if ((Math.sqrt(Math.pow(board.gridWidth/2-entranceX, 2) + Math.pow(board.gridHeight/2-entranceY, 2)) / 100 + gamma + Math.random()) > 2) { //Door will be removed                        
                    var temp = new Wall(this.gameManager);
                    board.setTile(entranceX, entranceY, temp);
                } else {
                    //Determines which side of the entrance needs a room
                    var rect;
                    var direction;
                    var distanceFromEdge;
                    //console.log(entranceX,entranceY);
                    if (board.grid[entranceX][entranceY - 1].tileType == "Empty") {
                        rect = board.getEmptyRectangle(entranceX, entranceY - 1, 1);
                        direction = 1;
                        distanceFromEdge = Math.min(entranceX - rect[0], rect[2] - entranceX);

                    } else if (board.grid[entranceX + 1][entranceY].tileType == "Empty") {
                        rect = board.getEmptyRectangle(entranceX + 1, entranceY, 2);
                        direction = 2;
                        distanceFromEdge = Math.min(entranceY - rect[1], rect[3] - entranceY);

                    } else if (board.grid[entranceX][entranceY + 1].tileType == "Empty") {
                        rect = board.getEmptyRectangle(entranceX, entranceY + 1, 3);
                        direction = 3;
                        distanceFromEdge = Math.min(entranceX - rect[0], rect[2] - entranceX);
                    } else if (board.grid[entranceX - 1][entranceY].tileType == "Empty") {
                        rect = board.getEmptyRectangle(entranceX - 1, entranceY, 4);
                        direction = 4;
                        distanceFromEdge = Math.min(entranceY - rect[1], rect[3] - entranceY);
                    }
                    var minEntrances = Math.sqrt(Math.pow(entranceX, 2) + Math.pow(entranceY, 2))
                    //console.log(rect);
                    //return board;
                    var room = this.generateRandomRoom(rect, 0, (direction == 1 || direction == 3) ? direction ^ 2 : direction ^ 6, [entranceX, entranceY]);
                    if (room == -1) {
                        board.setTile(entranceX,entranceY, new Wall(this.gameManager));
                    } else {
                        board.addRoom(room.x, room.y, room);
                        //return board;
                    }

                }
            


            } while (board.getIsolatedEntrance() != -1);

            return board;




        },
        generateRandomRoom: function(rect, minEntrances, requiredDirection, entranceLocation) { //pass -1 to have requirements ignored, will return room in correct orientation
            var room;
            var roomList = this.roomTemplates.rooms;
            //console.log("requiredDirection: " + requiredDirection);

            var minimumSpace = 100;
            if(rect != -1 || entranceLocation != -1){
                switch(requiredDirection){
                    case 1:
                    case 3:
                        minimumSpace = Math.min(rect[2] - entranceLocation[0], entranceLocation[0] - rect[0]);
                        break;
                    case 2:
                    case 4:                 
                        minimumSpace = Math.min(rect[3] - entranceLocation[1], entranceLocation[1] - rect[1]); 
                        break;
                }
            }
            while (roomList.length > 0) {
                do {
                    if (roomList.length == 0) {
                        //console.log("#@$@$#@$@#$@#$@#$@#$@#$No Rooms of correct dimensions");
                        return -1;
                    }
                    room = roomList.splice(Math.floor(Math.random() * roomList.length), 1)[0];
                    if(requiredDirection != -1){
                        room.toBestOrientation(requiredDirection);                    
                    }
                } while (rect != -1 && ((room.width > (rect[2] - rect[0]) || room.height > (rect[3] - rect[1]) || room.getClosestEntranceDistance() > minimumSpace)) || room.entrances.length < minEntrances); //getbestorientation and closest door
                var roomBackup = room;
                for (var j = 0; j < 4; j++) {
                    for (var i = 0; i < room.entrances.length; i++) {
                        if (room.entrances[i] == requiredDirection || requiredDirection == -1) {
                            //console.log(room.entrances[i],room.entranceLocations[i]);
                            if (room.entrances[i] == 1 || room.entrances[i] == 3) {

                                if(entranceLocation == -1){
                                    return room;
                                }
                                if (room.entranceLocations[i][0] > (room.width - 1) - room.entranceLocations[i][0] && entranceLocation[0] - rect[0] < rect[2] - entranceLocation[0] && entranceLocation[0] - (room.entranceLocations[i][0]) + room.height < rect[2] && entranceLocation[0] - (room.entranceLocations[i][0]) > rect[0]) {
                                    //console.log("flipped across vertical line");
                                    room.flipRoom(false);
                                }
                                if (((room.width - 1) - room.entranceLocations[i][0] <= rect[2] - entranceLocation[0] && room.entranceLocations[i][0] <= entranceLocation[0] - rect[0])) {
                                    switch (requiredDirection) {
                                        case 1:
                                            room.y = (entranceLocation[1] + 1);
                                            room.x = entranceLocation[0] - (room.entranceLocations[i][0]);
                                            break;
                                        case 3:
                                            room.y = (entranceLocation[1]) - room.height;
                                            room.x = entranceLocation[0] - (room.entranceLocations[i][0]);
                                            break;
                                    }

                                    return room;
                                }
                            } else {
                                if(entranceLocation == -1){
                                    return room;
                                }
                                if (room.entranceLocations[i][1] > (room.height - 1) - room.entranceLocations[i][1] && entranceLocation[1] - rect[1] < rect[3] - entranceLocation[1] && entranceLocation[1] - (room.entranceLocations[i][1]) + room.height < rect[3] && entranceLocation[1] - (room.entranceLocations[i][1]) > rect[1]) {
                                    room.flipRoom(true);
                                }
                                if (((room.height - 1) - room.entranceLocations[i][1] <= rect[3] - entranceLocation[1] && room.entranceLocations[i][1] <= entranceLocation[1] - rect[1])||entranceLocation == -1) {
                                    switch (requiredDirection) {
                                        case 2:
                                            room.y = entranceLocation[1] - (room.entranceLocations[i][1]);
                                            room.x = (entranceLocation[0]) - room.width;
                                            break;
                                        case 4:
                                            room.y = entranceLocation[1] - (room.entranceLocations[i][1]);
                                            room.x = (entranceLocation[0] + 1);
                                            break;
                                    }                                  
                                    return room;
                                }

                            }
                        }
                    }
                    if (j != 0) {
                        room = roomBackup;
                        room.rotateRoom(j);
                    }
                }

            }
            return -1;
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
                    temp.tileSprite.x = i * temp.tileSprite.width;
                    temp.tileSprite.y = j * temp.tileSprite.height;
                    this.grid[i][j] = temp.toJSON();
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