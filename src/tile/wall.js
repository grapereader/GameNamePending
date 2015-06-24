define(["tile/tile", "util/helpers", "util/anim"], function(Tile, Helpers, Animation) {
    var Wall = Class(Tile, {
        constructor: function(gameManager) {
            Wall.$super.call(this, gameManager);
            this.clipping = true;
            this.container = new PIXI.Container();
            this.tileType = "Wall";
        },
        setSprite: function(board) {
            var n = this.getNeighbors(board);
            var left = n.left;
            var right = n.right;
            var top = n.top;
            var bot = n.bot;

            var layers = [];

            if (bot === "Empty" && top === "Path") layers.push("wall-top");

            if (bot !== "Path" && top === "Path") {
                if (right === "Path" && left === "Path") {
                    layers.push("wall-left");
                    layers.push("wall-right");
                    layers.push("wall-top");
                } else if (right === "Path") {
                    layers.push("wall-top-corner-right");
                } else if (left === "Path") {
                    layers.push("wall-top-corner-left");
                } else if (left === "Wall" && right === "Wall") {
                    layers.push("wall-top");
                }
            }

            if (top === "Wall" && left === "Path" && right === "Path" && bot === "Path") {
                layers.push("wall-left");
                layers.push("wall-right");
                layers.push("wall-bottom-corner-left");
            }

            if (bot === "Path" && top === "Empty") {
                if (left === "Wall" && right === "Wall") layers.push("wall-middle");
            }

            if (top === "Wall" && bot === "Wall" && left === "Path" && right === "Path") {
                layers.push("wall-left");
                layers.push("wall-right");
            }

            if (top === "Path" && bot === "Path") {
                layers.push("wall-top");
                layers.push("wall-middle");
            }


            for (var i = 0; i < layers.length; i++) {
                this.container.addChild(this.createSprite(layers[i]));
            }

        },
        update: function() {
            Wall.$superp.update.call(this);
        },
    });

    return Wall;

});
