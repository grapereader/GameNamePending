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

            var sidesPath = function(tile) {
                if (!(tile.right === "Path" || tile.left === "Path")) return false;
                return true;
            }

            var topSides = function() {
                var tn = n.tiles.top.getNeighbors(board);
                if (sidesPath(tn)) return tn;
                return false;
            }

            var botSides = function() {
                var bn = n.tiles.bot.getNeighbors(board);
                if (sidesPath(bn)) return bn;
                return false;
            }

            if (top === "Path") {
                layers = ["floor", "wall-middle"];
            }

            if (left === "Wall" && right === "Wall" && top === "Wall" && bot === "Wall") {
                layers = [];

            } else if (top !== "Wall" && bot !== "Wall" && left !== "Wall" && right !== "Wall") {
                if (top === "Path") layers = ["floor"];
                layers.push("wall-middle");

            } else if (left === "Wall" && right === "Wall") {
                if (top === "Path") layers = ["floor"];
                layers.push("wall-middle");

            } else if (top !== "Wall" && bot !== "Wall") {
                if (top === "Path") layers = ["floor"];
                layers.push("wall-middle");

            } else if (top === "Wall" && bot === "Wall") {
                if (left === "Path") layers.push("wall-left");
                if (right === "Path") layers.push("wall-right");

            } else if (top !== "Wall" && left !== "Wall" && right === "Wall" && bot === "Wall") {
                layers = ["floor", "wall-bottom-corner-left-reversed"];

            } else if (top !== "Wall" && right !== "Wall" && left === "Wall" && bot === "Wall") {
                layers = ["floor", "wall-bottom-corner-right-reversed"];

            } else if (bot !== "Wall" && right !== "Wall" && left === "Wall" && top === "Wall") {
                layers = ["wall-bottom-corner-right"];

            } else if (bot !== "Wall" && left !== "Wall" && right === "Wall" && top === "Wall") {
                layers = ["wall-bottom-corner-left"];

            }

            if (top === "Empty" && left === "Empty" && right === "Wall" && bot === "Wall") layers = ["wall-top-corner-left-stub"];
            if (top === "Empty" && right === "Empty" && left === "Wall" && bot === "Wall") layers = ["wall-top-corner-right-stub"];

            var topS = topSides();
            var botS = botSides();

            if (top === "Wall" && bot !== "Wall" && topS !== false) {
                layers = [];
                if (topS.left === "Path") layers.push("wall-left");
                if (topS.right === "Path") layers.push("wall-right");

                if (left === "Path") layers.push("wall-bottom-corner-left");
                else if (right === "Path") layers.push("wall-bottom-corner-right");
                else if (left === "Empty") layers.push("wall-right");
                else if (right === "Empty") layers.push("wall-left");
                else layers.push("wall-middle");
            }

            if (bot === "Wall" && top !== "Wall" && botS != false) {
                layers = [];

                if (top === "Path") layers.push("floor");

                if (left === "Path") layers.push("wall-bottom-corner-left");
                else if (right === "Path") layers.push("wall-bottom-corner-right");
                else if (left === "Empty") layers.push("wall-right");
                else if (right === "Empty") layers.push("wall-left");

                if (botS.left === "Path") layers.push("wall-top-corner-right-stub");
                if (botS.right === "Path") layers.push("wall-top-corner-left-stub");
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
