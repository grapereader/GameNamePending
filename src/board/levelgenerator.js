define(["entity/player", "item/manager", "util/helpers", "gui/inventory", "gui/window","board/board","tile/wall","tile/path","tile/door","board/room"], function(Player, ItemManager, Helpers, InventoryScreen, Window, Board, Wall, Path, Door, Room) {

    var LevelGenerator = Class({
        constructor: function(gameManager){
            this.gameManager = gameManager;
            this.Rooms = [];
        },  

        getTestBoard: function(){
            this.board = new Board(this.gameManager,100,100);
            this.board.initializeGrid();
            this.board.addRoom(50,50,this.createTestRoom());
            var r = this.createTestRoom();
            r.rotateRoom(1);
            this.board.addRoom(56,50,r);
            r = this.createTestRoom();
            r.rotateRoom(2);
            this.board.addRoom(55,56,r);
            r = this.createTestRoom();            
            r.rotateRoom(3);
            this.board.addRoom(50,55,r);
            return this.board;
        },
        generateLevel: function(gamma){ //Gamma is the tuning variable for the probability of the doors being deleted as they get further from the center. 
            var board = new Board(this.gameManager,100,100);
            var centralRoom = generateRandomRoom(-1,-1); //Creates central room with atleast two entrances for the purposes of the algorithm not necessarily where the player will spawn

            board.addRoom(Math.Floor((board.gridWidth/2)-(centralRoom.width/2)),Math.floor((board.gridWidth/2)-(centralRoom.width/2)),centralRoom);

            do{ //Main Algorithm adding rooms to entrances randomly closing more doors based on their distance from the center of the level
                var isolatedEntrances = board.getIsolatedEntrances();
                //Removes Entrances from board
                for(var i = 0; i < isolatedEntrances.length; i++){
                    var entrance = isolatedEntrances.pop();
                    var entranceX = entrances[0];
                    var entranceY = entrances[1];
                    if((Math.sqrt(Math.pow(entranceX,2)+Math.pow(entranceY,2))/100+gamma+Math.random())>2){ //Door will be removed if 
                        board.setTile(extranceX,entranceY,new Wall(this.gameManager));
                    }
                    else{
                        //Determines which side of the entrance needs a room
                        var rect;
                        var direction;
                        var distanceFromEdge;
                        if(grid[entranceX][entranceY-1] == "Empty") {
                            rect = getEmptyRectangle(entranceX,entranceY-1,1);
                            direction = 1;
                            distanceFromEdge = Math.min(entranceX-rect[0],rect[2]-entranceX);

                        }
                        else if(grid[entranceX+1][entranceY] == "Empty"){
                            rect = getEmptyRectangle(entranceX+1,entranceY,2);
                            direction = 2;
                            distanceFromEdge = Math.min(entranceY-rect[1],rect[3]-entranceY);

                        }      
                        else if(grid[entranceX][entranceY+1] == "Empty"){
                            rect = getEmptyRectangle(entranceX,entranceY+1,3);
                            direction = 3;
                            distanceFromEdge = Math.min(entranceX-rect[0],rect[2]-entranceX);
                        }
                        else if(grid[entranceX-1][entranceY] == "Empty"){
                            rect = getEmptyRectangle(entranceX-1,entranceY,4);
                            direction = 4;
                            distanceFromEdge = Math.min(entranceY-rect[1],rect[3]-entranceY);
                        }
                        var minEntrances = Math.sqrt(Math.pow(entranceX,2)+Math.pow(entranceY,2))
                        var room = generateRandomRoom(rect,minEntrances,(direction==1||direction==3) ? direction ^ 2 : direction ^ 6,[entranceX,entranceY]);
                        if(room==-1){
                            grid[entranceX][entranceY] = new Wall(this.gameManager)
                        }
                        else{

                        }

                    }
                }



            }while(isolatedEntrances.length!=0);

            return board;



            
        },
        generateRandomRoom: function(rect,minEntrances,requiredDirection,entranceLocation){ //pass -1 to have requirements ignored, will return room in correct orientation
            var room;
            var roomList = this.Rooms;
            while(roomList.length>0){
                do{
                    room = this.roomList.splice(Math.floor(Math.random()*this.roomList.length),1)[0];
                    if(this.roomList.length==0){
                        return -1;
                    }
                }while(rect!=-1&&((room.width>(rect[2]-rect[0])||(rect[3]-rect[1])>maxHeight)||room.entrances.length<minEntrances));                
                var roomBackup = room;
                for(var j = 0; j < 4; j++){
                    for(var i = 0; i < room.entrances.length; i++){
                        if(room.entrances[i]==requiredDirection){
                            if(room.entranceLocations[i]==1||room.entranceLocations[i]==3){
                                if(entranceLocations[i][0]>(room.width-1)-entranceLocations[i][0]&&entranceLocation[0]-rect[0]<rect[2]-entranceLocation[0]){
                                    room.flipRoom(false);
                                }
                                if((room.width-1)-entranceLocations[i][0]<=rect[2]-entranceLocation[0]&&entranceLocations[i][0]<=entranceLocation[0]-rect[0]){}
                                    return Room;
                                }
                            }else{
                                if(entranceLocations[i][1]>(room.height-1)-entranceLocations[i][1]&&entranceLocation[1]-rect[1]<rect[3]-entranceLocation[1]){
                                    room.flipRoom(true);
                                }
                                if((room.height-1)-entranceLocations[i][1]<=rect[3]-entranceLocation[1]&&entranceLocations[i][1]<=entranceLocation[1]-rect[1]){
                                    return Room;
                                }

                            }
                        }
                    }
                if(j!=0){
                    room = roomBackup;
                    r.rotateRoom(j);
                }
            }
            return -1;
            
        },

        createTestRoom: function(){
            var width = 5;
            var height = 4;
            this.grid = new Array(width);
            for(var i = 0;i < width;i++){
                this.grid[i] = new Array(height);
                for(var j = 0;j < height;j++){
                    var temp;
                    
                    if(i==Math.floor(width/2)&&j==0||i==0&&j==Math.floor(height/2)){
                        temp = new Door(this);
                    }
                    else if(i==0||j==0||i==width-1||j==height-1){
                        temp = new Wall(this);
                    }
                    else{
                        temp = new Path(this);
                    }
                    temp.tileSprite.x = i * temp.tileSprite.width;
                    temp.tileSprite.y = j * temp.tileSprite.height;
                    this.grid[i][j] = temp.toJSON();                    
                }
            }
            var room = {                
                width: width,
                height: height,
                entrances: [1,4],
                entranceLocations: [[2,0],[0,2]],
                grid: this.grid
            };
            var r = new Room(this.gameManager);            
            r.fromJSON(JSON.stringify(room));
            return r;
        }

    });
    return LevelGenerator;

});

