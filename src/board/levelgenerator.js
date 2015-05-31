define(["entity/player", "item/manager", "util/helpers", "gui/inventory", "gui/window","board/board","tile/wall","tile/path","tile/door","board/room"], function(Player, ItemManager, Helpers, InventoryScreen, Window, Board, Wall, Path, Door, Room) {

    var LevelGenerator = Class({
        constructor: function(gameManager){
            this.gameManager = gameManager;
            //this.Rooms = new PIXI.JsonLoader("roomTemplates",false);
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
            var centralRoom = generateRandomRoom(-1,-1,2); //Creates central room with atleast two entrances for the purposes of the algorithm not necessarily where the player will spawn

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
                        if(grid[entranceX][entranceY-1] == "Empty") rect = getEmptyRectangle(entranceX,entranceY-1,1);
                        if(grid[entranceX+1][entranceY] == "Empty") rect = getEmptyRectangle(entranceX+1,entranceY,2);
                        if(grid[entranceX][entranceY+1] == "Empty") rect = getEmptyRectangle(entranceX,entranceY+1,3);
                        if(grid[entranceX-1][entranceY] == "Empty") rect = getEmptyRectangle(entranceX-1,entranceY,4);

                    }
                }



            }while(isolatedEntrances.length!=0);

            return board;



            
        },
        generateRandomRoom: function(maxWidth,maxHeight,minEntrances,entranceDirection){ //pass -1 as maxWidth or maxHeight to have dimensions ignored
            var room;
            do{
                room = this.Rooms[Math.floor(Math.random()*this.Rooms.length)];

            }while(room.width>maxWidth&&maxWidth!=-1||room.height>maxHeight&&maxHeight!=-1||room.entrances.length<minEntrances||!room.contains(entranceDirection));
            if(room.width>maxWidth){
                room.rotate(1);
            }
            return room;
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
                entranceLocations: [[0,2],[2,0]],
                grid: this.grid
            };
            var r = new Room(this.gameManager);            
            r.fromJSON(JSON.stringify(room));
            return r;
        }

    });
    return LevelGenerator;

});

