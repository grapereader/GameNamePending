define([], function() {
	var Board = Class(Board,{
		constructor: function(gamemanager){
			this.tileGrid = [][];
			this.boardWidth = 10;
			this.boardHeight = 10;


		},
		setTile: function(x,y,tile){
			this.tileGrid[x][y] = tile;
		}
		getPathfindingMatrix: function(){
			var booleanMatrix = [][];
			for(var i = 0;i < this.boardHeight;i++){
				for(var j = 0;j < this.tileWidth;j++)
					booleanMatrix[i][j] = tileGrid[i][j].isClippable();
				}
			}
		}
		/**

		*/

	});
	return Board;
}