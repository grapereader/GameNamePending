define(["tile/tile","tile/wall","tile/path","tile/door"], function(Tile,Wall,Path,Door) {
	var Board = Class({
		constructor: function(gameManager,boardWidth,boardHeight){
			this.gameManager = gameManager;
			this.gridWidth = boardWidth;
			this.gridHeight = boardHeight;			
            this.tiles = {
                "wall": 0,
                "path": 1,
                "door": 2
            };			
			this.grid = this.initializeGrid(this.gridWidth,this.gridHeight);
		},
		initializeGrid: function(width,height){
            var grid = new Array(width);
			for(var i = 0;i < width;i++){
				grid[i] = new Array(height);
                for(var j = 0;j < height;j++){
                	var temp;
                    switch(i%2){
                    	case this.tiles.wall:
                    	temp = new Wall(this.gameManager);
                    	break;
                    	case this.tiles.path:
                    	temp = new Path(this.gameManager);
                    	break;
                    	case this.tiles.door:
                    	temp = new Door(this.gameManager);
                    	break;
                    }
                         
                    temp.tileSprite.x = i * temp.tileSprite.width;
                    temp.tileSprite.y = j * temp.tileSprite.height;
                    grid[i][j] = temp;
                }
            }
            return grid;
		},
		setTile: function(x,y,tile){
			this.grid[x][y] = tile;
		},
        update: function(){
			for(var i = 0; i < this.gridWidth; i++){
                for(var j = 0; j < this.gridHeight; j++){
                    this.grid[i][j].update();
                }
            }
        }
		/**

		*/

	});
	return Board;
});