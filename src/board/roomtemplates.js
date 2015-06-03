define(["tile/tile", "tile/wall", "tile/path", "tile/door","tile/chest","tile/torch","board/room", "view/viewobject"], function(Tile, Wall, Path, Door, Chest, Torch, Room, ViewObject) {

    var RoomTemplates = Class({
        constructor: function(gameManager) {
            this.gameManager = gameManager;
            this.roomsRaw = {
                "circular4EntranceRoom": [
                    ["Empty", "Wall", "Wall", "Door", "Wall", "Wall", "Empty"],
                    ["Wall", "Wall", "Path", "Path", "Path", "Wall", "Wall"],
                    ["Wall", "Path", "Path", "Path", "Path", "Path", "Wall"],
                    ["Door", "Path", "Path", "Torch", "Path", "Path", "Door"],
                    ["Wall", "Path", "Path", "Path", "Path", "Path", "Wall"],
                    ["Wall", "Wall", "Path", "Path", "Path", "Wall", "Wall"],
                    ["Empty", "Wall", "Wall", "Door", "Wall", "Wall", "Empty"]
                ],
                "tinyChestRoom": [
                    ["Wall", "Wall", "Wall"],
                    ["Wall", "Chest", "Door"],
                    ["Wall", "Wall", "Wall"]
                ],
                "5x5RoomEmpty":[["Wall","Wall","Door","Wall","Wall"],["Wall","Path","Path","Path","Wall"],["Door","Path","Path","Path","Door"],["Wall","Path","Path","Path","Wall"],["Wall","Wall","Door","Wall","Wall"]],
                "5x5RoomTorches":[["Wall","Wall","Wall","Door","Wall"],["Wall","Torch","Path","Path","Wall"],["Wall","Path","Path","Path","Wall"],["Door","Path","Path","Path","Wall"],["Wall","Wall","Wall","Wall","Wall"]],
                "7x7RoomEmpty":[["Wall","Wall","Wall","Door","Wall","Wall","Wall"],["Wall","Path","Path","Path","Path","Path","Wall"],["Wall","Path","Path","Path","Path","Path","Wall"],["Door","Path","Path","Path","Path","Path","Door"],["Wall","Path","Path","Path","Path","Path","Wall"],["Wall","Path","Path","Path","Path","Path","Wall"],["Wall","Wall","Wall","Door","Wall","Wall","Wall"]],
                "7x7RoomTorches":[["Wall","Wall","Wall","Door","Wall","Wall","Wall"],["Wall","Torch","Path","Path","Path","Torch","Wall"],["Wall","Path","Path","Path","Path","Path","Wall"],["Door","Path","Path","Path","Path","Path","Door"],["Wall","Path","Path","Path","Path","Path","Wall"],["Wall","Torch","Path","Path","Path","Torch","Wall"],["Wall","Wall","Wall","Door","Wall","Wall","Wall"]],
                "9x9RoomEmpty":[["Wall","Wall","Wall","Wall","Door","Wall","Wall","Wall","Wall"],["Wall","Path","Path","Path","Path","Path","Path","Path","Wall"],["Wall","Path","Path","Path","Path","Path","Path","Path","Wall"],["Wall","Path","Path","Path","Path","Path","Path","Path","Wall"],["Door","Path","Path","Path","Path","Path","Path","Path","Door"],["Wall","Path","Path","Path","Path","Path","Path","Path","Wall"],["Wall","Path","Path","Path","Path","Path","Path","Path","Wall"],["Wall","Path","Path","Path","Path","Path","Path","Path","Wall"],["Wall","Wall","Wall","Wall","Door","Wall","Wall","Wall","Wall"]],
                "9x9RoomTorches":[["Wall","Wall","Wall","Wall","Door","Wall","Wall","Wall","Wall"],["Wall","Path","Path","Path","Path","Path","Path","Path","Wall"],["Wall","Path","Torch","Path","Path","Path","Torch","Path","Wall"],["Wall","Path","Path","Path","Path","Path","Path","Path","Wall"],["Door","Path","Path","Path","Path","Path","Path","Path","Door"],["Wall","Path","Path","Path","Path","Path","Path","Path","Wall"],["Wall","Path","Torch","Path","Path","Path","Torch","Path","Wall"],["Wall","Path","Path","Path","Path","Path","Path","Path","Wall"],["Wall","Wall","Wall","Wall","Door","Wall","Wall","Wall","Wall"]],
                "9x9RoomChest":[["Wall","Wall","Wall","Wall","Wall","Wall","Wall","Wall","Wall"],["Wall","Path","Path","Path","Path","Path","Path","Path","Wall"],["Wall","Path","Wall","Wall","Wall","Wall","Wall","Path","Wall"],["Wall","Path","Wall","Path","Path","Chest","Wall","Path","Wall"],["Wall","Path","Wall","Path","Torch","Wall","Wall","Path","Wall"],["Wall","Path","Wall","Path","Path","Path","Path","Path","Wall"],["Wall","Path","Wall","Wall","Wall","Wall","Wall","Wall","Wall"],["Wall","Path","Path","Path","Path","Path","Path","Path","Door"],["Wall","Wall","Wall","Wall","Wall","Wall","Wall","Wall","Wall"]],
                "11x11RoomTorches":[["Wall","Wall","Wall","Wall","Wall","Door","Wall","Wall","Wall","Wall","Wall"],["Wall","Torch","Path","Path","Path","Path","Path","Path","Path","Torch","Wall"],["Wall","Path","Path","Path","Wall","Wall","Wall","Path","Path","Path","Wall"],["Wall","Path","Path","Path","Path","Path","Path","Path","Path","Path","Wall"],["Wall","Path","Wall","Path","Path","Path","Path","Path","Wall","Path","Wall"],["Door","Path","Wall","Path","Path","Torch","Path","Path","Wall","Path","Door"],["Wall","Path","Wall","Path","Path","Path","Path","Path","Wall","Path","Wall"],["Wall","Path","Path","Path","Path","Path","Path","Path","Path","Path","Wall"],["Wall","Path","Path","Path","Wall","Wall","Wall","Path","Path","Path","Wall"],["Wall","Torch","Path","Path","Path","Path","Path","Path","Path","Torch","Wall"],["Wall","Wall","Wall","Wall","Wall","Door","Wall","Wall","Wall","Wall","Wall"]],
                "11x11RoomChest":[["Wall","Wall","Wall","Wall","Wall","Wall","Wall","Wall","Wall","Wall","Wall"],["Door","Path","Path","Path","Path","Path","Path","Path","Path","Path","Wall"],["Wall","Wall","Wall","Wall","Wall","Wall","Wall","Wall","Wall","Path","Wall"],["Wall","Path","Path","Path","Path","Path","Path","Path","Wall","Path","Wall"],["Wall","Path","Torch","Path","Wall","Path","Wall","Path","Wall","Path","Wall"],["Wall","Path","Wall","Path","Wall","Chest","Wall","Path","Wall","Path","Wall"],["Wall","Path","Wall","Path","Wall","Path","Wall","Path","Torch","Path","Wall"],["Wall","Path","Wall","Path","Path","Path","Path","Path","Path","Path","Wall"],["Wall","Path","Wall","Wall","Wall","Wall","Wall","Wall","Wall","Wall","Wall"],["Wall","Path","Path","Path","Path","Path","Path","Path","Path","Path","Door"],["Wall","Wall","Wall","Wall","Wall","Wall","Wall","Wall","Wall","Wall","Wall"]],
                "DeadEndEmpty":[["Wall","Wall","Wall","Door","Wall"],["Wall","Path","Path","Path","Wall"],["Wall","Path","Path","Path","Wall"],["Wall","Path","Path","Path","Wall"],["Wall","Path","Path","Path","Wall"],["Wall","Wall","Wall","Wall","Wall"]],
                "DeadEndChest": [["Wall","Wall","Wall","Door","Wall"],["Wall","Path","Path","Path","Wall"],["Wall","Path","Path","Path","Wall"],["Wall","Path","Chest","Path","Wall"],["Wall","Path","Path","Path","Wall"],["Wall","Wall","Wall","Wall","Wall"]],
                "AntiChamber": [["Wall","Wall","Wall","Door","Wall","Wall","Wall"],["Wall","Wall","Path","Path","Path","Wall","Wall"],["Wall","Path","Path","Path","Path","Path","Wall"],["Wall","Path","Path","Torch","Path","Path","Wall"],["Wall","Path","Path","Path","Path","Path","Wall"],["Wall","Wall","Path","Path","Path","Wall","Wall"],["Wall","Wall","Wall","Path","Wall","Wall","Wall"],["Empty","Empty","Wall","Path","Wall","Empty","Empty"],["Empty","Empty","Wall","Path","Wall","Empty","Empty"],["Empty","Empty","Wall","Path","Wall","Empty","Empty"],["Empty","Empty","Wall","Door","Wall","Empty","Empty"]],
                "DeadEndCircle":[["Empty","Empty","Empty","Empty","Wall","Wall","Door","Wall","Wall","Empty","Empty","Empty","Empty"],["Empty","Empty","Wall","Wall","Path","Path","Path","Path","Path","Wall","Wall","Empty","Empty"],["Empty","Wall","Torch","Path","Path","Wall","Path","Wall","Path","Path","Torch","Wall","Empty"],["Empty","Wall","Path","Path","Path","Wall","Path","Wall","Path","Path","Path","Wall","Empty"],["Wall","Path","Path","Path","Path","Wall","Path","Wall","Path","Path","Path","Path","Wall"],["Wall","Path","Wall","Wall","Wall","Path","Path","Path","Wall","Wall","Wall","Path","Wall"],["Wall","Path","Path","Path","Path","Path","Torch","Path","Path","Path","Path","Path","Wall"],["Wall","Path","Wall","Wall","Wall","Path","Path","Path","Wall","Wall","Wall","Path","Wall"],["Wall","Path","Path","Path","Path","Wall","Path","Wall","Path","Path","Path","Path","Wall"],["Empty","Wall","Path","Path","Path","Wall","Path","Wall","Path","Path","Path","Wall","Empty"],["Empty","Wall","Torch","Path","Path","Wall","Path","Wall","Path","Path","Torch","Wall","Empty"],["Empty","Empty","Wall","Wall","Path","Path","Path","Path","Path","Wall","Wall","Empty","Empty"],["Empty","Empty","Empty","Empty","Wall","Wall","Wall","Wall","Wall","Empty","Empty","Empty","Empty"]],
                "3WayJuncton":[["Wall","Door","Wall","Wall","Wall","Door","Wall"],["Wall","Path","Wall","Path","Wall","Path","Wall"],["Wall","Path","Path","Path","Path","Path","Wall"],["Wall","Path","Wall","Path","Wall","Path","Wall"],["Wall","Wall","Wall","Door","Wall","Wall","Wall"]],
                "UTurn": [["Wall","Door","Wall","Empty","Empty","Empty","Empty","Empty","Wall","Door","Wall"],["Wall","Path","Path","Wall","Empty","Empty","Empty","Wall","Path","Path","Wall"],["Wall","Path","Path","Wall","Empty","Empty","Empty","Wall","Path","Path","Wall"],["Wall","Path","Path","Path","Wall","Empty","Wall","Path","Path","Path","Wall"],["Empty","Wall","Path","Path","Wall","Empty","Wall","Path","Path","Wall","Empty"],["Empty","Wall","Path","Path","Wall","Wall","Wall","Path","Path","Wall","Empty"],["Empty","Wall","Path","Path","Path","Path","Path","Path","Wall","Empty","Empty"],["Empty","Empty","Wall","Path","Path","Path","Path","Wall","Empty","Empty","Empty"],["Empty","Empty","Empty","Wall","Wall","Wall","Wall","Empty","Empty","Empty","Empty"]],
                "scarChest": [["Wall","Wall","Wall","Wall","Empty","Empty","Empty","Empty","Empty"],["Door","Path","Path","Wall","Wall","Wall","Empty","Empty","Empty"],["Wall","Path","Path","Path","Path","Wall","Wall","Wall","Wall"],["Wall","Wall","Path","Path","Path","Path","Path","Path","Wall"],["Empty","Wall","Wall","Wall","Path","Path","Path","Chest","Wall"],["Empty","Empty","Empty","Wall","Wall","Wall","Wall","Wall","Wall"]],
                "scarHallway": [["Wall","Wall","Wall","Wall","Empty","Empty","Empty","Empty","Empty"],["Door","Path","Path","Wall","Wall","Wall","Empty","Empty","Empty"],["Wall","Path","Path","Path","Path","Wall","Wall","Wall","Wall"],["Wall","Wall","Path","Path","Path","Path","Path","Path","Wall"],["Empty","Wall","Wall","Wall","Path","Path","Path","Path","Door"],["Empty","Empty","Empty","Wall","Wall","Wall","Wall","Wall","Wall"]],
                "darkRoomChest": [["Wall","Wall","Wall","Wall","Wall","Wall","Wall","Empty","Empty","Empty","Empty"],["Wall","Chest","Path","Wall","Path","Path","Torch","Wall","Wall","Empty","Empty"],["Wall","Path","Path","Path","Wall","Path","Path","Torch","Wall","Wall","Empty"],["Wall","Wall","Path","Path","Path","Wall","Path","Path","Torch","Wall","Wall"],["Wall","Path","Wall","Path","Path","Path","Wall","Path","Path","Torch","Wall"],["Wall","Path","Path","Wall","Path","Path","Path","Wall","Path","Path","Wall"],["Wall","Torch","Path","Path","Wall","Path","Path","Path","Wall","Path","Wall"],["Wall","Wall","Torch","Path","Path","Wall","Path","Path","Path","Path","Wall"],["Empty","Wall","Wall","Torch","Path","Path","Wall","Path","Wall","Path","Wall"],["Empty","Empty","Wall","Wall","Torch","Path","Path","Path","Path","Path","Door"],["Empty","Empty","Empty","Empty","Wall","Wall","Wall","Wall","Wall","Wall","Wall"]],
                "loopEmpty": [["Wall","Wall","Wall","Wall","Wall","Wall","Wall","Empty","Empty","Empty","Empty"],["Wall","Chest","Path","Wall","Path","Path","Torch","Wall","Wall","Empty","Empty"],["Wall","Path","Path","Path","Wall","Path","Path","Torch","Wall","Wall","Empty"],["Wall","Wall","Path","Path","Path","Wall","Path","Path","Torch","Wall","Wall"],["Wall","Path","Wall","Path","Path","Path","Wall","Path","Path","Torch","Wall"],["Wall","Path","Path","Wall","Path","Path","Path","Wall","Path","Path","Wall"],["Wall","Torch","Path","Path","Wall","Path","Path","Path","Wall","Path","Wall"],["Wall","Wall","Torch","Path","Path","Wall","Path","Path","Path","Path","Wall"],["Empty","Wall","Wall","Torch","Path","Path","Wall","Path","Wall","Path","Wall"],["Empty","Empty","Wall","Wall","Torch","Path","Path","Path","Path","Path","Door"],["Empty","Empty","Empty","Empty","Wall","Wall","Wall","Wall","Wall","Wall","Wall"]],
                "largeRoomChest": [["Wall","Wall","Wall","Wall","Wall","Wall","Door","Wall","Wall","Wall","Wall","Wall","Wall"],["Wall","Torch","Path","Path","Path","Path","Path","Path","Path","Path","Path","Torch","Wall"],["Wall","Path","Path","Path","Path","Path","Path","Path","Path","Path","Path","Path","Wall"],["Wall","Path","Path","Path","Path","Path","Path","Path","Path","Path","Path","Path","Wall"],["Wall","Path","Path","Path","Path","Path","Path","Path","Path","Path","Path","Path","Wall"],["Wall","Torch","Path","Path","Path","Path","Path","Path","Path","Path","Path","Torch","Wall"],["Empty","Wall","Path","Path","Path","Path","Path","Path","Path","Path","Path","Wall","Empty"],["Empty","Wall","Path","Path","Path","Path","Path","Path","Path","Path","Path","Wall","Empty"],["Empty","Wall","Path","Path","Path","Path","Path","Path","Path","Path","Path","Wall","Empty"],["Empty","Wall","Torch","Path","Path","Path","Path","Path","Path","Path","Torch","Wall","Empty"],["Empty","Empty","Wall","Path","Path","Path","Path","Path","Path","Path","Wall","Empty","Empty"],["Empty","Empty","Empty","Wall","Wall","Wall","Chest","Wall","Wall","Wall","Empty","Empty","Empty"],["Empty","Empty","Empty","Empty","Empty","Empty","Wall","Empty","Empty","Empty","Empty","Empty","Empty"]],
                "largeJunction": [["Empty","Empty","Empty","Empty","Empty","Wall","Door","Wall","Empty","Empty","Empty","Empty","Empty"],["Empty","Empty","Empty","Empty","Wall","Path","Path","Path","Wall","Empty","Empty","Empty","Empty"],["Empty","Empty","Empty","Empty","Wall","Path","Path","Path","Wall","Empty","Empty","Empty","Empty"],["Empty","Empty","Empty","Empty","Wall","Path","Path","Path","Wall","Empty","Empty","Empty","Empty"],["Empty","Wall","Wall","Wall","Wall","Path","Path","Path","Wall","Wall","Wall","Wall","Empty"],["Wall","Path","Path","Path","Path","Path","Path","Path","Path","Path","Path","Path","Wall"],["Door","Path","Path","Path","Path","Path","Torch","Path","Path","Path","Path","Path","Door"],["Wall","Path","Path","Path","Path","Path","Path","Path","Path","Path","Path","Path","Wall"],["Empty","Wall","Wall","Wall","Wall","Path","Path","Path","Wall","Wall","Wall","Wall","Empty"],["Empty","Empty","Empty","Empty","Wall","Path","Path","Path","Wall","Empty","Empty","Empty","Empty"],["Empty","Empty","Empty","Empty","Wall","Path","Path","Path","Wall","Empty","Empty","Empty","Empty"],["Empty","Empty","Empty","Empty","Wall","Path","Path","Path","Wall","Empty","Empty","Empty","Empty"],["Empty","Empty","Empty","Empty","Empty","Wall","Door","Wall","Empty","Empty","Empty","Empty","Empty"]],
                "twist2Chests": [["Wall","Wall","Wall","Wall","Wall","Door","Wall","Empty","Empty","Empty","Empty"],["Wall","Path","Path","Path","Wall","Path","Wall","Empty","Empty","Empty","Empty"],["Wall","Path","Chest","Path","Wall","Path","Wall","Empty","Empty","Empty","Empty"],["Wall","Path","Path","Path","Wall","Path","Wall","Empty","Empty","Empty","Empty"],["Wall","Wall","Path","Path","Path","Path","Path","Wall","Wall","Wall","Empty"],["Wall","Wall","Path","Path","Path","Path","Path","Path","Path","Wall","Empty"],["Empty","Empty","Wall","Wall","Path","Path","Path","Path","Path","Wall","Wall"],["Empty","Empty","Empty","Empty","Wall","Path","Wall","Path","Path","Path","Wall"],["Empty","Empty","Empty","Empty","Wall","Path","Wall","Path","Chest","Path","Wall"],["Empty","Empty","Empty","Empty","Wall","Path","Wall","Path","Path","Path","Wall"],["Empty","Empty","Empty","Empty","Wall","Door","Wall","Wall","Wall","Wall","Wall"]],
                "twist":[["Wall","Wall","Wall","Wall","Wall","Door","Wall","Empty","Empty","Empty","Empty"],["Wall","Path","Path","Path","Wall","Path","Wall","Empty","Empty","Empty","Empty"],["Wall","Path","Torch","Path","Wall","Path","Wall","Empty","Empty","Empty","Empty"],["Wall","Path","Path","Path","Wall","Path","Wall","Empty","Empty","Empty","Empty"],["Wall","Wall","Path","Path","Path","Path","Path","Wall","Wall","Wall","Empty"],["Wall","Wall","Path","Path","Path","Path","Path","Path","Path","Wall","Empty"],["Empty","Empty","Wall","Wall","Path","Path","Path","Path","Path","Wall","Wall"],["Empty","Empty","Empty","Empty","Wall","Wall","Wall","Path","Path","Path","Wall"],["Empty","Empty","Empty","Empty","Empty","Empty","Wall","Path","Torch","Path","Wall"],["Empty","Empty","Empty","Empty","Empty","Empty","Wall","Path","Path","Path","Wall"],["Empty","Empty","Empty","Empty","Empty","Empty","Wall","Wall","Wall","Wall","Wall"]],
                "twist1Chest":[["Wall","Wall","Wall","Wall","Wall","Door","Wall","Empty","Empty","Empty","Empty"],["Wall","Path","Path","Path","Wall","Path","Wall","Empty","Empty","Empty","Empty"],["Wall","Path","Torch","Path","Wall","Path","Wall","Empty","Empty","Empty","Empty"],["Wall","Path","Path","Path","Wall","Path","Wall","Empty","Empty","Empty","Empty"],["Wall","Wall","Path","Path","Path","Path","Path","Wall","Wall","Wall","Empty"],["Wall","Wall","Path","Path","Path","Path","Path","Path","Path","Wall","Empty"],["Wall","Wall","Wall","Wall","Path","Path","Path","Path","Path","Wall","Wall"],["Wall","Path","Path","Path","Wall","Path","Wall","Path","Path","Path","Wall"],["Wall","Path","Path","Path","Wall","Path","Wall","Path","Torch","Path","Wall"],["Wall","Path","Path","Path","Path","Path","Wall","Path","Path","Path","Wall"],["Wall","Path","Wall","Wall","Wall","Wall","Wall","Wall","Wall","Wall","Wall"],["Wall","Path","Path","Path","Path","Path","Path","Path","Path","Chest","Wall"],["Wall","Wall","Wall","Wall","Wall","Wall","Wall","Wall","Wall","Wall","Wall"]],
                "shortHallway": [["Wall","Wall","Wall"],["Door","Path","Door"],["Wall","Wall","Wall"]],
                "mediumHallway": [["Wall","Wall","Wall","Wall","Wall"],["Door","Path","Path","Path","Door"],["Wall","Wall","Wall","Wall","Wall"]],
                "longHallway": [["Wall","Wall","Wall","Wall","Wall","Wall","Wall","Wall"],["Door","Path","Path","Path","Path","Path","Path","Door"],["Wall","Wall","Wall","Wall","Wall","Wall","Wall","Wall"]],
                "shortHallwayCorner":[["Empty","Empty","Wall","Door","Wall"],["Empty","Empty","Wall","Path","Wall"],["Wall","Wall","Wall","Path","Wall"],["Door","Path","Path","Path","Wall"],["Wall","Wall","Wall","Wall","Wall"]],
                "mediumHallwayCorner":[["Empty","Empty","Empty","Empty","Wall","Door","Wall"],["Empty","Empty","Empty","Empty","Wall","Path","Wall"],["Empty","Empty","Empty","Empty","Wall","Path","Wall"],["Empty","Empty","Empty","Empty","Wall","Path","Wall"],["Wall","Wall","Wall","Wall","Wall","Path","Wall"],["Door","Path","Path","Path","Path","Path","Wall"],["Wall","Wall","Wall","Wall","Wall","Wall","Wall"]]
            }
            this.rooms = [];
            for(r in this.roomsRaw){
                this.rooms.push(this.roomConstructor(this.roomsRaw[r]));
            }
            console.log("Loaded Template Rooms");

        
        },

        roomConstructor: function(roomCompact) {
            var room = new Room(this.gameManager);
            room.width = roomCompact.length;
            room.height = roomCompact[0].length;
            room.grid = new Array(room.width);
            room.entrances = [];
            room.entranceLocations = [];
            for(var i = 0; i < room.width; i++){
                room.grid[i] = new Array(room.height);
                for(var j = 0; j < room.height; j++){
                    if(roomCompact[i][j] == "Door"){
                        var direction;
                        if(j == 0){
                            direction = 1;
                        }
                        else if(j == room.height - 1){
                            direction = 3;
                        }
                        else if(i == 0){
                            direction = 4;
                        }
                        else if(i == room.width-1){
                            direction = 2;
                        }                        
                        room.entrances.push(direction);
                        room.entranceLocations.push([i,j]);
                    }   
                    switch (roomCompact[i][j]) {
                        case "Empty":
                            room.grid[i][j] = new Tile(this.gameManager);
                            break;
                        case "Wall":
                            room.grid[i][j] = new Wall(this.gameManager);
                            break;
                        case "Path":
                            room.grid[i][j] = new Path(this.gameManager);
                            break;
                        case "Door":
                            room.grid[i][j] = new Door(this.gameManager);
                            break;
                        case "Chest":
                            room.grid[i][j] = new Chest(this.gameManager);
                            break;
                        case "Torch":
                            room.grid[i][j] = new Torch(this.gameManager);
                            break;
                    }
                }
            }     
            return room;
        }


    });
    return RoomTemplates;
});