define(["tile/tile","tile/wall","tile/path","tile/door","view/viewobject"], function(Tile,Wall,Path,Door,ViewObject) {
    var Board = Class(ViewObject,{
        constructor: function(gameManager,boardWidth,boardHeight){
            Board.$super.call(this, gameManager.scene);
            this.gameManager = gameManager;
            this.gridWidth = boardWidth;
            this.gridHeight = boardHeight;
            //A little layering here to separate enemies from the tiles
            this.tileContainer = new PIXI.Container();
            this.enemyContainer = new PIXI.Container();
            this.addChild(this.tileContainer);
            this.addChild(this.enemyContainer);

            this.tiles = {
                "wall": 0,
                "path": 1,
                "door": 2
            };
            this.enemies = [];
            this.grid = this.initializeGrid(this.gridWidth,this.gridHeight);
        },
        initializeGrid: function(width,height){
            var grid = new Array(width);
            for(var i = 0;i < width;i++){
                grid[i] = new Array(height);
                for(var j = 0;j < height;j++){
                	var temp;
                    switch(i==0||i==width-1||j==0||j==height-1){
                    	case true:
                    	temp = new Wall(this.gameManager);
                    	break;
                    	case false:
                    	temp = new Path(this.gameManager);
                    	break;
                    }
                    temp.tileSprite.x = i * temp.tileSprite.width;
                    temp.tileSprite.y = j * temp.tileSprite.height;
                    grid[i][j] = temp;
                    this.tileContainer.addChild(temp.tileSprite);
                }
            }
            return grid;
        },
        addEnemy: function(e) {
            this.enemies.push(e);
            this.enemyContainer.addChild(e.container);
        },
        setTile: function(x,y,tile){
            this.grid[x][y] = tile;
        },
        update: function(){
            Board.$superp.update.call(this);
            for(var i = 0; i < this.gridWidth; i++){
                for(var j = 0; j < this.gridHeight; j++){
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
