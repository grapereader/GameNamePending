define(["entity/player", "item/manager", "util/helpers", "gui/inventory", "gui/window","board/board","tile/wall","tile/path","tile/door","board/room"], function(Player, ItemManager, Helpers, InventoryScreen, Window, Board, Wall, Path, Door, Room) {

    var LevelGenerator = Class({
        constructor: function(gameManager){
            this.gameManager = gameManager;
        },  

        getBoard: function(){
            this.board = new Board(this.gameManager,30,30);
            this.board.addRoom(10,10,this.createTestRoom());
            return this.board;
        },
        /**
            Use for testing room templates
        */
        createTestRoom: function(){
            var width = 5;
            var height = 5;
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
                entrances: 0b1111,
                entranceLocations: [[1,0],[0,1],[2,1],[1,2]],
                grid: this.grid
            };
            var r = new Room(this);

            r.fromJSON(JSON.stringify(room));
            return r;
        }

    });
    return LevelGenerator;

});

