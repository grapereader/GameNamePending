define(["tile/tile","tile/wall","tile/path","tile/door","view/viewobject"], function(Tile,Wall,Path,Door,ViewObject) {

    var Room = Class({
        constructor: function(gameManager){
            this.gameManager = gameManager;
            this.entrances = 0000; //binary number with the bits set in order based on if there is an entrance on the top,right,bottom,left.
            this.entranceLocations = []; //Array composed of sets of coordinates representing the X offset from the left and then the Y offset from the top.
            this.width = 0;
            this.height = 0;
            this.grid = [[]];
        },


        createGrid: function(width,height){
            var grid = new Array(width);
            for(var i = 0;i < width;i++){
                grid[i] = new Array(height);
            }
            return grid;
        },
        //Set the tile at position x,y by passing the stringified tile info.
        setTile: function(x,y,tileInfo){
            this.grid[x][y] = parseJSONTile(tileInfo);
        },

        parseJSONTile: function(tileInfo){
            var info = JSON.parse(tileInfo);
            switch(info.type){
                case "Wall":
                    var temp = new Wall(this.gameManager);                            
                break;
                case "Path":
                    var temp = new Path(this.gameManager);
                break;
                case "Door":
                    var temp = new Door(this.gameManager);
                break;
            }
            temp.fromJSON(tileInfo);
            return temp;
        },
        toJSON: function(){
            var tiles = new Array(width);
            for(var i = 0; i < width;i++){
                tiles[i]new Array(height);
                for(var j = 0; j < height; j++){
                    tiles[i][j]=grid[i][j].toJSON();
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
        fromJSON: function(roomInfo){
            var info = JSON.parse(roomInfo);
            this.entrances = info.entrances;
            this.entranceLocations = info.entranceLocations;
            this.width = info.width;
            this.height = info.height;
            this.grid = info.grid;
            
        }
    });



}